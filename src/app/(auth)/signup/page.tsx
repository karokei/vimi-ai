"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
    Play,
    UserPlus,
    Eye,
    EyeOff,
    Loader2,
    CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp!");
            return;
        }

        if (password.length < 6) {
            toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        display_name: displayName || email.split("@")[0],
                    },
                },
            });

            if (error) {
                toast.error(error.message);
                return;
            }

            setSuccess(true);
            toast.success("Đăng ký thành công!");

            // Auto redirect after 2s
            setTimeout(() => {
                router.push("/workspace");
                router.refresh();
            }, 2000);
        } catch {
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-midnight-abyss flex items-center justify-center px-6">
                <div className="text-center animate-fade-in">
                    <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6 neon-glow-cyan">
                        <CheckCircle2 className="w-10 h-10 text-success" />
                    </div>
                    <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-pure-white mb-3">
                        Đăng ký thành công! 🎉
                    </h2>
                    <p className="text-muted-silver mb-6">
                        Đang chuyển hướng đến workspace...
                    </p>
                    <Link href="/workspace" className="btn-primary inline-flex items-center gap-2">
                        Vào Workspace
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-midnight-abyss flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div
                    className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full opacity-15"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(255,0,127,0.12) 0%, transparent 70%)",
                    }}
                />
                <div
                    className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full opacity-10"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%)",
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
                        Tạo tài khoản
                    </h1>
                    <p className="text-sm text-muted-silver text-center mb-8">
                        Bắt đầu hành trình sáng tạo với AI
                    </p>

                    <form onSubmit={handleSignup} className="space-y-4">
                        {/* Display Name */}
                        <div>
                            <label
                                htmlFor="signup-name"
                                className="block text-sm font-medium text-muted-silver mb-2"
                            >
                                Tên hiển thị
                            </label>
                            <input
                                id="signup-name"
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Creator Name"
                                className="input-dark w-full"
                                aria-label="Tên hiển thị"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="signup-email"
                                className="block text-sm font-medium text-muted-silver mb-2"
                            >
                                Email <span className="text-electric-pink">*</span>
                            </label>
                            <input
                                id="signup-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="input-dark w-full"
                                required
                                aria-label="Email đăng ký"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="signup-password"
                                className="block text-sm font-medium text-muted-silver mb-2"
                            >
                                Mật khẩu <span className="text-electric-pink">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="signup-password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Tối thiểu 6 ký tự"
                                    className="input-dark w-full pr-12"
                                    required
                                    minLength={6}
                                    aria-label="Mật khẩu đăng ký"
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

                        {/* Confirm Password */}
                        <div>
                            <label
                                htmlFor="signup-confirm"
                                className="block text-sm font-medium text-muted-silver mb-2"
                            >
                                Xác nhận mật khẩu <span className="text-electric-pink">*</span>
                            </label>
                            <input
                                id="signup-confirm"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu"
                                className="input-dark w-full"
                                required
                                minLength={6}
                                aria-label="Xác nhận mật khẩu"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                            id="signup-submit-btn"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <UserPlus className="w-5 h-5" />
                            )}
                            {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-muted-silver/10" />
                        <span className="text-xs text-dim-gray">hoặc</span>
                        <div className="flex-1 h-px bg-muted-silver/10" />
                    </div>

                    {/* Login link */}
                    <p className="text-center text-sm text-muted-silver">
                        Đã có tài khoản?{" "}
                        <Link
                            href="/login"
                            className="text-neon-cyan hover:underline font-medium"
                        >
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
