'use client';

import React from 'react';
import { Settings as SettingsIcon, Shield, Bell, ToyBrick } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-10 animate-fade-in">
            <div>
                <h2 className="text-3xl font-black font-heading gradient-text-primary mb-2">Settings</h2>
                <p className="text-muted-silver">Cấu hình hệ thống và tùy chỉnh trải nghiệm của bạn.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* General Settings */}
                <section className="card-clay p-8 space-y-6 opacity-50">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <SettingsIcon className="w-5 h-5 text-neon-cyan" />
                        <h3 className="text-lg font-bold font-heading">Chung</h3>
                    </div>
                    <div className="space-y-4">
                        <p className="text-sm text-dim-gray italic">Đang phát triển...</p>
                    </div>
                </section>

                {/* Security Settings */}
                <section className="card-clay p-8 space-y-6 opacity-50">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <Shield className="w-5 h-5 text-vivid-teal" />
                        <h3 className="text-lg font-bold font-heading">Bảo mật</h3>
                    </div>
                    <div className="space-y-4">
                        <p className="text-sm text-dim-gray italic">Đang phát triển...</p>
                    </div>
                </section>

                {/* Notifications */}
                <section className="card-clay p-8 space-y-6 opacity-50">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <Bell className="w-5 h-5 text-electric-pink" />
                        <h3 className="text-lg font-bold font-heading">Thông báo</h3>
                    </div>
                    <div className="space-y-4">
                        <p className="text-sm text-dim-gray italic">Đang phát triển...</p>
                    </div>
                </section>

                {/* Integrations */}
                <section className="card-clay p-8 space-y-6 opacity-50">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <ToyBrick className="w-5 h-5 text-neon-cyan" />
                        <h3 className="text-lg font-bold font-heading">Tích hợp</h3>
                    </div>
                    <div className="space-y-4">
                        <p className="text-sm text-dim-gray italic">Đang phát triển...</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
