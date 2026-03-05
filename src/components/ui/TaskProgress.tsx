'use client';

import React from 'react';
import { Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface TaskProgressProps {
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    progress: number;
    message?: string;
    error?: string;
    onComplete?: () => void;
}

export default function TaskProgress({ status, progress, message, error, onComplete }: TaskProgressProps) {
    const isFinished = status === 'completed';
    const isFailed = status === 'failed';
    const isProcessing = status === 'processing' || status === 'pending';

    React.useEffect(() => {
        if (isFinished && onComplete) {
            const timer = setTimeout(onComplete, 1000);
            return () => clearTimeout(timer);
        }
    }, [isFinished, onComplete]);

    return (
        <div className="card-clay p-6 space-y-4 animate-fade-in bg-white/[0.03] border-white/5 relative overflow-hidden group">
            {/* Background Glow */}
            <div className={`absolute -right-20 -top-20 w-40 h-40 rounded-full blur-[80px] opacity-20 transition-colors duration-1000 ${isFinished ? 'bg-success' : isFailed ? 'bg-destructive' : 'bg-neon-cyan'
                }`} />

            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isFinished ? 'bg-success/20 text-success' :
                            isFailed ? 'bg-destructive/20 text-destructive' :
                                'bg-neon-cyan/20 text-neon-cyan'
                        }`}>
                        {isFinished ? <CheckCircle2 className="w-6 h-6" /> :
                            isFailed ? <AlertCircle className="w-6 h-6" /> :
                                <Loader2 className="w-6 h-6 animate-spin" />}
                    </div>
                    <div>
                        <h4 className="font-black text-sm text-pure-white flex items-center gap-2 uppercase tracking-widest">
                            {isFinished ? 'Nhiệm vụ hoàn tất' : isFailed ? 'Lỗi xử lý' : 'Đang xử lý...'}
                            <Sparkles className={`w-3 h-3 text-dim-gray group-hover:text-neon-cyan transition-colors ${isProcessing ? 'animate-pulse' : ''}`} />
                        </h4>
                        <p className="text-[10px] text-muted-silver font-medium">{message || 'Vui lòng đợi trong giây lát'}</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xl font-black gradient-text-primary">{progress}%</span>
                </div>
            </div>

            {/* Progress Bar Container */}
            <div className="relative h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                <div
                    className={`h-full rounded-full transition-all duration-500 ease-out relative ${isFinished ? 'bg-success shadow-success' :
                            isFailed ? 'bg-destructive shadow-destructive' :
                                'bg-neon-cyan shadow-neon-cyan'
                        }`}
                    style={{ width: `${progress}%` }}
                >
                    {/* Pulsing light effect */}
                    {isProcessing && (
                        <div className="absolute inset-0 bg-white/30 animate-pulse-fast blur-sm" />
                    )}
                </div>
            </div>

            {isFailed && error && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 mt-2">
                    <p className="text-[10px] text-destructive font-bold">{error}</p>
                </div>
            )}
        </div>
    );
}
