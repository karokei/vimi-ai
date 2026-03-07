import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AIOrchestrator } from '@/lib/ai/orchestrator';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { action, projectId, ...payload } = body;

        if (!projectId || !action) {
            return NextResponse.json({ error: 'Missing projectId or action' }, { status: 400 });
        }

        // Tạo Task qua AIOrchestrator
        let task;

        switch (action) {
            case 'story-to-script':
                // Chạy phân tích truyện -> chia tập -> script
                await AIOrchestrator.runNovelStoryToScript({
                    projectId,
                    session: { user: { id: user.id } },
                    ...payload
                });
                return NextResponse.json({ success: true, message: 'Story to Script task queued.' });

            case 'script-to-storyboard':
                // Chạy script -> phân cảnh
                await AIOrchestrator.runNovelScriptToStoryboard({
                    projectId,
                    session: { user: { id: user.id } },
                    ...payload
                });
                return NextResponse.json({ success: true, message: 'Script to Storyboard task queued.' });

            case 'generate-panel-image':
                // Vẽ ảnh storyboard
                const { sendTask } = await import('@/lib/task/pg-boss');
                task = await AIOrchestrator.createTask({
                    projectId,
                    type: 'image-gen',
                    payload: { action: 'generate-panel-image', panelId: payload.panelId }
                });

                await sendTask('novel-panel-image', {
                    taskId: task.id,
                    projectId,
                    panelId: payload.panelId,
                    prompt: payload.prompt,
                    session: { user: { id: user.id } }
                });
                return NextResponse.json({ success: true, taskId: task.id, message: 'Panel image generation queued.' });

            case 'generate-character-image':
                // Vẽ character reference
                const pgBoss = await import('@/lib/task/pg-boss');
                task = await AIOrchestrator.createTask({
                    projectId,
                    type: 'image-gen',
                    payload: { action: 'generate-character-image', appearanceId: payload.appearanceId }
                });

                await pgBoss.sendTask('novel-character-image', {
                    taskId: task.id,
                    projectId,
                    appearanceId: payload.appearanceId,
                    prompt: payload.prompt,
                    session: { user: { id: user.id } }
                });
                return NextResponse.json({ success: true, taskId: task.id, message: 'Character image generation queued.' });

            default:
                return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
        }
    } catch (error: any) {
        console.error('Task API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
