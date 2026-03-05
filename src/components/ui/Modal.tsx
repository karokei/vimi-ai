'use client';

import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Content */}
            <div className="relative w-full max-w-xl glass-strong border border-white/10 rounded-3xl shadow-float animate-slide-up flex flex-col overflow-hidden max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h3 className="text-xl font-black font-heading gradient-text-primary px-2">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full text-muted-silver hover:text-pure-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar-y">
                    {children}
                </div>
            </div>
        </div>
    );
}
