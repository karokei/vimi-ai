import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    Play,
    Plus,
    FolderOpen,
    Settings,
    LogOut,
} from "lucide-react";

export default async function WorkspacePage() {
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
        <div className="min-h-screen bg-midnight-abyss">
            {/* === Navbar === */}
            <nav className="flex items-center justify-between px-6 lg:px-10 py-4 border-b border-muted-silver/8">
                <Link href="/workspace" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-cyan to-vivid-violet flex items-center justify-center transition-transform group-hover:scale-105">
                        <Play className="w-4 h-4 text-midnight-abyss fill-current" />
                    </div>
                    <span className="text-xl font-bold font-[family-name:var(--font-heading)] gradient-text-primary">
                        VimiAI
                    </span>
                </Link>

                <div className="flex items-center gap-3">
                    <Link
                        href="/profile"
                        className="btn-ghost text-sm px-3 py-2 flex items-center gap-2"
                        aria-label="Cài đặt hồ sơ"
                    >
                        <Settings className="w-4 h-4" />
                        <span className="hidden sm:inline">Cài đặt</span>
                    </Link>
                    <form action="/api/auth/signout" method="POST">
                        <button
                            type="submit"
                            className="btn-ghost text-sm px-3 py-2 flex items-center gap-2"
                            aria-label="Đăng xuất"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Đăng xuất</span>
                        </button>
                    </form>
                </div>
            </nav>

            {/* === Main Content === */}
            <main className="px-6 lg:px-10 py-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-pure-white">
                            Xin chào, {displayName} 👋
                        </h1>
                        <p className="text-muted-silver mt-1">
                            Sẵn sàng tạo video AI chuyên nghiệp?
                        </p>
                    </div>
                    <button
                        className="btn-primary flex items-center gap-2"
                        id="create-project-btn"
                        aria-label="Tạo dự án mới"
                    >
                        <Plus className="w-5 h-5" />
                        Dự án mới
                    </button>
                </div>

                {/* Empty State */}
                <div className="card-clay p-16 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-matte-clay flex items-center justify-center mx-auto mb-6">
                        <FolderOpen className="w-10 h-10 text-dim-gray" />
                    </div>
                    <h2 className="text-xl font-semibold font-[family-name:var(--font-heading)] text-pure-white mb-3">
                        Chưa có dự án nào
                    </h2>
                    <p className="text-muted-silver mb-8 max-w-md mx-auto">
                        Tạo dự án đầu tiên của bạn để bắt đầu biến tiểu thuyết thành video
                        cinematic với sức mạnh AI.
                    </p>
                    <button
                        className="btn-secondary inline-flex items-center gap-2"
                        aria-label="Tạo dự án đầu tiên"
                    >
                        <Plus className="w-5 h-5" />
                        Tạo dự án đầu tiên
                    </button>
                </div>
            </main>
        </div>
    );
}
