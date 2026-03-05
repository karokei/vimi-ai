'use client';

import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Sparkles, FileText, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import ClipCard from '@/components/workspace/ClipCard';

interface Clip {
    id: string;
    sequence_number: number;
    title: string;
    content: string;
    screenplay: string;
    status: string;
}

export default function ScriptPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: projectId } = React.use(params);
    const [clips, setClips] = React.useState<Clip[]>([]);
    const [novelText, setNovelText] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [analyzing, setAnalyzing] = React.useState(false);
    const supabase = createClient();

    const fetchClips = React.useCallback(async () => {
        setLoading(true);
        // Get episode first
        const { data: episode } = await supabase
            .from('episodes')
            .select('id, novel_text')
            .eq('project_id', projectId)
            .single();

        if (episode) {
            setNovelText(episode.novel_text || '');
            const { data: clipsData } = await supabase
                .from('clips')
                .select('id, sequence_number, title, content, screenplay, status')
                .eq('episode_id', episode.id)
                .order('sequence_number', { ascending: true });

            if (clipsData) setClips(clipsData);
        }
        setLoading(false);
    }, [projectId, supabase]);

    React.useEffect(() => {
        fetchClips();
    }, [fetchClips]);

    const handleAnalyze = async () => {
        if (!novelText) {
            return toast.error('Vui lòng quay lại Stage 1 để nhập nội dung tiểu thuyết');
        }

        setAnalyzing(true);
        try {
            const res = await fetch('/api/pipeline/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, novelText }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success(`Đã phân tích xong ${data.count} Clips! ✨`);
                fetchClips();
            } else {
                throw new Error(data.error || 'Lỗi không xác định');
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            toast.error('Lỗi khi phân tích: ' + message);
        } finally {
            setAnalyzing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full space-y-8 animate-fade-in">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-vivid-teal/10 border border-vivid-teal/20 flex items-center justify-center shadow-lg">
                        <FileText className="w-6 h-6 text-vivid-teal" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black font-heading gradient-text-primary">Stage 2: Script View</h2>
                        <p className="text-sm text-muted-silver">AI đã phân tích và chia truyện thành các phân đoạn kịch bản.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleAnalyze}
                        disabled={analyzing}
                        className="btn-ghost flex items-center gap-2 px-4 py-2 border border-vivid-teal/20 text-vivid-teal hover:bg-vivid-teal/10 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
                        <span>{clips.length > 0 ? 'Phân tích lại' : 'Bắt đầu phân tích'}</span>
                    </button>

                    {clips.length > 0 && !analyzing && (
                        <Link href={`/workspace/${projectId}/assets`} className="btn-primary flex items-center gap-2 group">
                            <span>Tiếp tục sang Assets</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Analysis Banner */}
            {clips.length === 0 && !analyzing && (
                <div className="card-clay p-12 flex flex-col items-center text-center space-y-6 bg-vivid-teal/5 border-vivid-teal/20">
                    <div className="w-20 h-20 rounded-full bg-vivid-teal/10 flex items-center justify-center animate-pulse-neon shadow-vivid-teal">
                        <Sparkles className="w-10 h-10 text-vivid-teal" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-pure-white">Sẵn sàng phân tích kịch bản</h3>
                        <p className="text-muted-silver max-w-md mx-auto leading-relaxed">
                            VimiAI sẽ sử dụng Gemini 2.0 để tách các cảnh quay, viết kịch bản hội thoại và đề xuất mô tả hình ảnh dựa trên nội dung tiểu thuyết của bạn.
                        </p>
                    </div>
                    <button
                        onClick={handleAnalyze}
                        className="btn-primary px-10 py-4 text-lg animate-bounce-slow"
                    >
                        Phân tích kịch bản ngay
                    </button>
                </div>
            )}

            {/* Analyzing State */}
            {analyzing && (
                <div className="card-clay p-12 flex flex-col items-center justify-center space-y-8 min-h-[400px]">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-3xl bg-vivid-teal/20 border border-vivid-teal/30 animate-spin-slow rotate-45" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="w-10 h-10 text-neon-cyan animate-pulse" />
                        </div>
                    </div>
                    <div className="text-center space-y-3">
                        <h3 className="text-2xl font-black text-pure-white animate-pulse">Vimi AI is thinking...</h3>
                        <div className="flex items-center gap-2 justify-center text-muted-silver">
                            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-2 h-2 rounded-full bg-vivid-teal animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-bounce" />
                            <span className="ml-2 text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5">Stage: Deep Analysis</span>
                        </div>
                        <p className="text-[11px] text-dim-gray mt-4 max-w-sm mx-auto leading-relaxed">
                            Quá trình này có thể mất từ 10-30 giây tùy thuộc vào độ dài nội dung. AI đang tách các Clips và viết kịch bản chi tiết cho bạn.
                        </p>
                    </div>
                </div>
            )}

            {/* Clips Grid */}
            {clips.length > 0 && !analyzing && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {clips.map((clip, index) => (
                        <ClipCard key={clip.id} clip={clip} index={index} />
                    ))}

                    {/* Add more clip placeholder */}
                    <button
                        onClick={() => toast.success('Tính năng thêm clip thủ công sẽ sớm ra mắt!')}
                        className="card-clay border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center p-12 space-y-3 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all text-dim-gray hover:text-neon-cyan group"
                    >
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                            <RefreshCw className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-xs uppercase tracking-widest">Thêm phân đoạn mới</span>
                    </button>
                </div>
            )}

            {/* Info Message */}
            {clips.length > 0 && !analyzing && (
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 border-l-4 border-l-vivid-teal">
                    <AlertCircle className="w-5 h-5 text-vivid-teal shrink-0" />
                    <p className="text-xs text-muted-silver leading-relaxed">
                        **Gợi ý:** Bạn có thể nhấn &quot;Phân tích lại&quot; nếu muốn AI thử một phong cách kể chuyện khác. Sau bước này, chúng ta sẽ gán nhân vật cho từng Clip ở Stage 3.
                    </p>
                </div>
            )}
        </div>
    );
}
