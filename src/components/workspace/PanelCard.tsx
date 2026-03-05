'use client';

import React from 'react';
import { Camera, Image as ImageIcon, Sparkles, User, Info } from 'lucide-react';
import Image from 'next/image';

interface Panel {
    id: string;
    sequence_number: number;
    image_prompt: string;
    image_url: string | null;
    photography_rules: string;
    acting_notes: string;
    status: string;
}

interface PanelCardProps {
    panel: Panel;
    index: number;
}

export default function PanelCard({ panel, index }: PanelCardProps) {
    return (
        <div
            className="card-clay overflow-hidden group hover:border-vivid-teal/30 transition-all animate-fade-in flex flex-col h-full bg-white/[0.01]"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Visual Preview */}
            <div className="aspect-video bg-midnight-abyss relative overflow-hidden flex items-center justify-center border-b border-white/5">
                {panel.image_url ? (
                    <Image
                        src={panel.image_url}
                        alt={`Panel ${panel.sequence_number}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-dim-gray/30 group-hover:text-vivid-teal/30 transition-colors">
                        <ImageIcon className="w-10 h-10" />
                        <span className="text-[10px] font-black uppercase tracking-widest">No Visual Generated</span>
                    </div>
                )}

                <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black text-pure-white z-10">
                    PANEL #{panel.sequence_number}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex-1 flex flex-col gap-4">
                {/* AI Prompt Section */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-vivid-teal uppercase tracking-widest px-1">
                        <Sparkles className="w-3 h-3" />
                        Image Prompt
                    </div>
                    <div className="p-3 rounded-xl bg-vivid-teal/5 border border-vivid-teal/10 text-xs text-pure-white leading-relaxed italic line-clamp-2 group-hover:line-clamp-none transition-all cursor-help">
                        {panel.image_prompt || 'Chưa có prompt hình ảnh...'}
                    </div>
                </div>

                {/* Cinematic Details */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5 p-3 rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/[0.07] transition-colors">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-dim-gray uppercase tracking-widest">
                            <Camera className="w-3 h-3 text-neon-cyan" />
                            Góc máy
                        </div>
                        <p className="text-[11px] text-muted-silver font-medium line-clamp-1">
                            {panel.photography_rules || 'Default'}
                        </p>
                    </div>

                    <div className="space-y-1.5 p-3 rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/[0.07] transition-colors">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-dim-gray uppercase tracking-widest">
                            <User className="w-3 h-3 text-vivid-teal" />
                            Diễn xuất
                        </div>
                        <p className="text-[11px] text-muted-silver font-medium line-clamp-1">
                            {panel.acting_notes || 'Natural'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="px-5 py-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${panel.status === 'completed' ? 'bg-success shadow-success' : 'bg-dim-gray shadow-dim-gray'}`} />
                    <span className="text-[9px] font-black uppercase tracking-tighter text-dim-gray">{panel.status}</span>
                </div>
                <button className="text-[10px] font-bold text-vivid-teal hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Edit Detail <Info className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}
