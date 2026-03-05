'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import { createClient } from '@/lib/supabase/client';
import { Type, FileText, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return toast.error('Vui lòng nhập tên dự án');

        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase.from('projects').insert({
            name,
            description,
            user_id: user?.id,
            mode: 'novel_promotion', // Default mode for VimiAI
            status: 'draft'
        });

        if (error) {
            toast.error('Lỗi khi tạo dự án: ' + error.message);
        } else {
            toast.success('Dự án đã được tạo thành công! ✨');
            setName('');
            setDescription('');
            onSuccess();
            onClose();
        }
        setLoading(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="project-name" className="text-xs font-bold text-dim-gray uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Type className="w-3 h-3 text-neon-cyan" />
                            Project Name
                        </label>
                        <input
                            id="project-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="VD: Chuyến phiêu lưu của Hùng..."
                            className="input-dark w-full text-lg"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="project-desc" className="text-xs font-bold text-dim-gray uppercase tracking-widest ml-1 flex items-center gap-2">
                            <FileText className="w-3 h-3 text-vivid-teal" />
                            Description (Optional)
                        </label>
                        <textarea
                            id="project-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Mô tả ngắn gọn về câu chuyện..."
                            rows={4}
                            className="input-dark w-full resize-none custom-scrollbar-y"
                        />
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-muted-silver uppercase tracking-wider">Mode Chọn Sẵn</span>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/20">Novel Promotion</span>
                        </div>
                        <p className="text-[11px] text-dim-gray leading-relaxed italic">
                            Mode này được tối ưu để tạo video quảng bá tiểu thuyết (Novel to Video) với pipeline 7 bước chuyên sâu.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 btn-ghost"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-[2] btn-primary flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-midnight-abyss border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                <span>Bắt đầu Sáng tạo</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
