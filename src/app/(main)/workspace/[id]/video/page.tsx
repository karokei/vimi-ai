'use client';

import React from 'react';
import { Player } from '@remotion/player';
import { VideoComposition, ClipData } from '@/remotion/Composition';
import { TimelineTrack, TrackItem } from '@/components/workspace/TimelineTrack';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Download, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import ExportModal from '@/components/workspace/ExportModal';

export default function VideoStagePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: projectId } = React.use(params);
    const [clips, setClips] = React.useState<ClipData[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [showExportModal, setShowExportModal] = React.useState(false);

    const supabase = createClient();

    const fetchVideoData = React.useCallback(async () => {
        setLoading(true);
        const { data: episode } = await supabase
            .from('episodes')
            .select('id')
            .eq('project_id', projectId)
            .single();

        if (episode) {
            const { data: clipsData } = await supabase
                .from('clips')
                .select('id, sequence_number, screenplay, dialogue')
                .eq('episode_id', episode.id)
                .order('sequence_number', { ascending: true });

            if (clipsData) {
                const clipIds = clipsData.map(c => c.id);
                const { data: panelsData } = await supabase
                    .from('panels')
                    .select('id, clip_id, image_url')
                    .in('clip_id', clipIds)
                    .order('sequence_number', { ascending: true });

                const formattedClips: ClipData[] = clipsData.map(clip => {
                    const clipPanels = panelsData?.filter(p => p.clip_id === clip.id) || [];
                    // Get the first panel's image for visual if available
                    const visualUrl = clipPanels.length > 0 ? clipPanels[0].image_url : null;

                    return {
                        id: clip.id,
                        dialogue: clip.dialogue || clip.screenplay || '',
                        visual_url: visualUrl,
                        audio_url: null, // To be integrated when Voice stage is done
                        durationInFrames: 150, // Default 5 seconds per clip at 30fps
                    };
                });

                setClips(formattedClips);
            }
        }
        setLoading(false);
    }, [projectId, supabase]);

    React.useEffect(() => {
        fetchVideoData();
    }, [fetchVideoData]);

    const handleExport = () => {
        if (clips.length === 0) {
            toast.error('Không có clip nào để render!');
            return;
        }
        setShowExportModal(true);
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-muted-silver space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-vivid-teal" />
                <p>Đang nạp dữ liệu Timeline...</p>
            </div>
        );
    }

    const totalFrames = clips.reduce((acc, c) => acc + c.durationInFrames, 0) || 300;

    // Build Timeline Track Items
    const visualTrackItems: TrackItem[] = [];
    const textTrackItems: TrackItem[] = [];

    let currentFrame = 0;
    clips.forEach((clip, index) => {
        const startPercent = (currentFrame / totalFrames) * 100;
        const widthPercent = (clip.durationInFrames / totalFrames) * 100;

        visualTrackItems.push({
            id: `v-${clip.id}`,
            label: clip.visual_url ? `Ảnh Scene ${index + 1}` : `Trống`,
            startPercent,
            widthPercent,
            color: clip.visual_url ? 'bg-emerald-500/80' : 'bg-red-500/50',
        });

        textTrackItems.push({
            id: `t-${clip.id}`,
            label: `Script ${index + 1}`,
            startPercent,
            widthPercent,
            color: 'bg-vivid-teal/80',
        });

        currentFrame += clip.durationInFrames;
    });

    return (
        <div className="flex flex-col h-full animate-fade-in gap-6">
            {/* Split View: Top Video Player & Settings */}
            <div className="flex flex-col lg:flex-row gap-6 h-[50vh] min-h-[400px]">
                {/* Remotion Player */}
                <div className="flex-1 bg-midnight-abyss rounded-2xl border border-white/5 overflow-hidden shadow-2xl flex items-center justify-center relative">
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        <Video className="w-4 h-4 text-vivid-teal" />
                        <span className="text-xs font-bold text-white uppercase tracking-widest">Remotion Player</span>
                    </div>
                    {clips.length > 0 ? (
                        <div className="h-[90%] aspect-[9/16] bg-black shadow-2xl shadow-vivid-teal/10 rounded-lg overflow-hidden border border-white/10">
                            <Player
                                component={VideoComposition}
                                inputProps={{ clips }}
                                durationInFrames={totalFrames}
                                fps={30}
                                compositionWidth={1080}
                                compositionHeight={1920}
                                style={{ width: '100%', height: '100%' }}
                                controls
                                autoPlay
                                loop
                            />
                        </div>
                    ) : (
                        <div className="text-muted-silver opacity-50 text-sm">Chưa có Clip nào được tạo.</div>
                    )}
                </div>

                {/* Render Controls */}
                <div className="w-full lg:w-80 bg-neutral-900 rounded-2xl border border-white/5 p-6 flex flex-col justify-between shadow-2xl shadow-black/50">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">Export Settings</h3>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-muted-silver uppercase tracking-wider block" htmlFor="resolution">Phân giải (Resolution)</label>
                                <select id="resolution" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-vivid-teal focus:ring-1 focus:ring-vivid-teal outline-none transition-all">
                                    <option value="1080p">1080x1920 (TikTok/Reels)</option>
                                    <option value="4k">2160x3840 (4K Vertical)</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-muted-silver uppercase tracking-wider block" htmlFor="fps">Frame Rate (FPS)</label>
                                <select id="fps" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-vivid-teal focus:ring-1 focus:ring-vivid-teal outline-none transition-all">
                                    <option value="30">30 FPS (Standard)</option>
                                    <option value="60">60 FPS (Smooth)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleExport}
                        className="w-full bg-vivid-teal hover:bg-neon-cyan text-black font-bold py-4 px-6 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 mt-6 shadow-lg shadow-vivid-teal/20"
                    >
                        <Download className="w-5 h-5" />
                        Export Video
                    </button>
                </div>
            </div>

            {/* Bottom: Timeline Wrapper */}
            <div className="flex-1 bg-neutral-900 rounded-2xl border border-white/5 p-4 flex flex-col gap-3 shadow-2xl overflow-y-auto">
                <div className="flex items-center justify-between px-2 mb-2">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Timeline Editor</h3>
                    <span className="text-xs text-muted-silver font-mono bg-black/50 px-2 py-1 rounded">{(totalFrames / 30).toFixed(1)}s (Total)</span>
                </div>

                {/* Tracks */}
                <TimelineTrack title="Visuals (AI)" items={visualTrackItems} />
                <TimelineTrack title="Subtitles" items={textTrackItems} />
                <TimelineTrack title="Audio (TTS)" items={[]} />
            </div>

            {/* Modal Export */}
            {showExportModal && (
                <ExportModal
                    clips={clips}
                    onClose={() => setShowExportModal(false)}
                />
            )}
        </div>
    );
}
