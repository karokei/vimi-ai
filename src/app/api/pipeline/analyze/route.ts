import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateJSON } from '@/lib/ai/gemini';

interface ClipAnalysis {
    sequence_number: number;
    title: string;
    content: string;
    screenplay: string;
}

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { projectId, novelText } = await req.json();
        if (!novelText) return NextResponse.json({ error: 'Missing novel text' }, { status: 400 });

        // 1. Get Project/Episode data
        let { data: episode, error: epError } = await supabase
            .from('episodes')
            .select('id')
            .eq('project_id', projectId)
            .order('created_at', { ascending: true })
            .limit(1)
            .maybeSingle();

        if (epError) throw epError;

        if (!episode) {
            // Auto-create episode if missing
            const { data: newEp, error: insertErr } = await supabase
                .from('episodes')
                .insert({
                    project_id: projectId,
                    user_id: user.id,
                    title: 'Episode 1',
                    sequence_number: 1,
                    novel_text: novelText
                })
                .select('id')
                .single();
            if (insertErr) throw insertErr;
            episode = newEp;
        }

        // 2. Call Gemini for analysis using the central helper
        const prompt = `
      Bạn là một trợ lý biên kịch chuyên nghiệp. 
      Nhiệm vụ: Phân tích đoạn trích tiểu thuyết dưới đây và chia nó thành các phân đoạn cảnh (Clips) để làm video.
      
      Văn bản tiểu thuyết:
      "${novelText}"
      
      Yêu cầu đầu ra là một ARRAY các JSON objects với cấu trúc chính xác như sau:
      [
        {
          "sequence_number": 1,
          "title": "Tên phân đoạn ngắn gọn",
          "content": "Đoạn văn gốc tương ứng",
          "screenplay": "Kịch bản chi tiết (Mô tả hình ảnh, hành động của nhân vật)"
        }
      ]
    `;

        const systemInstruction = "Chỉ trả về JSON array, không giải thích gì thêm.";

        // --- Fetch User Gemini Key ---
        const { data: pref } = await supabase
            .from('user_preferences')
            .select('google_ai_key')
            .eq('id', user.id)
            .single();

        const apiKey = pref?.google_ai_key;
        if (!apiKey && !process.env.GOOGLE_AI_API_KEY) {
            return NextResponse.json({ error: 'Missing Gemini API Key in Profile' }, { status: 400 });
        }

        // Using the unified generateJSON helper from @/lib/ai/gemini
        const clips = await generateJSON<ClipAnalysis[]>(prompt, systemInstruction, apiKey);

        // 3. Clear old clips if regenerating
        await supabase.from('clips').delete().eq('episode_id', episode.id);

        // 4. Save Clips to DB
        if (clips && Array.isArray(clips)) {
            for (const clip of clips) {
                await supabase.from('clips').insert({
                    episode_id: episode.id,
                    user_id: user.id,
                    sequence_number: clip.sequence_number,
                    title: clip.title,
                    content: clip.content,
                    screenplay: clip.screenplay,
                    status: 'completed'
                });
            }
        }

        return NextResponse.json({ success: true, count: clips?.length ?? 0 });
    } catch (error) {
        console.error('Pipeline Error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
