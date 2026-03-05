'use client';

import React from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Video, Clock, ChevronRight, Search } from 'lucide-react';
import Link from 'next/link';

export default function WorkspacePage() {
    const supabase = createClient();
    const [projects, setProjects] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchProjects() {
            const { data } = await supabase
                .from('projects')
                .select('*')
                .order('updated_at', { ascending: false });

            if (data) setProjects(data);
            setLoading(false);
        }
        fetchProjects();
    }, [supabase]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Header with Search and New Project */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black font-heading gradient-text-primary mb-2">My Workspace</h2>
                    <p className="text-muted-silver">Quản lý các dự án video AI của bạn.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dim-gray group-focus-within:text-neon-cyan transition-colors" />
                        <input
                            type="text"
                            placeholder="Tìm dự án..."
                            className="input-dark pl-10 w-64 bg-white/5"
                        />
                    </div>
                    <button className="btn-primary flex items-center gap-2">
                        <Plus className="w-5 h-5 flex-shrink-0" />
                        <span>Tạo dự án mới</span>
                    </button>
                </div>
            </div>

            {projects.length === 0 ? (
                <div className="card-clay p-20 flex flex-col items-center text-center space-y-6 bg-white/[0.02]">
                    <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                        <Video className="w-10 h-10 text-dim-gray" />
                    </div>
                    <div className="max-w-xs">
                        <h3 className="text-xl font-bold font-heading mb-2">Chưa có dự án nào</h3>
                        <p className="text-muted-silver text-sm">Hãy bắt đầu hành trình sáng tạo của bạn bằng cách tạo dự án video đầu tiên.</p>
                    </div>
                    <button className="btn-ghost text-sm py-2 px-6">Xem hướng dẫn</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/workspace/${project.id}`}
                            className="card-clay p-5 group flex flex-col gap-4 relative overflow-hidden"
                        >
                            {/* Thumbnail Placeholder */}
                            <div className="aspect-video rounded-xl bg-midnight-abyss border border-white/5 flex items-center justify-center relative overflow-hidden">
                                {project.thumbnail_url ? (
                                    <img src={project.thumbnail_url} alt={project.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Video className="w-8 h-8 text-dim-gray/30" />
                                )}
                                <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-neon-cyan uppercase tracking-wider border border-white/10">
                                    {project.status}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="font-bold text-pure-white group-hover:text-neon-cyan transition-colors truncate">
                                    {project.name}
                                </h3>
                                <div className="flex items-center gap-2 text-[11px] text-dim-gray font-medium">
                                    <Clock className="w-3 h-3" />
                                    <span>Cập nhật {new Date(project.updated_at).toLocaleDateString('vi-VN')}</span>
                                </div>
                            </div>

                            <div className="pt-2 flex items-center justify-between border-t border-white/5">
                                <span className="text-[10px] font-bold text-dim-gray uppercase tracking-tighter">Mode: {project.mode}</span>
                                <ChevronRight className="w-4 h-4 text-dim-gray group-hover:text-neon-cyan translate-x-0 group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
