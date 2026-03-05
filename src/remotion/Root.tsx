import { Composition } from 'remotion';
import { VideoComposition, VideoCompositionProps } from './Composition';
import React from 'react';

// This is the main entry point for Remotion CLI and Player
export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="VimiVlog"
                component={VideoComposition}
                durationInFrames={300} // Default fallback duration
                fps={30}
                width={1080}
                height={1920} // 9:16 vertical ratio (TikTok / Reels)
                defaultProps={
                    {
                        clips: [],
                    } as VideoCompositionProps
                }
            />
        </>
    );
};
