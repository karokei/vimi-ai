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
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

const navigation = [
    { name: 'Projects', href: '/workspace', icon: LayoutDashboard },
    { name: 'Assets', href: '/assets', icon: ImageIcon },
    { name: 'Library', href: '/library', icon: Video },
];

const secondaryNavigation = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Shell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false); // Mobile sidebar
    const [isCollapsed, setIsCollapsed] = React.useState(false); // Desktop sidebar
    const supabase = createClient();

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error('Sign out failed: ' + error.message);
        } else {
            window.location.href = '/';
        }
    };

    return (
        <div className="min-h-screen bg-background text-white flex font-body selection:bg-primary/30">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 bg-[#0B111A] border-r border-white/5 
                transform transition-all duration-300 ease-in-out flex flex-col
                lg:relative lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                ${isCollapsed ? 'w-20' : 'w-64'}
            `}>
                {/* Logo Area */}
                <div className="h-20 flex items-center shrink-0 px-6 border-b border-white/5 relative">
                    <Link href="/workspace" className={`flex items-center gap-3 w-full transition-opacity duration-300 ${isCollapsed ? 'justify-center px-0' : ''}`}>
                        <div className="relative w-8 h-8 shrink-0 flex items-center justify-center bg-primary rounded-lg text-white font-bold shadow-sm">
                            <Video className="w-5 h-5" />
                        </div>
                        {!isCollapsed && (
                            <span className="text-xl font-bold font-heading tracking-tight text-white whitespace-nowrap animate-in fade-in">
                                VimiAI
                            </span>
                        )}
                    </Link>

                    {/* Collapse Toggle */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0B111A] border border-white/10 rounded-full items-center justify-center text-muted hover:text-white hover:bg-white/5 transition-colors z-10 shadow-sm"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? <PanelLeftOpen className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-8 custom-scrollbar-y">
                    <nav className="px-3 space-y-1">
                        {!isCollapsed && (
                            <p className="px-3 text-[10px] font-bold text-muted uppercase tracking-wider mb-3 animate-in fade-in">Overview</p>
                        )}
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    title={isCollapsed ? item.name : undefined}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative outline-none focus-visible:ring-2 focus-visible:ring-primary/50
                                        ${isActive
                                            ? 'bg-primary/10 text-primary font-semibold'
                                            : 'text-muted hover:bg-white/5 hover:text-white'
                                        }
                                        ${isCollapsed ? 'justify-center' : ''}
                                    `}
                                >
                                    {isActive && !isCollapsed && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
                                    )}
                                    <item.icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-primary' : 'group-hover:text-white'}`} />
                                    {!isCollapsed && (
                                        <span className="truncate flex-1 animate-in fade-in">{item.name}</span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <nav className="px-3 space-y-1">
                        {!isCollapsed && (
                            <p className="px-3 text-[10px] font-bold text-muted uppercase tracking-wider mb-3 animate-in fade-in">Account</p>
                        )}
                        {secondaryNavigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    title={isCollapsed ? item.name : undefined}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative outline-none focus-visible:ring-2 focus-visible:ring-primary/50
                                        ${isActive
                                            ? 'bg-primary/10 text-primary font-semibold'
                                            : 'text-muted hover:bg-white/5 hover:text-white'
                                        }
                                        ${isCollapsed ? 'justify-center' : ''}
                                    `}
                                >
                                    {isActive && !isCollapsed && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
                                    )}
                                    <item.icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-primary' : 'group-hover:text-white'}`} />
                                    {!isCollapsed && (
                                        <span className="truncate flex-1 animate-in fade-in">{item.name}</span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Section */}
                <div className="p-4 border-t border-white/5 shrink-0">
                    <button
                        onClick={handleSignOut}
                        title={isCollapsed ? "Sign Out" : undefined}
                        className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-red-500/50
                            ${isCollapsed ? 'justify-center' : ''}
                        `}
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        {!isCollapsed && <span className="font-medium truncate animate-in fade-in">Sign Out</span>}
                    </button>

                    {/* User Mini Profile */}
                    {!isCollapsed && (
                        <div className="mt-4 flex items-center gap-3 px-3 py-2.5 rounded-md bg-black/20 border border-white/5 cursor-pointer hover:border-white/10 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                                <User className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-medium text-white truncate">Creator</span>
                                <span className="text-[10px] text-muted truncate">Pro Plan</span>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-background">
                {/* Top Navbar */}
                <header className="h-20 bg-background/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 lg:px-10 z-30 shrink-0 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 -ml-2 text-muted hover:text-white transition-colors"
                            onClick={() => setIsSidebarOpen(true)}
                            aria-label="Open sidebar menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="hidden lg:flex items-center text-sm font-medium text-muted">
                            <span className="hover:text-white cursor-pointer transition-colors">Workspace</span>
                            <ChevronRight className="w-4 h-4 mx-2 text-white/20" />
                            <span className="text-white">Overview</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/workspace" className="hidden sm:block">
                            <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary hover:bg-primary/20 transition-colors cursor-pointer">
                                Upgrade to Pro
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar-y">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
