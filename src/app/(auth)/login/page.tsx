"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Play, LogIn, Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                toast.error(error.message);
                return;
            }

            toast.success("Đăng nhập thành công!");
            router.push("/workspace");
            router.refresh();
        } catch {
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-midnight-abyss flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div
                    className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-15"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(0,229,255,0.12) 0%, transparent 70%)",
                    }}
                />
                <div
                    className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-10"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(138,43,226,0.1) 0%, transparent 70%)",
                    }}
                />
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 mb-10 group"
                >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-vivid-violet flex items-center justify-center neon-glow-cyan transition-transform group-hover:scale-105">
                        <Play className="w-6 h-6 text-midnight-abyss fill-current" />
                    </div>
                    <span className="text-3xl font-bold font-[family-name:var(--font-heading)] gradient-text-primary">
                        VimiAI
                    </span>
                </Link>

                {/* Card */}
                <div className="glass-strong rounded-2xl p-8 animate-fade-in">
                    <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-pure-white text-center mb-2">
                        Chào mừng trở lại
                    </h1>
                    <p className="text-sm text-muted-silver text-center mb-8">
                        Đăng nhập để tiếp tục sáng tạo
                    </p>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="login-email"
                                className="block text-sm font-medium text-muted-silver mb-2"
                            >
                                Email
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="input-dark w-full"
                                required
                                aria-label="Email đăng nhập"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="login-password"
                                className="block text-sm font-medium text-muted-silver mb-2"
                            >
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="input-dark w-full pr-12"
                                    required
                                    aria-label="Mật khẩu đăng nhập"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dim-gray hover:text-muted-silver transition-colors"
                                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                            id="login-submit-btn"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <LogIn className="w-5 h-5" />
                            )}
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-muted-silver/10" />
                        <span className="text-xs text-dim-gray">hoặc</span>
                        <div className="flex-1 h-px bg-muted-silver/10" />
                    </div>

                    {/* Sign up link */}
                    <p className="text-center text-sm text-muted-silver">
                        Chưa có tài khoản?{" "}
                        <Link
                            href="/signup"
                            className="text-neon-cyan hover:underline font-medium"
                        >
                            Đăng ký miễn phí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
