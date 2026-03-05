import React from 'react';
import PipelineNav from '@/components/workspace/PipelineNav';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProjectLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    // Verify project ownership
    const { data: project } = await supabase
        .from('projects')
        .select('name')
        .eq('id', id)
        .single();

    if (!project) redirect('/workspace');

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-2xl font-black font-heading text-pure-white truncate max-w-md">
                        {project.name}
                    </h1>
                    <p className="text-[10px] text-dim-gray font-bold uppercase tracking-widest mt-1">
                        Production Pipeline • 7 Stages
                    </p>
                </div>

                <PipelineNav projectId={id} />
            </div>

            <div className="flex-1 overflow-hidden min-h-0">
                {children}
            </div>
        </div>
    );
}
