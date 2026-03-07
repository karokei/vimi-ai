'use client';

import React from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Video, Clock, ChevronRight, Search, X, FolderOpen, MoreVertical, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import CreateProjectModal from '@/components/workspace/CreateProjectModal';
import DeleteProjectModal from '@/components/workspace/DeleteProjectModal';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';

interface Project {
    id: string;
    name: string;
    description: string | null;
    mode: string;
    status: string;
    thumbnail_url: string | null;
    updated_at: string;
}

export default function WorkspacePage() {
    const supabase = createClient();
    const [projects, setProjects] = React.useState<Project[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

    // New delete states
    const [projectToDelete, setProjectToDelete] = React.useState<Project | null>(null);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const fetchProjects = React.useCallback(async () => {
        const { data } = await supabase
            .from('projects')
            .select('id, name, description, mode, status, thumbnail_url, updated_at')
            .order('updated_at', { ascending: false });

        if (data) setProjects(data as Project[]);
        setLoading(false);
    }, [supabase]);

    React.useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleDelete = async () => {
        if (!projectToDelete) return;

        setIsDeleting(true);
        const { error } = await supabase.from('projects').delete().eq('id', projectToDelete.id);

        if (error) {
            toast.error('Deletion failed: ' + error.message);
        } else {
            toast.success('Dự án đã được xóa thành công.');
            fetchProjects();
            setProjectToDelete(null);
        }
        setIsDeleting(false);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium text-muted animate-pulse">Loading workspace...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in font-body">
            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={fetchProjects}
            />

            {projectToDelete && (
                <DeleteProjectModal
                    isOpen={!!projectToDelete}
                    onClose={() => setProjectToDelete(null)}
                    onConfirm={handleDelete}
                    projectName={projectToDelete.name}
                    loading={isDeleting}
                />
            )}

            {/* Page Header (Data-Dense Dashboard Style) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <h2 className="text-3xl font-bold font-heading text-white tracking-tight mb-1">
                        Projects Overview
                    </h2>
                    <p className="text-muted text-sm">
                        Manage your complete video production pipeline and assets.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Find a project..."
                            className="w-full sm:w-[280px] bg-surface border border-white/10 rounded-md py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted"
                        />
                    </div>
                    {/* View Toggle (Visual Only) */}
                    <div className="hidden sm:flex border border-white/10 rounded-md bg-surface p-1">
                        <button className="p-1.5 rounded bg-white/10 text-white shadow-sm" aria-label="Grid View">
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-primary hover:bg-[#1456A3] text-white text-sm font-medium px-5 py-2.5 rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        New Project
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            {projects.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Projects', value: projects.length.toString() },
                        { label: 'Active Drafts', value: projects.filter(p => !p.status?.toLowerCase().includes('complete')).length.toString() },
                        { label: 'Completed', value: projects.filter(p => p.status?.toLowerCase().includes('complete')).length.toString() },
                        { label: 'Storage Used', value: '1.2 GB' }, // Mock value for visual density
                    ].map((stat, i) => (
                        <div key={i} className="bg-surface border border-white/5 p-4 rounded-md flex flex-col justify-between">
                            <span className="text-xs font-medium text-muted uppercase tracking-wider">{stat.label}</span>
                            <span className="text-2xl font-bold font-heading text-white mt-1">{stat.value}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Project Grid */}
            {projects.length === 0 ? (
                <div className="bg-surface/50 border border-white/5 rounded-md p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-surface border border-white/10 flex items-center justify-center mb-6 shadow-sm">
                        <FolderOpen className="w-8 h-8 text-muted" />
                    </div>
                    <h3 className="text-xl font-bold font-heading text-white mb-2">No projects found.</h3>
                    <p className="text-muted text-sm max-w-sm mb-6">
                        Start your creative journey by establishing a new video project in your workspace.
                    </p>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-surface hover:bg-card border border-white/10 text-white text-sm font-medium px-6 py-2.5 rounded-md transition-colors shadow-sm"
                    >
                        Create Your First Project
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="group relative flex flex-col bg-surface border border-white/10 hover:border-white/20 rounded-md overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
                        >
                            {/* Card Header (Thumbnail) */}
                            <Link
                                href={`/workspace/${project.id}`}
                                className="w-full aspect-[16/9] bg-background relative overflow-hidden flex items-center justify-center border-b border-white/5"
                            >
                                {project.thumbnail_url ? (
                                    <Image
                                        src={project.thumbnail_url}
                                        alt={project.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                        unoptimized
                                    />
                                ) : (
                                    <Video className="w-8 h-8 text-muted/20 group-hover:text-primary/40 transition-colors" />
                                )}

                                {/* Status Badge Overlay */}
                                <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 shadow-sm flex items-center z-10">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent mr-1.5 animate-pulse"></span>
                                    <span className="text-[10px] font-black text-white uppercase tracking-wider">
                                        {project.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </Link>

                            {/* Card Body */}
                            <div className="p-5 flex flex-col flex-grow relative bg-gradient-to-b from-transparent to-black/20">
                                {/* Clickable area for body */}
                                <Link href={`/workspace/${project.id}`} className="absolute inset-0 z-0" aria-hidden="true" />

                                <div className="flex items-start justify-between mb-3 relative z-10">
                                    <h3 className="font-bold text-white group-hover:text-primary transition-colors line-clamp-1 pr-2 text-lg" title={project.name}>
                                        {project.name}
                                    </h3>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setProjectToDelete(project);
                                        }}
                                        className="p-2 -mr-1 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none relative z-20 border border-transparent hover:border-red-500/20"
                                        aria-label="Delete Project"
                                        title="Delete Project"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <p className="text-[13px] text-dim-gray mb-6 line-clamp-2 min-h-[40px] leading-relaxed relative z-10">
                                    {project.description || "No description provided. Click to edit workspace."}
                                </p>

                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10 relative z-10">
                                    <div className="flex items-center gap-2 text-[11px] text-muted-silver font-bold uppercase tracking-wide">
                                        <Clock className="w-3.5 h-3.5 text-primary" />
                                        <span>{new Date(project.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-[10px] uppercase font-black tracking-widest text-muted-silver border border-white/10 px-2 py-0.5 rounded bg-white/5">{project.mode.split('_')[0]}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
