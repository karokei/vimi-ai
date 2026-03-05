import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Film,
  Wand2,
  Mic2,
  Music,
  Clapperboard,
  ArrowRight,
  Play,
  Layers,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-body">
      {/* === Professional Navbar === */}
      <nav className="relative z-50 flex items-center justify-between px-6 lg:px-12 py-5 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3 group">
          <Image src="/logo.png" alt="VimiAI Logo" width={32} height={32} unoptimized className="group-hover:opacity-80 transition-opacity" />
          <span className="text-xl font-bold font-heading tracking-tight text-white">
            VimiAI
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="btn-ghost text-sm px-5 py-2"
            aria-label="Đăng nhập"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="btn-primary text-sm px-5 py-2"
            aria-label="Đăng ký tài khoản"
          >
            Start Free Trial
          </Link>
        </div>
      </nav>

      {/* === Video-First Hero Section === */}
      <section className="relative z-10 px-6 lg:px-12 pt-20 lg:pt-32 pb-24">
        {/* Abstract Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 mb-8 bg-white/5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-medium text-muted tracking-wide uppercase">
              The Next-Gen Video Production Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-7xl font-bold font-heading tracking-tight leading-[1.1] mb-6 text-white max-w-4xl">
            Create cinematic videos <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
              at the speed of thought.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-muted max-w-2xl mb-10 leading-relaxed">
            VimiAI is the ultimate creative suite for modern storytellers. Transform your ideas into broadcast-quality videos with an unparalleled suite of intelligent creation tools.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              href="/signup"
              className="bg-primary hover:bg-[#1456A3] text-white text-lg font-medium px-8 py-4 rounded-md transition-colors flex items-center gap-2"
            >
              Start Creating Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="bg-surface hover:bg-card border border-white/10 text-white text-lg font-medium px-8 py-4 rounded-md transition-colors flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </Link>
          </div>

          {/* Editor Interface Mockup */}
          <div className="w-full max-w-6xl relative mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-b from-primary/30 to-transparent rounded-xl blur opacity-50"></div>
            <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-surface aspect-video flex items-center justify-center">
              {/* Using the OG Image as a placeholder for the beautiful dashboard interface */}
              <Image
                src="/og-image.png"
                alt="VimiAI Studio Interface"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 text-white flex items-center justify-center transition-all cursor-pointer">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 ml-1 fill-white/80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Features Grid === */}
      <section id="features" className="relative z-10 px-6 lg:px-12 py-24 bg-surface/50 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-heading text-white mb-4">
              Everything you need to produce a masterpiece.
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              A comprehensive studio environment that consolidates scriptwriting, asset management, storyboarding, and timeline editing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Layers className="w-6 h-6 text-primary" />}
              title="End-to-end Pipeline"
              description="A 7-stage coherent workflow from a blank white page to a final rendered 4K video."
            />
            <FeatureCard
              icon={<Wand2 className="w-6 h-6 text-accent" />}
              title="Intelligent Storyboarding"
              description="Automatic breakdown of scripts into highly detailed visual panels and camera directions."
            />
            <FeatureCard
              icon={<Film className="w-6 h-6 text-primary" />}
              title="Cinematic Asset Hub"
              description="Manage characters, environments, and visual styles consistently across your entire project."
            />
            <FeatureCard
              icon={<Mic2 className="w-6 h-6 text-accent" />}
              title="Dynamic Voice Studio"
              description="Infuse emotion into your story with multi-lingual, highly expressive voice generation."
            />
            <FeatureCard
              icon={<Music className="w-6 h-6 text-primary" />}
              title="Ambient Soundscapes"
              description="Auto-generate and layer background scores that adapt perfectly to the mood of the scene."
            />
            <FeatureCard
              icon={<Clapperboard className="w-6 h-6 text-accent" />}
              title="Pro Timeline Editor"
              description="Fine-tune every frame, transition, and track in our browser-based, high-performance editor."
            />
          </div>
        </div>
      </section>

      {/* === Footer === */}
      <footer className="relative z-10 border-t border-white/10 bg-background px-6 lg:px-12 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-white">
            <Image src="/logo.png" alt="Logo" width={24} height={24} unoptimized />
            <span className="font-bold tracking-tight">VimiAI</span>
          </div>
          <p className="text-sm text-dim-gray">
            © 2026 VimiAI Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-muted hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="text-sm text-muted hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// === Feature Card Component ===
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card border border-white/5 rounded-md p-8 hover:border-white/10 transition-colors group">
      <div className="w-12 h-12 rounded-md bg-background border border-white/5 flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold font-heading text-white mb-3">
        {title}
      </h3>
      <p className="text-muted leading-relaxed">
        {description}
      </p>
    </div>
  );
}
