'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import { createClient } from '@/lib/supabase/client';
import { User, MapPin, Mic, Save, Sparkles, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

interface CreateAssetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    type: 'character' | 'location' | 'voice';
}

export default function CreateAssetModal({ isOpen, onClose, onSuccess, type }: CreateAssetModalProps) {
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return toast.error('Vui lòng nhập tên');

        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        let table = '';
        let payload: any = { name, description, user_id: user?.id };

        if (type === 'character') table = 'global_characters';
        else if (type === 'location') table = 'global_locations';
        else if (type === 'voice') {
            table = 'global_voices';
            payload = { ...payload, voice_id: 'default', provider: 'google' };
        }

        const { error } = await supabase.from(table).insert(payload);

        if (error) {
            toast.error('Lỗi khi tạo: ' + error.message);
        } else {
            toast.success(`Đã thêm ${type === 'character' ? 'nhân vật' : type === 'location' ? 'bối cảnh' : 'giọng nói'} thành công!`);
            setName('');
            setDescription('');
            onSuccess();
            onClose();
        }
        setLoading(false);
    };

    const getTitle = () => {
        if (type === 'character') return 'Thêm Nhân vật mới';
        if (type === 'location') return 'Thêm Bối cảnh mới';
        return 'Thêm Giọng nói mới';
    };

    const Icon = type === 'character' ? User : type === 'location' ? MapPin : Mic;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-dim-gray uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Icon className="w-3 h-3 text-neon-cyan" />
                            Tên {type === 'character' ? 'nhân vật' : type === 'location' ? 'bối cảnh' : 'giọng nói'}
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nhập tên..."
                            className="input-dark w-full"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-dim-gray uppercase tracking-widest ml-1 flex items-center gap-2">
                            Mô tả chi tiết
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="VD: Tuổi tác, tính cách, ngoại hình..."
                            rows={4}
                            className="input-dark w-full resize-none custom-scrollbar-y"
                        />
                    </div>

                    {/* Placeholder for Image Upload in the future */}
                    <div className="p-8 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-3 bg-white/[0.02] group hover:border-neon-cyan/20 hover:bg-neon-cyan/[0.02] transition-all cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-dim-gray group-hover:text-neon-cyan transition-colors">
                            <Upload className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-muted-silver">Tải lên hình ảnh</p>
                            <p className="text-[10px] text-dim-gray">Dùng cho AI training & Ref (Coming soon)</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button type="button" onClick={onClose} className="flex-1 btn-ghost">Hủy</button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-[2] btn-primary flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-midnight-abyss border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span>Lưu thông tin</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
