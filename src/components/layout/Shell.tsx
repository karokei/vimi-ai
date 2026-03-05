'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    User,
    Settings,
    LogOut,
    Video,
    Image as ImageIcon,
    ChevronRight,
    Menu,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

const navigation = [
    { name: 'Workspace', href: '/workspace', icon: LayoutDashboard },
    { name: 'Asset Hub', href: '/assets', icon: ImageIcon },
    { name: 'Library', href: '/library', icon: Video },
];

const secondaryNavigation = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Shell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const supabase = createClient();

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error('Lỗi khi đăng xuất: ' + error.message);
        } else {
            window.location.href = '/';
        }
    };

    return (
        <div className="min-h-screen bg-midnight-abyss text-pure-white flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 glass-strong border-r border-white/5 
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="h-full flex flex-col p-6">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-vivid-teal flex items-center justify-center shadow-neon-cyan animate-pulse-neon">
                            <Video className="w-6 h-6 text-midnight-abyss" strokeWidth={2.5} />
                        </div>
                        <span className="text-2xl font-black font-heading tracking-tight gradient-text-primary">
                            VimiAI
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        <p className="text-xs font-bold text-dim-gray uppercase tracking-widest mb-4 px-2">Main Menu</p>
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    aria-label={`Navigate to ${item.name}`}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive
                                            ? 'bg-white/10 text-neon-cyan border border-white/10 shadow-lg'
                                            : 'hover:bg-white/5 text-muted-silver hover:text-pure-white'
                                        }
                  `}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-neon-cyan' : 'group-hover:text-neon-cyan transition-colors'}`} />
                                    <span className="font-medium">{item.name}</span>
                                    {isActive && <ChevronRight className="w-4 h-4 ml-auto text-neon-cyan" />}
                                </Link>
                            );
                        })}

                        <p className="text-xs font-bold text-dim-gray uppercase tracking-widest mt-10 mb-4 px-2">Account</p>
                        {secondaryNavigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    aria-label={`Go to ${item.name}`}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive
                                            ? 'bg-white/10 text-neon-cyan border border-white/10 shadow-lg'
                                            : 'hover:bg-white/5 text-muted-silver hover:text-pure-white'
                                        }
                  `}
                                >
                                    <item.icon className="w-5 h-5 group-hover:text-neon-cyan transition-colors" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section / Sign Out */}
                    <div className="mt-auto pt-6 border-t border-white/5">
                        <button
                            onClick={handleSignOut}
                            aria-label="Sign out of your account"
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-200"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Top Navbar */}
                <header className="h-20 glass border-b border-white/5 flex items-center justify-between px-6 lg:px-10 z-30 shrink-0">
                    <button
                        className="lg:hidden p-2 text-muted-silver"
                        onClick={() => setIsSidebarOpen(true)}
                        aria-label="Open sidebar menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="hidden lg:block">
                        <h1 className="text-lg font-semibold text-muted-silver">
                            Welcome back, <span className="text-pure-white">Creator</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full border-2 border-midnight-abyss bg-neon-cyan/20 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-neon-cyan">AI</span>
                            </div>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-matte-clay border border-white/10 overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-neon-cyan/20 to-vivid-teal/20" />
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar-y">
                    {children}
                </div>

                {/* Atmospheric background glows */}
                <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/5 rounded-full blur-[120px] pointer-events-none -z-10" />
                <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-vivid-teal/5 rounded-full blur-[120px] pointer-events-none -z-10" />
            </main>
        </div>
    );
}
