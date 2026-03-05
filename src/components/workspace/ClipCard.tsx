'use client';

import React from 'react';
import { Type, AlignLeft, Sparkles } from 'lucide-react';

interface Clip {
    id: string;
    sequence_number: number;
    title: string;
    content: string;
    screenplay: string;
    status: string;
}

interface ClipCardProps {
    clip: Clip;
    index: number;
}

export default function ClipCard({ clip, index }: ClipCardProps) {
    return (
        <div
            className="card-clay p-6 space-y-4 group hover:border-neon-cyan/30 transition-all animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-xs font-black text-neon-cyan">
                        {clip.sequence_number}
                    </div>
                    <h3 className="font-bold text-pure-white group-hover:text-neon-cyan transition-colors truncate max-w-[200px]">
                        {clip.title}
                    </h3>
                </div>
                <div className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-dim-gray border border-white/5">
                    {clip.status}
                </div>
            </div>

            <div className="space-y-4">
                {/* Original Content Snippet */}
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-dim-gray uppercase tracking-widest px-1">
                        <Type className="w-3 h-3" />
                        Nội dung gốc
                    </div>
                    <div className="p-3 rounded-xl bg-midnight-abyss/50 border border-white/5 text-xs text-muted-silver leading-relaxed line-clamp-3">
                        {clip.content}
                    </div>
                </div>

                {/* AI Screenplay */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-vivid-teal uppercase tracking-widest px-1">
                        <Sparkles className="w-3 h-3" />
                        Kịch bản AI đề xuất
                    </div>
                    <div className="p-4 rounded-xl bg-vivid-teal/5 border border-vivid-teal/10 text-sm text-pure-white leading-relaxed italic">
                        {clip.screenplay}
                    </div>
                </div>
            </div>

            <div className="pt-2 flex justify-end">
                <button className="text-[10px] font-bold text-neon-cyan hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Chỉnh sửa chi tiết <AlignLeft className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}
