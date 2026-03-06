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
  ChevronRight
} from "lucide-react";
import VimiNavbar from "@/components/layout/VimiNavbar";
import VimiButton from "@/components/ui/VimiButton";
import VimiSurface from "@/components/ui/VimiSurface";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-body selection:bg-primary/30">
      <VimiNavbar />

      {/* === Background Effects === */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Animated Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-primary/10 blur-[120px] rounded-full animate-float-1" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-accent/10 blur-[120px] rounded-full animate-float-2" />

        {/* Abstract Lines/Grid */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <main className="relative z-10">
        {/* === Hero Section (3D Floating Style) === */}
        <section className="relative pt-32 lg:pt-48 pb-24 px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

            {/* Left Content */}
            <div className="text-left space-y-8 animate-slide-up">
              <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 bg-white/5 backdrop-blur-sm animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-medium text-muted tracking-wide uppercase">
                  The Next-Gen Video Production Platform
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold font-heading tracking-tight leading-[1.1] text-white">
                Create cinematic videos <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary animate-gradient-x">
                  at the speed of thought.
                </span>
              </h1>

              <p className="text-lg text-muted max-w-xl leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
                VimiAI is the ultimate creative suite for modern storytellers. Transform your ideas into broadcast-quality videos with an unparalleled suite of intelligent creation tools.
              </p>

              <div className="flex flex-wrap gap-4 pt-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <Link href="/signup">
                  <VimiButton variant="primary" size="lg" iconRight={<ArrowRight className="w-5 h-5" />}>
                    Start Creating Now
                  </VimiButton>
                </Link>
                <Link href="#features">
                  <VimiButton variant="ghost" size="lg" iconLeft={<Play className="w-5 h-5" />}>
                    Watch Demo
                  </VimiButton>
                </Link>
              </div>
            </div>

            {/* Right Visual (3D Floating Components) */}
            <div className="relative h-[500px] lg:h-[600px] flex items-center justify-center animate-scale-in">
              <div className="relative w-full max-w-md aspect-square">
                {/* Floating Elements from waoowaoo style but Vimi colors */}
                <VimiSurface
                  variant="elevated"
                  className="absolute top-0 right-4 w-64 h-80 transform rotate-6 animate-float"
                  padded={false}
                >
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <Film className="w-12 h-12 text-primary/40" />
                  </div>
                </VimiSurface>

                <VimiSurface
                  variant="glass"
                  className="absolute bottom-8 left-0 w-72 h-80 transform -rotate-3 animate-float"
                  style={{ animationDelay: '-2s' }}
                  padded={false}
                >
                  <div className="p-6 space-y-4">
                    <div className="h-4 w-3/4 bg-white/5 rounded-full" />
                    <div className="h-4 w-1/2 bg-white/5 rounded-full" />
                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <div className="h-20 bg-accent/10 rounded-lg animate-pulse" />
                      <div className="h-20 bg-primary/10 rounded-lg animate-pulse" />
                    </div>
                  </div>
                </VimiSurface>

                <VimiSurface
                  variant="elevated"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 shadow-neon-teal z-20 animate-float"
                  style={{ animationDelay: '-1s' }}
                  padded={false}
                >
                  <div className="relative w-full h-full group cursor-pointer overflow-hidden rounded-lg">
                    <Image
                      src="/og-image.png"
                      alt="VimiAI Studio"
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-all">
                      <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <Play className="w-6 h-6 ml-1 fill-white/80" />
                      </div>
                    </div>
                  </div>
                </VimiSurface>
              </div>
            </div>
          </div>
        </section>

        {/* === Features Grid === */}
        <section id="features" className="relative z-10 px-6 lg:px-12 py-32 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20 animate-slide-up">
              <h2 className="text-3xl lg:text-5xl font-bold font-heading text-white mb-6">
                Everything you need to produce a masterpiece.
              </h2>
              <p className="text-muted text-lg max-w-2xl mx-auto">
                A comprehensive studio environment that consolidates scriptwriting, asset management, storyboarding, and timeline editing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        <footer className="relative z-10 border-t border-white/5 bg-[#070B14] px-6 lg:px-12 py-16">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 flex items-center justify-center bg-primary rounded shadow-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">VimiAI</span>
            </div>
            <p className="text-sm text-dim-gray font-medium">
              © {new Date().getFullYear()} VimiAI Studio. Empowering creators with AI.
            </p>
            <div className="flex items-center gap-8">
              <Link href="#" className="text-sm text-muted hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="text-sm text-muted hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </footer>
      </main>
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
    <VimiSurface variant="card" interactive className="group h-full flex flex-col items-start text-left">
      <div className="w-12 h-12 rounded-lg bg-background border border-white/5 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform group-hover:border-primary/30 group-hover:shadow-neon-teal/20">
        {icon}
      </div>
      <h3 className="text-xl font-bold font-heading text-white mb-3 flex items-center gap-2">
        {title}
        <ChevronRight className="w-4 h-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </h3>
      <p className="text-muted leading-relaxed">
        {description}
      </p>
    </VimiSurface>
  );
}
