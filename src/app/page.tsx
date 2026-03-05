import Link from "next/link";
import {
  Sparkles,
  Film,
  Wand2,
  Mic2,
  Music,
  Clapperboard,
  ArrowRight,
  Play,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-midnight-abyss relative overflow-hidden">
      {/* === Atmospheric Background Effects === */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {/* Radial glow top-left */}
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(0,229,255,0.15) 0%, transparent 70%)",
          }}
        />
        {/* Radial glow bottom-right */}
        <div
          className="absolute -bottom-60 -right-60 w-[800px] h-[800px] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(138,43,226,0.12) 0%, transparent 70%)",
          }}
        />
        {/* Pink accent center */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(255,0,127,0.1) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* === Navbar === */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-vivid-violet flex items-center justify-center neon-glow-cyan transition-transform group-hover:scale-105">
            <Play className="w-5 h-5 text-midnight-abyss fill-current" />
          </div>
          <span className="text-2xl font-bold font-[family-name:var(--font-heading)] gradient-text-primary">
            VimiAI
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="btn-ghost text-sm px-5 py-2.5"
            aria-label="Đăng nhập vào VimiAI"
          >
            Đăng nhập
          </Link>
          <Link
            href="/signup"
            className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2"
            aria-label="Đăng ký tài khoản VimiAI"
          >
            <Sparkles className="w-4 h-4" />
            Bắt đầu ngay
          </Link>
        </div>
      </nav>

      {/* === Hero Section === */}
      <section className="relative z-10 px-6 lg:px-12 pt-16 lg:pt-24 pb-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            <span className="text-sm text-muted-silver">
              Powered by Google Gemini AI
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-7xl font-extrabold font-[family-name:var(--font-heading)] leading-tight mb-6 animate-slide-up">
            <span className="text-pure-white">Biến tiểu thuyết</span>
            <br />
            <span className="gradient-text-hot">thành phim AI</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg lg:text-xl text-muted-silver max-w-2xl mx-auto mb-10 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Nền tảng AI Video Studio dành cho creators Việt Nam. Từ kịch bản →
            nhân vật → phân cảnh → lồng tiếng → video — tất cả bằng AI.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Link
              href="/signup"
              className="btn-secondary text-lg px-8 py-4 flex items-center gap-3 rounded-2xl"
              aria-label="Bắt đầu tạo video với VimiAI"
            >
              <Clapperboard className="w-5 h-5" />
              Tạo Video Ngay
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* === Feature Cards === */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <FeatureCard
              icon={<Wand2 className="w-6 h-6" />}
              title="Nano Banana 2"
              description="Tạo hình nhân vật & bối cảnh AI với chất lượng 4K, phong cách tùy chọn."
              color="cyan"
              delay="0.3s"
            />
            <FeatureCard
              icon={<Film className="w-6 h-6" />}
              title="Veo 3.1"
              description="Chuyển đổi hình ảnh thành video cinematic với âm thanh tự nhiên."
              color="pink"
              delay="0.4s"
            />
            <FeatureCard
              icon={<Mic2 className="w-6 h-6" />}
              title="Gemini TTS"
              description="Lồng tiếng AI đa ngôn ngữ, kiểm soát cảm xúc và giọng nói."
              color="violet"
              delay="0.5s"
            />
            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="Phân tích kịch bản"
              description="AI tự động chia tập, phân cảnh, nhận diện nhân vật và bối cảnh."
              color="cyan"
              delay="0.6s"
            />
            <FeatureCard
              icon={<Music className="w-6 h-6" />}
              title="Lyria Music"
              description="Tạo nhạc nền AI phù hợp với từng cảnh phim tự động."
              color="pink"
              delay="0.7s"
            />
            <FeatureCard
              icon={<Clapperboard className="w-6 h-6" />}
              title="7 Giai đoạn"
              description="Pipeline hoàn chỉnh từ tiểu thuyết đến video xuất bản."
              color="violet"
              delay="0.8s"
            />
          </div>
        </div>
      </section>

      {/* === Footer === */}
      <footer className="relative z-10 border-t border-muted-silver/10 px-6 lg:px-12 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-dim-gray">
            © 2026 VimiAI. Đón đầu xu hướng — Nâng tầm sáng tạo.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-sm text-muted-silver">
              🇻🇳 Made for Vietnamese Creators
            </span>
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
  color,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "cyan" | "pink" | "violet";
  delay: string;
}) {
  const colorMap = {
    cyan: {
      iconBg: "bg-neon-cyan/10",
      iconColor: "text-neon-cyan",
      glow: "neon-glow-cyan",
    },
    pink: {
      iconBg: "bg-electric-pink/10",
      iconColor: "text-electric-pink",
      glow: "neon-glow-pink",
    },
    violet: {
      iconBg: "bg-vivid-violet/10",
      iconColor: "text-vivid-violet",
      glow: "neon-glow-violet",
    },
  };

  const colors = colorMap[color];

  return (
    <div
      className="card-clay p-6 text-left animate-slide-up"
      style={{ animationDelay: delay }}
    >
      <div
        className={`w-12 h-12 rounded-xl ${colors.iconBg} ${colors.iconColor} flex items-center justify-center mb-4 ${colors.glow}`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-pure-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-silver leading-relaxed">{description}</p>
    </div>
  );
}
