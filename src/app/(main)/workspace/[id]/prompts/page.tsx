'use client';

import React from 'react';
import { createClient } from '@/lib/supabase/client';
import {
    Sparkles,
    ChevronRight,
    Save,
    Zap,
    MessageSquare,
    Image as ImageLucide
} from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Link from 'next/link';
import TaskProgress from '@/components/ui/TaskProgress';

interface Panel {
    id: string;
    clip_id: string;
    sequence_number: number;
    image_prompt: string;
    image_url: string | null;
    status: string;
}

interface AICrossTask {
    id: string;
    panelId?: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    progress: number;
    message?: string;
    error?: string;
}

interface Clip {
    id: string;
    sequence_number: number;
    title: string;
    screenplay: string;
    panels?: Panel[];
}

export default function PromptsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: projectId } = React.use(params);
    const [clips, setClips] = React.useState<Clip[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [activeTasks, setActiveTasks] = React.useState<Record<string, AICrossTask>>({});
    const [editingPrompt, setEditingPrompt] = React.useState<Record<string, string>>({});

    const supabase = createClient();

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        const { data: episode } = await supabase
            .from('episodes')
            .select('id')
            .eq('project_id', projectId)
            .single();

        if (episode) {
            const { data: clipsData } = await supabase
                .from('clips')
                .select('id, sequence_number, title, screenplay')
                .eq('episode_id', episode.id)
                .order('sequence_number', { ascending: true });

            if (clipsData) {
                const clipIds = clipsData.map(c => c.id);
                const { data: panelsData } = await supabase
                    .from('panels')
                    .select('id, clip_id, sequence_number, image_prompt, image_url, status')
                    .in('clip_id', clipIds)
                    .order('sequence_number', { ascending: true });

                const clipsWithPanels = clipsData.map(clip => ({
                    ...clip,
                    panels: panelsData?.filter(p => p.clip_id === clip.id) || []
                }));

                setClips(clipsWithPanels);

                // Initialize editing state
                const prompts: Record<string, string> = {};
                panelsData?.forEach(p => {
                    prompts[p.id] = p.image_prompt || '';
                });
                setEditingPrompt(prompts);
            }
        }
        setLoading(false);
    }, [projectId, supabase]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Polling logic for multiple tasks
    React.useEffect(() => {
        const activeTaskIds = Object.values(activeTasks)
            .filter(t => t.status === 'pending' || t.status === 'processing')
            .map(t => t.id);

        if (activeTaskIds.length === 0) return;

        const interval = setInterval(async () => {
            const updatedTasks = { ...activeTasks };
            let hasChanges = false;

            for (const taskId of activeTaskIds) {
                try {
                    const res = await fetch(`/api/ai/task/${taskId}`);
                    const data = await res.json();

                    const panelId = Object.keys(activeTasks).find(k => activeTasks[k].id === taskId);
                    if (panelId && updatedTasks[panelId]) {
                        updatedTasks[panelId] = { ...data, panelId };
                        hasChanges = true;

                        if (data.status === 'completed') {
                            toast.success('Ảnh đã được vẽ xong! ✨');
                            fetchData(); // Refresh UI to show image
                        }
                    }
                } catch (err) {
                    console.error('Polling error:', err);
                }
            }

            if (hasChanges) setActiveTasks(updatedTasks);
        }, 3000);

        return () => clearInterval(interval);
    }, [activeTasks, fetchData]);

    const handleSavePrompt = async (panelId: string) => {
        const prompt = editingPrompt[panelId];
        try {
            const { error } = await supabase
                .from('panels')
                .update({ image_prompt: prompt })
                .eq('id', panelId);

            if (error) throw error;
            toast.success('Đã lưu prompt!');
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            toast.error('Lỗi khi lưu: ' + message);
        }
    };

    const handleGenerateImage = async (panelId: string) => {
        // Save first just in case
        await handleSavePrompt(panelId);

        try {
            const res = await fetch('/api/ai/image-gen', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, panelId }),
            });

            const data = await res.json();
            if (data.success && data.taskId) {
                setActiveTasks(prev => ({
                    ...prev,
                    [panelId]: {
                        id: data.taskId,
                        panelId,
                        status: 'pending',
                        progress: 0,
                        message: 'Đang khởi tạo Nano Banana 2...'
                    }
                }));
            } else {
                throw new Error(data.error || 'Lỗi không xác định');
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            toast.error('Lỗi khi sinh ảnh: ' + message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-electric-pink border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full space-y-10 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center shadow-lg shadow-neon-cyan/5">
                        <Zap className="w-6 h-6 text-neon-cyan" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black font-heading gradient-text-primary">Stage 5: Prompts & AI Gen</h2>
                        <p className="text-sm text-muted-silver">Sử dụng Nano Banana 2 (Gemini 3.1) để phác họa concept art cho phim.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link href={`/workspace/${projectId}/voice`} className="btn-primary flex items-center gap-2 group px-6">
                        <span>Tiếp tục Voice Gen</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Content Clips */}
            <div className="space-y-20">
                {clips.map(clip => (
                    <div key={clip.id} className="space-y-8">
                        <div className="flex items-center gap-4 px-2">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-dim-gray">
                                {clip.sequence_number}
                            </div>
                            <h3 className="text-lg font-black text-white/50">{clip.title}</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-12">
                            {clip.panels?.map(panel => (
                                <div key={panel.id} className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 card-clay bg-midnight-abyss/40 border-white/5">
                                    {/* Left: AI Image & Progress */}
                                    <div className="space-y-4">
                                        <div className="aspect-video rounded-2xl bg-black/40 border border-white/10 overflow-hidden relative group">
                                            {panel.image_url ? (
                                                <Image
                                                    src={panel.image_url}
                                                    alt="AI Generated"
                                                    fill
                                                    unoptimized
                                                    className="object-cover transition-transform group-hover:scale-110 duration-700"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-dim-gray space-y-4">
                                                    <ImageLucide className="w-12 h-12 opacity-20" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">No Image Generated</span>
                                                </div>
                                            )}

                                            {/* Status Badge */}
                                            <div className="absolute top-4 left-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${panel.image_url ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-orange-500/10 border-orange-500/20 text-orange-500'
                                                    }`}>
                                                    {panel.image_url ? 'Completed' : 'Draft'}
                                                </span>
                                            </div>
                                        </div>

                                        {activeTasks[panel.id] && (
                                            <TaskProgress
                                                status={activeTasks[panel.id].status}
                                                progress={activeTasks[panel.id].progress}
                                                message={activeTasks[panel.id].message}
                                                error={activeTasks[panel.id].error}
                                                onComplete={() => {
                                                    if (activeTasks[panel.id].status === 'completed') {
                                                        setTimeout(() => {
                                                            setActiveTasks(prev => {
                                                                const next = { ...prev };
                                                                delete next[panel.id];
                                                                return next;
                                                            });
                                                        }, 3000);
                                                    }
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Right: Prompt Editor */}
                                    <div className="flex flex-col space-y-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-neon-cyan flex items-center gap-2">
                                                    <MessageSquare className="w-3 h-3" />
                                                    Image Prompt
                                                </label>
                                                <span className="text-[9px] text-dim-gray font-mono">Nano Banana 2 Optimized</span>
                                            </div>
                                            <textarea
                                                value={editingPrompt[panel.id] || ''}
                                                onChange={(e) => setEditingPrompt(prev => ({ ...prev, [panel.id]: e.target.value }))}
                                                className="w-full h-40 bg-black/40 border border-white/10 rounded-2xl p-6 text-sm text-pure-white focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 outline-none resize-none transition-all leading-relaxed"
                                                placeholder="Describe the cinematic scene in English..."
                                            />
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleSavePrompt(panel.id)}
                                                className="btn-ghost flex-1 py-4 border-white/10 text-muted-silver hover:text-white flex items-center justify-center gap-2"
                                            >
                                                <Save className="w-4 h-4" />
                                                <span className="text-[11px] font-black uppercase tracking-widest">Save Prompt</span>
                                            </button>

                                            <button
                                                onClick={() => handleGenerateImage(panel.id)}
                                                disabled={activeTasks[panel.id]?.status === 'processing'}
                                                className="btn-primary flex-[1.5] py-4 bg-neon-cyan hover:bg-neon-cyan/80 text-black shadow-neon-cyan/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                <Sparkles className={`w-4 h-4 ${activeTasks[panel.id]?.status === 'processing' ? 'animate-spin' : ''}`} />
                                                <span className="text-[11px] font-black uppercase tracking-widest">
                                                    {panel.image_url ? 'Regenerate Artist' : 'Drawn by AI'}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Alert */}
            <div className="flex items-center gap-4 p-8 rounded-[40px] bg-neon-cyan/5 border border-neon-cyan/10 border-l-8 border-l-neon-cyan shadow-2xl animate-slide-up">
                <div className="w-12 h-12 rounded-full bg-neon-cyan flex items-center justify-center shrink-0 shadow-lg shadow-neon-cyan/30">
                    <Sparkles className="w-6 h-6 text-black" />
                </div>
                <div className="space-y-1">
                    <h4 className="font-black text-pure-white tracking-widest uppercase text-xs text-neon-cyan">Deep Design Thinking</h4>
                    <p className="text-sm text-muted-silver leading-relaxed">
                        **Gợi ý**: Nano Banana 2 (Gemini 3.1) hiểu rất tốt về ánh sáng (cinematic lighting) và chất liệu (texture). Hãy thử thêm &quot;8k, high details, unreal engine 5 render, global illumination&quot; vào prompt để có kết quả tốt nhất.
                    </p>
                </div>
            </div>
        </div>
    );
}
