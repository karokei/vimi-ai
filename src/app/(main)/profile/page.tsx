import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const displayName =
        user.user_metadata?.display_name || user.email?.split("@")[0] || "Creator";

    return (
        <div className="min-h-screen bg-midnight-abyss px-6 lg:px-10 py-10">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-pure-white mb-8">
                    Hồ sơ & Cài đặt
                </h1>

                {/* Profile Section */}
                <section className="card-clay p-8 mb-6">
                    <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-pure-white mb-4">
                        Thông tin cá nhân
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-silver mb-1">
                                Tên hiển thị
                            </label>
                            <p className="text-pure-white">{displayName}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-silver mb-1">
                                Email
                            </label>
                            <p className="text-pure-white">{user.email}</p>
                        </div>
                    </div>
                </section>

                {/* API Keys Section */}
                <section className="card-clay p-8 mb-6">
                    <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-pure-white mb-4">
                        🔑 Cấu hình API
                    </h2>
                    <p className="text-muted-silver text-sm mb-6">
                        Cấu hình API key cho Google AI Gemini để sử dụng các tính năng AI.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="google-ai-key"
                                className="block text-sm font-medium text-muted-silver mb-2"
                            >
                                Google AI API Key
                            </label>
                            <input
                                id="google-ai-key"
                                type="password"
                                placeholder="AIza••••••••••••••••"
                                className="input-dark w-full"
                                aria-label="Google AI API Key"
                            />
                            <p className="text-xs text-dim-gray mt-1">
                                Lấy API Key tại{" "}
                                <a
                                    href="https://aistudio.google.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-neon-cyan hover:underline"
                                >
                                    Google AI Studio
                                </a>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Model Preferences */}
                <section className="card-clay p-8">
                    <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-pure-white mb-4">
                        ⚙️ Tùy chọn Model
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ModelPreference
                            label="Phân tích văn bản"
                            model="Gemini 3.1 Flash Lite"
                        />
                        <ModelPreference
                            label="Tạo ảnh"
                            model="Nano Banana 2"
                        />
                        <ModelPreference
                            label="Chỉnh sửa ảnh"
                            model="Nano Banana 2"
                        />
                        <ModelPreference
                            label="Tạo video"
                            model="Veo 3.1"
                        />
                        <ModelPreference label="Lồng tiếng TTS" model="Gemini TTS" />
                        <ModelPreference label="Nhạc nền" model="Lyria" />
                    </div>
                </section>
            </div>
        </div>
    );
}

function ModelPreference({
    label,
    model,
}: {
    label: string;
    model: string;
}) {
    return (
        <div className="bg-midnight-abyss rounded-xl p-4 border border-muted-silver/8">
            <p className="text-xs text-dim-gray mb-1">{label}</p>
            <p className="text-sm text-neon-cyan font-medium">{model}</p>
        </div>
    );
}
