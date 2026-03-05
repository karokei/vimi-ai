'use client';

import React from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, Plus, User, MapPin, Check } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface Asset {
    id: string;
    name: string;
    description: string | null;
    avatar_url?: string;
    image_url?: string;
}

interface AssetPickerProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    type: 'character' | 'location';
    existingIds: string[];
    onSuccess: () => void;
}

export default function AssetPicker({ isOpen, onClose, projectId, type, existingIds, onSuccess }: AssetPickerProps) {
    const [assets, setAssets] = React.useState<Asset[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [search, setSearch] = React.useState('');
    const [adding, setAdding] = React.useState<string | null>(null);
    const supabase = createClient();

    const fetchAssets = React.useCallback(async () => {
        setLoading(true);
        const table = type === 'character' ? 'global_characters' : 'global_locations';
        const { data } = await supabase
            .from(table)
            .select('id, name, description, avatar_url, image_url')
            .ilike('name', `%${search}%`)
            .order('name');

        if (data) setAssets(data as Asset[]);
        setLoading(false);
    }, [type, search, supabase]);

    React.useEffect(() => {
        if (isOpen) fetchAssets();
    }, [isOpen, fetchAssets]);

    const handleAdd = async (assetId: string) => {
        setAdding(assetId);
        const table = type === 'character' ? 'project_characters' : 'project_locations';
        const column = type === 'character' ? 'character_id' : 'location_id';

        const { error } = await supabase
            .from(table)
            .insert({
                project_id: projectId,
                [column]: assetId
            });

        if (error) {
            toast.error('Lỗi khi thêm: ' + error.message);
        } else {
            toast.success('Đã thêm vào dự án!');
            onSuccess();
        }
        setAdding(null);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Chọn ${type === 'character' ? 'Nhân vật' : 'Bối cảnh'} từ Hub`}
        >
            <div className="space-y-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dim-gray" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm kiếm tài nguyên..."
                        className="input-dark w-full pl-11"
                    />
                </div>

                <div className="max-h-[400px] overflow-y-auto custom-scrollbar-y pr-2 space-y-3">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <div className="w-6 h-6 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : assets.length === 0 ? (
                        <div className="text-center p-8 text-dim-gray text-sm italic">
                            Không tìm thấy tài nguyên nào...
                        </div>
                    ) : (
                        assets.map((asset) => {
                            const isAdded = existingIds.includes(asset.id);
                            const Icon = type === 'character' ? User : MapPin;

                            return (
                                <div
                                    key={asset.id}
                                    className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-midnight-abyss border border-white/10 relative overflow-hidden flex items-center justify-center shrink-0">
                                        {asset.avatar_url || asset.image_url ? (
                                            <Image
                                                src={(asset.avatar_url || asset.image_url) as string}
                                                alt={asset.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <Icon className="w-6 h-6 text-dim-gray/30" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-pure-white text-sm truncate">{asset.name}</h4>
                                        <p className="text-[10px] text-dim-gray line-clamp-1">{asset.description}</p>
                                    </div>

                                    {isAdded ? (
                                        <div className="px-3 py-1 rounded-full bg-neon-cyan/20 text-neon-cyan text-[10px] font-black uppercase flex items-center gap-1">
                                            <Check className="w-3 h-3" />
                                            Đã thêm
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleAdd(asset.id)}
                                            disabled={adding === asset.id}
                                            className="p-2 rounded-xl bg-neon-cyan text-midnight-abyss hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
                                        >
                                            {adding === asset.id ? (
                                                <div className="w-4 h-4 border-2 border-midnight-abyss border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Plus className="w-4 h-4" />
                                            )}
                                        </button>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="flex justify-end pt-2">
                    <button onClick={onClose} className="btn-ghost px-6 text-xs uppercase tracking-widest font-bold">Đóng</button>
                </div>
            </div>
        </Modal>
    );
}
