import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const projectId = searchParams.get('projectId');
        const type = searchParams.get('type') || 'characters'; // characters, episodes, panels

        if (!projectId) {
            return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
        }

        if (type === 'characters') {
            const { data, error } = await supabase
                .from('novel_promotion_characters')
                .select(`
                    id, name, aliases, introduction, profile_data, profile_confirmed,
                    novel_promotion_character_appearances (
                        id, appearance_index, change_reason, descriptions, image_url, image_urls
                    )
                `)
                .eq('novel_promotion_project_id', projectId);

            if (error) throw error;
            return NextResponse.json(data);
        }

        if (type === 'episodes') {
            const { data, error } = await supabase
                .from('novel_promotion_episodes')
                .select('*')
                .eq('novel_promotion_project_id', projectId)
                .order('number', { ascending: true });

            if (error) throw error;
            return NextResponse.json(data);
        }

        if (type === 'panels') {
            const clipId = searchParams.get('clipId');
            if (!clipId) return NextResponse.json({ error: 'Missing clipId for panels' }, { status: 400 });

            const { data, error } = await supabase
                .from('novel_promotion_panels')
                .select('*')
                .eq('clip_id', clipId)
                .order('panel_number', { ascending: true });

            if (error) throw error;
            return NextResponse.json(data);
        }

        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

    } catch (error: any) {
        console.error('Assets GET API Error:', error);
        return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
    }
}
