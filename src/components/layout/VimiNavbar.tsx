'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import VimiButton from '@/components/ui/VimiButton';
import { User, LogOut, LayoutDashboard, Sparkles } from 'lucide-react';

export default function VimiNavbar() {
    const [user, setUser] = useState<any>(null);
    const [scrolled, setScrolled] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            subscription.unsubscribe();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-6'
            }`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className={`
                    flex items-center justify-between px-6 h-16 rounded-full border transition-all duration-300
                    ${scrolled
                        ? 'bg-midnight-abyss/80 backdrop-blur-md border-white/10 shadow-float'
                        : 'bg-transparent border-transparent'}
                `}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-8 h-8 flex items-center justify-center bg-primary rounded-lg shadow-neon-teal group-hover:scale-110 transition-transform">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold font-heading tracking-tight text-white">
                            VimiAI
                        </span>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <Link href="/workspace" className="hidden sm:block">
                                    <VimiButton variant="ghost" size="sm" iconLeft={<LayoutDashboard className="w-4 h-4" />}>
                                        Workspace
                                    </VimiButton>
                                </Link>
                                <Link href="/profile">
                                    <div className="w-9 h-9 rounded-full bg-matte-clay border border-white/10 flex items-center justify-center hover:border-primary/50 transition-colors">
                                        <User className="w-5 h-5 text-muted-silver" />
                                    </div>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="hidden sm:block">
                                    <VimiButton variant="ghost" size="sm">Log in</VimiButton>
                                </Link>
                                <Link href="/signup">
                                    <VimiButton variant="primary" size="sm">Start Free</VimiButton>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
