import { AbsoluteFill, Audio, Img, Sequence } from 'remotion';
import React from 'react';

export type ClipData = {
    id: string;
    dialogue: string;
    visual_url?: string | null;
    audio_url?: string | null;
    durationInFrames: number;
};

export type VideoCompositionProps = {
    clips: ClipData[];
};

export const VideoComposition: React.FC<VideoCompositionProps> = ({ clips }) => {
    // If no clips are provided, render a placeholder
    if (!clips || clips.length === 0) {
        return (
            <AbsoluteFill className="bg-midnight-abyss text-pure-white flex items-center justify-center">
                <div className="text-3xl font-black font-heading animate-pulse text-vivid-teal">
                    Chưa có dữ liệu Video.
                </div>
            </AbsoluteFill>
        );
    }

    return (
        <AbsoluteFill className="bg-black">
            {clips.map((clip, index) => {
                // Calculate start frame based on previous clips duration
                const startFrame = clips.slice(0, index).reduce((acc, c) => acc + c.durationInFrames, 0);

                return (
                    <Sequence key={clip.id} from={startFrame} durationInFrames={clip.durationInFrames}>
                        <AbsoluteFill>
                            {/* Visual Layer */}
                            {clip.visual_url ? (
                                <Img src={clip.visual_url} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-900 border-2 border-dashed border-vivid-teal/50">
                                    <div className="text-vivid-teal/50 font-bold uppercase tracking-widest text-2xl flex flex-col items-center gap-4">
                                        <span>No Visual Rendered</span>
                                        <span className="text-sm">Clip ID: {clip.id.substring(0, 8)}</span>
                                    </div>
                                </div>
                            )}

                            {/* Audio Layer */}
                            {clip.audio_url && <Audio src={clip.audio_url} />}

                            {/* Subtitle Layer */}
                            {clip.dialogue && (
                                <div className="absolute bottom-20 w-full px-16 flex items-end justify-center">
                                    <p
                                        className="text-white text-center font-bold font-sans text-4xl leading-tight"
                                        style={{
                                            textShadow: '0 4px 12px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,1)',
                                            WebkitTextStroke: '1px rgba(0,0,0,0.5)',
                                        }}
                                    >
                                        {clip.dialogue}
                                    </p>
                                </div>
                            )}
                        </AbsoluteFill>
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};
