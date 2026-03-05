import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: taskId } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data, error } = await supabase
            .from('ai_tasks')
            .select('id, status, progress, message, result, error, type, payload')
            .eq('id', taskId)
            .eq('user_id', user.id)
            .single();

        if (error) return NextResponse.json({ error: error.message }, { status: 404 });

        return NextResponse.json(data);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
