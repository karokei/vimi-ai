import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AIOrchestrator } from '@/lib/ai/orchestrator';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { projectId, panelId } = await req.json();

        if (!panelId) {
            return NextResponse.json({ error: 'Panel ID is required' }, { status: 400 });
        }

        // 1. Create a background task for image generation
        const task = await AIOrchestrator.createTask({
            projectId,
            type: 'image-gen',
            payload: { panelId }
        });

        // 2. Trigger worker logic in background
        (async () => {
            await AIOrchestrator.runImageGen(task.id, panelId);
        })();

        return NextResponse.json({ success: true, taskId: task.id });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Image Gen API Error:', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
