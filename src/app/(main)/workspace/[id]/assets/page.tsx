'use client';

import React from 'react';
import { createClient } from '@/lib/supabase/client';
import { Users, MapPin, Plus, Sparkles, AlertCircle, Trash2, ChevronRight, UserCircle } from 'lucide-react';
import AssetPicker from '@/components/workspace/AssetPicker';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectAsset {
    id: string;
    asset_id: string;
    name: string;
    description: string | null;
    avatar_url?: string;
    image_url?: string;
}

export default function AssetsStagePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: projectId } = React.use(params);
    const [characters, setCharacters] = React.useState<ProjectAsset[]>([]);
    const [locations, setLocations] = React.useState<ProjectAsset[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isPickerOpen, setIsPickerOpen] = React.useState(false);
    const [pickerType, setPickerType] = React.useState<'character' | 'location'>('character');

    const supabase = createClient();

    const fetchProjectAssets = React.useCallback(async () => {
        setLoading(true);
        // Fetch characters
        const { data: pChars } = await supabase
            .from('project_characters')
            .select(`
                id,
                character_id,
                global_characters (
                    id, name, description, avatar_url
                )
            `)
            .eq('project_id', projectId);

        if (pChars) {
            const typedChars = pChars as unknown as Array<{
                id: string;
                character_id: string;
                global_characters: { id: string; name: string; description: string; avatar_url: string };
            }>;
            setCharacters(typedChars.map((item) => ({
                ...item.global_characters,
                id: item.id,
                asset_id: item.character_id
            })));
        }

        // Fetch locations
        const { data: pLocs } = await supabase
            .from('project_locations')
            .select(`
                id,
                location_id,
                global_locations (
                    id, name, description, image_url
                )
            `)
            .eq('project_id', projectId);

        if (pLocs) {
            const typedLocs = pLocs as unknown as Array<{
                id: string;
                location_id: string;
                global_locations: { id: string; name: string; description: string; image_url: string };
            }>;
            setLocations(typedLocs.map((item) => ({
                ...item.global_locations,
                id: item.id,
                asset_id: item.location_id
            })));
        }

        setLoading(false);
    }, [projectId, supabase]);

    React.useEffect(() => {
        fetchProjectAssets();
    }, [fetchProjectAssets]);

    const handleRemoveAsset = async (id: string, type: 'character' | 'location') => {
        const table = type === 'character' ? 'project_characters' : 'project_locations';
        const { error } = await supabase.from(table).delete().eq('id', id);

        if (error) {
            toast.error('Lỗi khi xóa: ' + error.message);
        } else {
            toast.success('Đã gỡ khỏi dự án');
            fetchProjectAssets();
        }
    };

    const openPicker = (type: 'character' | 'location') => {
        setPickerType(type);
        setIsPickerOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full space-y-10 animate-fade-in pb-20">
            <AssetPicker
                isOpen={isPickerOpen}
                onClose={() => setIsPickerOpen(false)}
                projectId={projectId}
                type={pickerType}
                existingIds={(pickerType === 'character' ? characters : locations).map(a => a.asset_id)}
                onSuccess={fetchProjectAssets}
            />

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center shadow-lg shadow-neon-cyan/5">
                        <Users className="w-6 h-6 text-neon-cyan" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black font-heading gradient-text-primary">Stage 3: Project Assets</h2>
                        <p className="text-sm text-muted-silver">Xác định các Nhân vật và Bối cảnh sẽ xuất hiện trong tập phim này.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="btn-ghost flex items-center gap-2 px-6 py-2 border border-white/5 text-dim-gray hover:text-pure-white hover:bg-white/5">
                        <Sparkles className="w-4 h-4" />
                        <span>AI Tự động gán</span>
                    </button>

                    <Link href={`/workspace/${projectId}/storyboard`} className="btn-primary flex items-center gap-2 group">
                        <span>Tiếp tục Storyboard</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Hint Box */}
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 border-l-4 border-l-neon-cyan shadow-xl">
                <AlertCircle className="w-5 h-5 text-neon-cyan shrink-0" />
                <p className="text-sm text-muted-silver leading-relaxed">
                    **Mẹo:** Gán đủ các nhân vật chính được AI nhắc đến trong kịch bản ở Stage 2. Điều này giúp AI tạo hình ảnh chính xác hơn ở các bước Storyboard.
                </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* Characters Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-lg font-black font-heading flex items-center gap-2 text-pure-white">
                            <Users className="w-5 h-5 text-neon-cyan" />
                            Nhân vật của dự án
                        </h3>
                        <button
                            onClick={() => openPicker('character')}
                            className="text-xs font-black uppercase tracking-widest text-neon-cyan hover:underline flex items-center gap-1"
                        >
                            <Plus className="w-3 h-3" /> Thêm nhân vật
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {characters.length === 0 ? (
                            <div className="col-span-full card-clay border-dashed border-white/5 h-32 flex flex-col items-center justify-center text-dim-gray text-xs font-bold gap-2">
                                <UserCircle className="w-8 h-8 opacity-20" />
                                Chưa gán nhân vật nào
                            </div>
                        ) : (
                            characters.map((char) => (
                                <div key={char.id} className="card-clay group p-4 flex items-center gap-4 hover:border-neon-cyan/30 transition-all">
                                    <div className="w-14 h-14 rounded-xl bg-midnight-abyss border border-white/5 relative overflow-hidden flex items-center justify-center shrink-0">
                                        {char.avatar_url ? (
                                            <Image src={char.avatar_url} alt={char.name} fill className="object-cover" />
                                        ) : (
                                            <UserCircle className="w-8 h-8 text-dim-gray/30" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-pure-white text-sm truncate">{char.name}</h4>
                                        <p className="text-[10px] text-dim-gray line-clamp-1 italic">{char.description || 'No description'}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveAsset(char.id, 'character')}
                                        className="p-2 text-dim-gray hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Locations Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-lg font-black font-heading flex items-center gap-2 text-pure-white">
                            <MapPin className="w-5 h-5 text-vivid-teal" />
                            Bối cảnh của dự án
                        </h3>
                        <button
                            onClick={() => openPicker('location')}
                            className="text-xs font-black uppercase tracking-widest text-vivid-teal hover:underline flex items-center gap-1"
                        >
                            <Plus className="w-3 h-3" /> Thêm bối cảnh
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {locations.length === 0 ? (
                            <div className="col-span-full card-clay border-dashed border-white/5 h-32 flex flex-col items-center justify-center text-dim-gray text-xs font-bold gap-2">
                                <MapPin className="w-8 h-8 opacity-20" />
                                Chưa gán bối cảnh nào
                            </div>
                        ) : (
                            locations.map((loc) => (
                                <div key={loc.id} className="card-clay group p-4 flex items-center gap-4 hover:border-vivid-teal/30 transition-all">
                                    <div className="w-14 h-14 rounded-xl bg-midnight-abyss border border-white/5 relative overflow-hidden flex items-center justify-center shrink-0">
                                        {loc.image_url ? (
                                            <Image src={loc.image_url} alt={loc.name} fill className="object-cover" />
                                        ) : (
                                            <MapPin className="w-8 h-8 text-dim-gray/30" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-pure-white text-sm truncate">{loc.name}</h4>
                                        <p className="text-[10px] text-dim-gray line-clamp-1 italic">{loc.description || 'No description'}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveAsset(loc.id, 'location')}
                                        className="p-2 text-dim-gray hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
