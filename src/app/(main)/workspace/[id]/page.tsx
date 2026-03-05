'use client';

import React from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Save, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NovelInputPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: projectId } = React.use(params);
    const [text, setText] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const supabase = createClient();

    React.useEffect(() => {
        async function loadEpisode() {
            // For now, we use a single default episode per project
            const { data } = await supabase
                .from('episodes')
                .select('novel_text')
                .eq('project_id', projectId)
                .order('created_at', { ascending: true })
                .limit(1)
                .single();

            if (data) setText(data.novel_text || '');
            setLoading(false);
        }
        loadEpisode();
    }, [projectId, supabase]);

    const handleSave = async () => {
        if (!text.trim()) return toast.error('Vui lòng nhập văn bản tiểu thuyết');

        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();

        // Check if episode exists
        const { data: existing } = await supabase
            .from('episodes')
            .select('id')
            .eq('project_id', projectId)
            .limit(1)
            .single();

        let error;
        if (existing) {
            const { error: err } = await supabase
                .from('episodes')
                .update({ novel_text: text, updated_at: new Date().toISOString() })
                .eq('id', existing.id);
            error = err;
        } else {
            const { error: err } = await supabase
                .from('episodes')
                .insert({
                    project_id: projectId,
                    user_id: user?.id,
                    novel_text: text,
                    title: 'Episode 1'
                });
            error = err;
        }

        if (error) {
            toast.error('Lỗi khi lưu: ' + error.message);
        } else {
            toast.success('Đã lưu nội dung tiểu thuyết! 📖');
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-neon-cyan" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold font-heading">Stage 1: Novel Input</h2>
                        <p className="text-xs text-dim-gray">Nhập nội dung truyện để AI bắt đầu phân tích cảnh quay.</p>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary flex items-center gap-2 px-6"
                >
                    {saving ? (
                        <div className="w-4 h-4 border-2 border-midnight-abyss border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            <span>Lưu nội dung</span>
                        </>
                    )}
                </button>
            </div>

            <div className="flex-1 glass-strong border border-white/5 rounded-3xl p-6 flex flex-col space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 border-l-4 border-l-neon-cyan">
                    <AlertCircle className="w-5 h-5 text-neon-cyan shrink-0" />
                    <p className="text-xs text-muted-silver leading-relaxed">
                        **Mẹo:** Phân đoạn kịch bản tốt nhất khi nội dung nằm trong khoảng từ 500 - 2000 từ. AI sẽ tự động tách các Clip, Shot và đề xuất âm thanh.
                    </p>
                </div>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Dán nội dung chương truyện hoặc tiểu thuyết của bạn vào đây..."
                    className="flex-1 bg-transparent text-pure-white border-none focus:ring-0 p-0 text-base leading-relaxed resize-none font-sans custom-scrollbar-y"
                />
            </div>

            <div className="flex justify-end">
                <Link
                    href={`/workspace/${projectId}/script`}
                    className="flex items-center gap-2 text-neon-cyan font-bold text-sm bg-neon-cyan/10 hover:bg-neon-cyan/20 px-6 py-3 rounded-2xl border border-neon-cyan/20 transition-all scale-100 hover:scale-105 active:scale-95 group"
                >
                    <span>Tiếp tục sang Scripting</span>
                    <Sparkles className="w-4 h-4 animate-pulse group-hover:rotate-12 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
