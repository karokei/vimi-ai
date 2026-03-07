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
        const projectId = searchParams.get('id');

        if (projectId) {
            const { data, error } = await supabase
                .from('novel_promotion_projects')
                .select('*')
                .eq('id', projectId)
                .single();

            if (error) throw error;
            return NextResponse.json(data);
        } else {
            const { data, error } = await supabase
                .from('novel_promotion_projects')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return NextResponse.json(data);
        }
    } catch (error: any) {
        console.error('Projects GET API Error:', error);
        return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, original_text } = body;

        if (!name || !original_text) {
            return NextResponse.json({ error: 'Missing name or original_text' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('novel_promotion_projects')
            .insert({
                user_id: user.id,
                name,
                original_text
            })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Projects POST API Error:', error);
        return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
    }
}
