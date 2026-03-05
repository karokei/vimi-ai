'use client';

import React from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, Key, Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserProfile {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
    updated_at: string;
}

interface UserPreference {
    id: string;
    google_ai_key: string | null;
    default_model_config: Record<string, unknown> | null;
    updated_at: string;
}

export default function ProfilePage() {
    const supabase = createClient();
    const [profile, setProfile] = React.useState<UserProfile | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);

    const [displayName, setDisplayName] = React.useState('');
    const [apiKey, setApiKey] = React.useState('');

    React.useEffect(() => {
        async function loadData() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const [pRes, prefRes] = await Promise.all([
                supabase.from('profiles').select('id, display_name, avatar_url, updated_at').eq('id', user.id).single(),
                supabase.from('user_preferences').select('id, google_ai_key, updated_at').eq('id', user.id).single(),
            ]);

            if (pRes.data) {
                setProfile(pRes.data as UserProfile);
                setDisplayName(pRes.data.display_name || '');
            }
            if (prefRes.data) {
                const prefsData = prefRes.data as UserPreference;
                setApiKey(prefsData.google_ai_key || '');
            }
            setLoading(false);
        }
        loadData();
    }, [supabase]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();

        try {
            const { error: pErr } = await supabase
                .from('profiles')
                .update({ display_name: displayName })
                .eq('id', user?.id);

            const { error: prefErr } = await supabase
                .from('user_preferences')
                .update({ google_ai_key: apiKey })
                .eq('id', user?.id);

            if (pErr || prefErr) throw pErr || prefErr;
            toast.success('Đã cập nhật Profile thành công!');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            toast.error('Lỗi khi cập nhật: ' + message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-10 animate-fade-in">
            <div>
                <h2 className="text-3xl font-black font-heading tracking-tight gradient-text-primary mb-2">User Profile</h2>
                <p className="text-muted-silver">Quản lý thông tin cá nhân và cấu hình AI của bạn.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* Basic Info */}
                <section className="card-clay p-8 space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-2">
                        <User className="w-5 h-5 text-neon-cyan" />
                        <h3 className="text-lg font-bold font-heading">Thông tin cơ bản</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-semibold text-muted-silver ml-1">Email</label>
                            <input
                                id="email"
                                type="text"
                                disabled
                                value={profile?.id ? profile.id : 'Loading...'}
                                className="input-dark w-full opacity-50 cursor-not-allowed"
                            />
                            <p className="text-[10px] text-dim-gray ml-1 italic">ID người dùng (Read-only)</p>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="display_name" className="text-sm font-semibold text-muted-silver ml-1">Tên hiển thị</label>
                            <input
                                id="display_name"
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="VD: Karo Kei"
                                className="input-dark w-full"
                            />
                        </div>
                    </div>
                </section>

                {/* AI Configuration */}
                <section className="card-clay p-8 space-y-6 border-neon-cyan/10">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-2">
                        <div className="flex items-center gap-3">
                            <Key className="w-5 h-5 text-vivid-teal" />
                            <h3 className="text-lg font-bold font-heading">Google AI configuration</h3>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-vivid-teal/20 text-vivid-teal uppercase tracking-wider">
                            Gemini 3.1 Ready
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="api_key" className="text-sm font-semibold text-muted-silver ml-1">Google AI API Key</label>
                            <input
                                id="api_key"
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Nhập API Key của bạn..."
                                className="input-dark w-full border-vivid-teal/20 focus:border-vivid-teal"
                            />
                        </div>

                        <div className="p-4 rounded-xl bg-vivid-teal/5 border border-vivid-teal/10 flex gap-4">
                            <AlertCircle className="w-5 h-5 text-vivid-teal shrink-0" />
                            <p className="text-xs text-muted-silver leading-relaxed">
                                API Key này sẽ được sử dụng để gọi các model **Gemini 3.1 Pro/Flash**, **Veo 3.1** và **Lyria**.
                                Chúng tôi lưu trữ key này để bạn không phải nhập lại mỗi lần tạo video.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                        {['Gemini 3.1 Flash', 'Nano Banana 2', 'Veo 3.1', 'Lyria Exp'].map(model => (
                            <div key={model} className="p-3 rounded-lg bg-white/5 border border-white/5 text-center">
                                <span className="text-[10px] text-dim-gray font-bold block mb-1 uppercase tracking-tighter">Verified Model</span>
                                <span className="text-xs font-semibold text-pure-white">{model}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary flex items-center gap-2 min-w-[160px] justify-center"
                    >
                        {saving ? (
                            <div className="w-4 h-4 border-2 border-midnight-abyss border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        <span>Lưu thay đổi</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
