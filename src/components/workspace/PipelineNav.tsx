'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BookOpen,
    FileText,
    Users,
    Image as ImageIcon,
    Sparkles,
    Mic,
    Video,
    ChevronRight
} from 'lucide-react';

const STAGES = [
    { id: 'novel', name: 'Novel', icon: BookOpen, path: '' },
    { id: 'script', name: 'Script', icon: FileText, path: '/script' },
    { id: 'assets', name: 'Assets', icon: Users, path: '/assets' },
    { id: 'storyboard', name: 'Storyboard', icon: ImageIcon, path: '/storyboard' },
    { id: 'prompts', name: 'Prompts', icon: Sparkles, path: '/prompts' },
    { id: 'voice', name: 'Voice', icon: Mic, path: '/voice' },
    { id: 'video', name: 'Video', icon: Video, path: '/video' },
];

export default function PipelineNav({ projectId }: { projectId: string }) {
    const pathname = usePathname();

    return (
        <div className="flex items-center gap-2 p-1.5 glass-strong rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
            {STAGES.map((stage, index) => {
                const fullPath = `/workspace/${projectId}${stage.path}`;
                const isActive = pathname === fullPath;
                const isLast = index === STAGES.length - 1;

                return (
                    <React.Fragment key={stage.id}>
                        <Link
                            href={fullPath}
                            aria-label={`Go to ${stage.name} stage`}
                            className={`
                flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 whitespace-nowrap group
                ${isActive
                                    ? 'bg-neon-cyan text-midnight-abyss shadow-neon-cyan font-bold scale-105'
                                    : 'text-muted-silver hover:bg-white/5 hover:text-pure-white'
                                }
              `}
                        >
                            <stage.icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : 'group-hover:text-neon-cyan'}`} />
                            <span className="text-xs uppercase tracking-wider">{stage.name}</span>
                        </Link>
                        {!isLast && <ChevronRight className="w-3 h-3 text-dim-gray flex-shrink-0" />}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
