import React from 'react';

export type TrackItem = {
    id: string;
    label: string;
    startPercent: number;
    widthPercent: number;
    color: string;
};

export function TimelineTrack({ title, items }: { title: string; items: TrackItem[] }) {
    return (
        <div className="flex bg-midnight-abyss rounded-xl p-3 h-20 items-center border border-white/5 relative shadow-inner">
            <div className="w-24 flex-shrink-0 text-[10px] text-muted-silver font-bold uppercase tracking-widest leading-tight">
                {title}
            </div>
            <div className="flex-1 relative h-full bg-black/40 rounded-lg overflow-hidden border border-white/5">
                {items.map(item => (
                    <div
                        key={item.id}
                        className={`absolute h-full flex items-center justify-center px-2 text-[10px] text-white font-bold truncate rounded-md transition-all hover:brightness-110 cursor-pointer shadow-md ${item.color}`}
                        style={{ left: `${item.startPercent}%`, width: `${item.widthPercent}%` }}
                        title={item.label}
                    >
                        <span className="truncate w-full text-center">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
