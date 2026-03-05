'use client';

import React from 'react';
import { createClient } from '@/lib/supabase/client';
import {
    User,
    MapPin,
    Mic,
    Plus,
    Search,
    Video,
    Trash2,
    UserCircle
} from 'lucide-react';
import CreateAssetModal from '@/components/assets/CreateAssetModal';
import toast from 'react-hot-toast';

type TabType = 'characters' | 'locations' | 'voices';

export default function AssetsPage() {
    const [activeTab, setActiveTab] = React.useState<TabType>('characters');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [assets, setAssets] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const supabase = createClient();

    const fetchAssets = React.useCallback(async () => {
        setLoading(true);
        let table = '';
        if (activeTab === 'characters') table = 'global_characters';
        else if (activeTab === 'locations') table = 'global_locations';
        else table = 'global_voices';

        const { data } = await supabase.from(table).select('*').order('created_at', { ascending: false });
        if (data) setAssets(data);
        setLoading(false);
    }, [activeTab, supabase]);

    React.useEffect(() => {
        fetchAssets();
    }, [fetchAssets]);

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa asset này?')) return;

        let table = '';
        if (activeTab === 'characters') table = 'global_characters';
        else if (activeTab === 'locations') table = 'global_locations';
        else table = 'global_voices';

        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) {
            toast.error('Lỗi khi xóa: ' + error.message);
        } else {
            toast.success('Đã xóa thành công');
            fetchAssets();
        }
    };

    const tabs = [
        { id: 'characters', name: 'Nhân vật', icon: User },
        { id: 'locations', name: 'Bối cảnh', icon: MapPin },
        { id: 'voices', name: 'Giọng nói', icon: Mic },
    ];

    return (
        <div className="space-y-10 animate-fade-in">
            <CreateAssetModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchAssets}
                type={activeTab.slice(0, -1) as any}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black font-heading gradient-text-primary mb-2">Asset Hub</h2>
                    <p className="text-muted-silver">Kho lưu trữ tài nguyên AI cho các dự án video.</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    <span>Thêm {activeTab.slice(0, -1)}</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex p-1 gap-1 glass-strong rounded-2xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`
              flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-200 font-bold text-sm
              ${activeTab === tab.id
                                ? 'bg-neon-cyan text-midnight-abyss shadow-neon-cyan'
                                : 'text-muted-silver hover:bg-white/5'
                            }
            `}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Grid Content */}
            {loading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                    <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
                </div>
            ) : assets.length === 0 ? (
                <div className="card-clay p-20 flex flex-col items-center text-center space-y-4 bg-white/[0.02]">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                        <Search className="w-8 h-8 text-dim-gray opacity-30" />
                    </div>
                    <p className="text-muted-silver">Chưa có {activeTab} nào trong kho của bạn.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {assets.map((asset) => (
                        <div key={asset.id} className="card-clay group relative overflow-hidden flex flex-col">
                            {/* Image Preview / Placeholder */}
                            <div className="aspect-square bg-midnight-abyss flex items-center justify-center p-6 border-b border-white/5 relative overflow-hidden">
                                {asset.avatar_url || asset.image_url ? (
                                    <img src={asset.avatar_url || asset.image_url} alt={asset.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center">
                                        {activeTab === 'characters' ? (
                                            <UserCircle className="w-16 h-16 text-dim-gray/20" />
                                        ) : (
                                            <MapPin className="w-16 h-16 text-dim-gray/20" />
                                        )}
                                    </div>
                                )}

                                {/* Delete overlay */}
                                <button
                                    onClick={() => handleDelete(asset.id)}
                                    className="absolute top-2 right-2 p-2 rounded-lg bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-white"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-4 space-y-1">
                                <h3 className="font-bold text-pure-white truncate">{asset.name}</h3>
                                <p className="text-[11px] text-dim-gray line-clamp-2 min-h-[32px]">
                                    {asset.description || 'Không có mô tả...'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
