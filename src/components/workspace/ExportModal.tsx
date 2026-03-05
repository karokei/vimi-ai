import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, FileVideo, Download, X } from 'lucide-react';
import { ClipData } from '@/remotion/Composition';

interface ExportModalProps {
    clips: ClipData[];
    onClose: () => void;
}

export default function ExportModal({ clips, onClose }: ExportModalProps) {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<'idle' | 'rendering' | 'done' | 'error'>('idle');
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    useEffect(() => {
        // Start rendering automatically when modal opens
        startRender();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startRender = async () => {
        setStatus('rendering');
        setProgress(0);

        try {
            // Call the real backend API
            const response = await fetch('/api/render', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clips }),
            });

            if (!response.ok) throw new Error('Render failed to start');

            // Optionally use jobId for polling if needed in future
            await response.json();

            // Poll for progress (Mocked for now since real Lambda takes complex setup)
            // In a real Remotion Lambda environment, we would poll /api/render/status?jobId=...
            const interval = setInterval(() => {
                setProgress(p => {
                    const next = p + Math.random() * 15;
                    if (next >= 100) {
                        clearInterval(interval);
                        setStatus('done');
                        setDownloadUrl('#'); // Placeholder for actual S3 URL
                        return 100;
                    }
                    return next;
                });
            }, 800);

        } catch (error) {
            console.error('Render error:', error);
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-midnight-abyss border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
                <button
                    onClick={onClose}
                    disabled={status === 'rendering'}
                    className="absolute top-4 right-4 text-muted-silver hover:text-white disabled:opacity-50"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-vivid-teal/10 flex items-center justify-center border border-vivid-teal/30">
                        {status === 'rendering' ? (
                            <Loader2 className="w-8 h-8 text-vivid-teal animate-spin" />
                        ) : status === 'done' ? (
                            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        ) : (
                            <FileVideo className="w-8 h-8 text-vivid-teal" />
                        )}
                    </div>

                    <div>
                        <h2 className="text-xl font-bold font-heading text-white mb-2">
                            {status === 'rendering' ? 'Đang xuất Video (Rendering)...' :
                                status === 'done' ? 'Video đã hoàn tất!' :
                                    status === 'error' ? 'Lỗi xuất Video' : 'Chuẩn bị xuất...'}
                        </h2>
                        <p className="text-sm text-muted-silver">
                            {status === 'rendering' ? 'Hệ thống đang render từng frame hình ảnh và ghép nối âm thanh. Vui lòng không đóng cửa sổ này.' :
                                status === 'done' ? 'Video của bạn đã sẵn sàng để tải xuống.' : ''}
                        </p>
                    </div>

                    {status === 'rendering' && (
                        <div className="w-full space-y-2">
                            <div className="flex justify-between text-xs font-bold text-muted-silver">
                                <span>Tiến trình</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-black rounded-full h-3 border border-white/5 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-vivid-teal to-neon-cyan h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(45,212,191,0.5)]"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {status === 'done' && (
                        <a
                            href={downloadUrl || '#'}
                            download="VimiAI_Export.mp4"
                            className="bg-vivid-teal hover:bg-neon-cyan text-black font-bold py-3 px-6 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 w-full shadow-lg shadow-vivid-teal/20"
                        >
                            <Download className="w-5 h-5" />
                            Tải Video (.mp4)
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
