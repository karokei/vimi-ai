'use client';

import React from 'react';
import { createClient } from '@/lib/supabase/client';
import { ImageIcon, RefreshCw, ChevronRight, AlertCircle, LayoutGrid, List, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import PanelCard from '@/components/workspace/PanelCard';
import Link from 'next/link';
import TaskProgress from '@/components/ui/TaskProgress';

interface Panel {
    id: string;
    clip_id: string;
    sequence_number: number;
    image_prompt: string;
    image_url: string | null;
    photography_rules: string;
    acting_notes: string;
    status: string;
}

interface AICrossTask {
    id: string;
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

export default function StoryboardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: projectId } = React.use(params);
    const [clips, setClips] = React.useState<Clip[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [activeTask, setActiveTask] = React.useState<AICrossTask | null>(null);
    const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

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
                    .select('id, clip_id, sequence_number, image_prompt, image_url, photography_rules, acting_notes, status')
                    .in('clip_id', clipIds)
                    .order('sequence_number', { ascending: true });

                const clipsWithPanels = clipsData.map(clip => ({
                    ...clip,
                    panels: panelsData?.filter(p => p.clip_id === clip.id) || []
                }));

                setClips(clipsWithPanels);
            }
        }
        setLoading(false);
    }, [projectId, supabase]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    React.useEffect(() => {
        let interval: NodeJS.Timeout;

        if (activeTask && (activeTask.status === 'pending' || activeTask.status === 'processing')) {
            interval = setInterval(async () => {
                try {
                    const res = await fetch(`/api/ai/task/${activeTask.id}`);
                    const data = await res.json();

                    if (data.status === 'completed' || data.status === 'failed') {
                        setActiveTask(data);
                        if (data.status === 'completed') {
                            fetchData();
                            toast.success('Storyboard đã hoàn tất!');
                        }
                    } else {
                        setActiveTask(data);
                    }
                } catch (err) {
                    console.error('Polling error:', err);
                }
            }, 2000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [activeTask, fetchData]);

    const handleGenerate = async () => {
        try {
            const res = await fetch('/api/pipeline/storyboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId }),
            });

            const data = await res.json();
            if (data.success && data.taskId) {
                setActiveTask({
                    id: data.taskId,
                    status: 'pending',
                    progress: 0,
                    message: 'Khởi tạo tác vụ...'
                });
            } else {
                throw new Error(data.error || 'Lỗi không xác định');
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            toast.error('Lỗi khi tạo Storyboard: ' + message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-electric-pink border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const totalPanels = clips.reduce((acc, clip) => acc + (clip.panels?.length || 0), 0);
    const isGenerating = !!(activeTask && (activeTask.status === 'pending' || activeTask.status === 'processing'));

    return (
        <div className="flex flex-col h-full space-y-10 animate-fade-in pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-electric-pink/10 border border-electric-pink/20 flex items-center justify-center shadow-lg shadow-electric-pink/5">
                        <ImageIcon className="w-6 h-6 text-electric-pink" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black font-heading gradient-text-primary">Stage 4: Storyboard</h2>
                        <p className="text-sm text-muted-silver">AI đề xuất góc máy và kịch bản hình ảnh cho từng phân đoạn.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex p-1 bg-white/5 rounded-xl border border-white/5 mr-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-electric-pink text-white shadow-electric-pink' : 'text-dim-gray hover:text-white'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-electric-pink text-white shadow-electric-pink' : 'text-dim-gray hover:text-white'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="btn-ghost flex items-center gap-2 px-4 py-2 border border-electric-pink/20 text-electric-pink hover:bg-electric-pink/10 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                        <span>{totalPanels > 0 ? 'Tạo lại toàn bộ' : 'Bắt đầu tạo'}</span>
                    </button>

                    {totalPanels > 0 && !isGenerating && (
                        <Link href={`/workspace/${projectId}/prompts`} className="btn-primary flex items-center gap-2 group">
                            <span>Tiếp tục Prompts</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>
            </div>

            {/* AI Task Progress */}
            {activeTask && (
                <div className="max-w-2xl mx-auto w-full">
                    <TaskProgress
                        status={activeTask.status}
                        progress={activeTask.progress}
                        message={activeTask.message}
                        error={activeTask.error}
                        onComplete={() => {
                            if (activeTask.status === 'completed') {
                                setTimeout(() => setActiveTask(null), 2000);
                            }
                        }}
                    />
                </div>
            )}

            {/* Empty State */}
            {totalPanels === 0 && !isGenerating && (
                <div className="card-clay p-20 flex flex-col items-center text-center space-y-8 bg-electric-pink/5 border-electric-pink/20">
                    <div className="w-24 h-24 rounded-full bg-electric-pink/10 flex items-center justify-center animate-pulse shadow-2xl shadow-electric-pink/10">
                        <ImageIcon className="w-12 h-12 text-electric-pink" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-pure-white">Chưa có Storyboard</h3>
                        <p className="text-muted-silver max-w-sm">Nhấn nút &quot;Bắt đầu tạo&quot; để AI tự động lên kịch bản hình ảnh cho tập phim của bạn.</p>
                    </div>
                    <button
                        onClick={handleGenerate}
                        className="btn-primary px-12 py-5 text-lg font-black tracking-widest uppercase hover:scale-105 transition-all shadow-vivid-teal"
                    >
                        Tạo Storyboard bằng AI
                    </button>
                </div>
            )}

            {/* Clips & Panels List */}
            {totalPanels > 0 && !isGenerating && (
                <div className="space-y-16">
                    {clips.map((clip) => (
                        <div key={clip.id} className="space-y-8 animate-slide-up">
                            {/* Clip Header */}
                            <div className="flex items-center gap-4 px-2">
                                <div className="w-10 h-10 rounded-xl bg-midnight-abyss border border-white/10 flex items-center justify-center font-black text-neon-cyan shadow-lg">
                                    {clip.sequence_number}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-pure-white flex items-center gap-2">
                                        {clip.title}
                                        <span className="text-[10px] text-dim-gray bg-white/5 px-2 py-0.5 rounded uppercase tracking-widest">Clip Scene</span>
                                    </h3>
                                    <p className="text-[11px] text-muted-silver italic line-clamp-1">{clip.screenplay}</p>
                                </div>
                            </div>

                            {/* Panels Grid */}
                            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                                {clip.panels?.map((panel, idx) => (
                                    <PanelCard key={panel.id} panel={panel} index={idx} />
                                ))}

                                {/* Add Panel Button */}
                                <button className="card-clay border-dashed border-white/5 h-full min-h-[250px] flex flex-col items-center justify-center gap-4 text-dim-gray hover:text-electric-pink hover:border-electric-pink/30 hover:bg-electric-pink/5 transition-all group">
                                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Plus className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Add Panel</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer Hint */}
            {totalPanels > 0 && !isGenerating && (
                <div className="flex items-center gap-4 p-5 rounded-3xl bg-white/5 border border-white/5 border-l-4 border-l-electric-pink shadow-2xl">
                    <AlertCircle className="w-6 h-6 text-electric-pink shrink-0" />
                    <p className="text-xs text-muted-silver leading-relaxed">
                        **Sẵn sàng?** Sau khi kiểm tra kịch bản hình ảnh, nhấn &quot;Tiếp tục Prompts&quot; để AI bắt đầu tối ưu hóa câu lệnh cho từng khung hình. Ở giai đoạn này, bạn vẫn có thể chỉnh sửa mô tả Panel nếu cần.
                    </p>
                </div>
            )}
        </div>
    );
}
