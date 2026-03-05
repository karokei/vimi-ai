import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateJSON } from '@/lib/ai/gemini';
import { AIOrchestrator } from '@/lib/ai/orchestrator';

interface PanelAnalysis {
    clip_id: string;
    sequence_number: number;
    image_prompt: string;
    photography_rules: string;
    acting_notes: string;
}

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { projectId } = await req.json();

        // 1. Create a background task
        const task = await AIOrchestrator.createTask({
            projectId,
            type: 'text-analysis',
            payload: { phase: 'storyboard-generation' }
        });

        // 2. Trigger generation in the background (Non-blocking)
        (async () => {
            try {
                await AIOrchestrator.updateTask(task.id, { status: 'processing', progress: 5, message: 'Đang chuẩn bị dữ liệu...' });

                const { data: episode } = await supabase
                    .from('episodes')
                    .select('id')
                    .eq('project_id', projectId)
                    .single();

                if (!episode) throw new Error('Episode not found');

                const { data: clips } = await supabase
                    .from('clips')
                    .select('id, sequence_number, screenplay')
                    .eq('episode_id', episode.id)
                    .order('sequence_number', { ascending: true });

                if (!clips || clips.length === 0) throw new Error('No clips found');

                await AIOrchestrator.updateTask(task.id, { progress: 20, message: 'Đang gộp tài nguyên dự án...' });

                const { data: pChars } = await supabase
                    .from('project_characters')
                    .select('global_characters(name, description)')
                    .eq('project_id', projectId);

                const { data: pLocs } = await supabase
                    .from('project_locations')
                    .select('global_locations(name, description)')
                    .eq('project_id', projectId);

                const typedChars = pChars as unknown as Array<{ global_characters: { name: string; description: string } }>;
                const typedLocs = pLocs as unknown as Array<{ global_locations: { name: string; description: string } }>;

                const assetsContext = `
                    NHÂN VẬT ĐÃ CÓ: ${typedChars?.map((c) => `${c.global_characters?.name}: ${c.global_characters?.description}`).join('; ') || 'Không có'}
                    BỐI CẢNH ĐÃ CÓ: ${typedLocs?.map((l) => `${l.global_locations?.name}: ${l.global_locations?.description}`).join('; ') || 'Không có'}
                `;

                await AIOrchestrator.updateTask(task.id, { progress: 40, message: 'Gemini đang phác thảo khung hình...' });

                const allClipsText = clips.map(c => `[CLIP #${c.sequence_number}] Kịch bản: ${c.screenplay}`).join('\n\n');

                const prompt = `
                    Bạn là một Đạo diễn hình ảnh (Director of Photography) và Chuyên gia Storyboard.
                    Nhiệm vụ: Dựa trên kịch bản chi tiết của từng Clip và danh sách nhân vật/bối cảnh, hãy tạo ra các khung hình (Panels) cho toàn bộ tập phim.
                    
                    ${assetsContext}
                    
                    DANH SÁCH CLIPS:
                    ${allClipsText}
                    
                    YÊU CẦU:
                    1. Mỗi Clip nên có từ 1-3 Panels tùy độ dài.
                    2. "image_prompt": Mô tả hình ảnh chi tiết dùng để sinh ảnh (Tiếng Anh). Hãy miêu tả ngoại hình nhân vật dựa trên danh sách NHÂN VẶT ĐÃ CÓ.
                    3. "photography_rules": Quy tắc quay phim (Góc máy, ánh sáng, chuyển động).
                    4. "acting_notes": Chỉ đạo diễn xuất (Cảm xúc, hành động của nhân vật).
                    5. Trả về một ARRAY các JSON objects.
                    
                    Cấu trúc JSON đầu ra:
                    [
                        {
                            "clip_id": "ID_CỦA_CLIP_TƯƠNG_ỨNG",
                            "sequence_number": 1,
                            "image_prompt": "detailed description in English...",
                            "photography_rules": "Close-up, warm lighting...",
                            "acting_notes": "Main character looks surprised..."
                        }
                    ]
                    
                    Lưu ý quan trọng: "clip_id" phải khớp chính xác với ID của các clip trong danh sách sau:
                    ${clips.map(c => `Clip ${c.sequence_number}: ${c.id}`).join(', ')}
                `;

                const systemInstruction = "Chỉ trả về JSON array, không giải thích gì thêm.";
                const panels = await generateJSON<PanelAnalysis[]>(prompt, systemInstruction);

                await AIOrchestrator.updateTask(task.id, { progress: 80, message: 'Đang lưu Storyboard vào database...' });

                const clipIds = clips.map(c => c.id);
                // Clear and Insert
                await supabase.from('panels').delete().in('clip_id', clipIds);

                if (panels && Array.isArray(panels)) {
                    const panelsToInsert = panels.map(p => ({
                        clip_id: p.clip_id,
                        user_id: user.id,
                        sequence_number: p.sequence_number,
                        image_prompt: p.image_prompt,
                        photography_rules: p.photography_rules,
                        acting_notes: p.acting_notes,
                        status: 'completed'
                    }));

                    const { error: insertError } = await supabase.from('panels').insert(panelsToInsert);
                    if (insertError) throw insertError;
                }

                await AIOrchestrator.updateTask(task.id, {
                    status: 'completed',
                    progress: 100,
                    message: 'Hoàn tất Storyboard!',
                    result: { count: panels?.length ?? 0 }
                });
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : 'Unknown error';
                console.error('BG Storyboard Task Error:', error);
                await AIOrchestrator.updateTask(task.id, { status: 'failed', error: message });
            }
        })();

        return NextResponse.json({ success: true, taskId: task.id });
    } catch (error) {
        console.error('Storyboard Gen Error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
