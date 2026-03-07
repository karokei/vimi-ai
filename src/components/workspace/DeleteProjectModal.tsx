'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    projectName: string;
    loading?: boolean;
}

export default function DeleteProjectModal({
    isOpen,
    onClose,
    onConfirm,
    projectName,
    loading = false
}: DeleteProjectModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Xác nhận Xóa Dự án">
            <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm">Hành động này không thể hoàn tác</h4>
                        <p className="text-xs text-red-200/60 mt-0.5">
                            Bạn đang chuẩn bị xóa toàn bộ tài nguyên, kịch bản và video của dự án này.
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-sm text-muted-silver ml-1">
                        Bạn có chắc chắn muốn xóa dự án:
                        <span className="text-white font-bold block mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/5 italic">
                            "{projectName}"
                        </span>
                    </p>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 btn-ghost"
                    >
                        Dừng lại
                    </button>
                    <button
                        type="button"
                        disabled={loading}
                        onClick={onConfirm}
                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4" />
                                <span>Xóa vĩnh viễn</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
