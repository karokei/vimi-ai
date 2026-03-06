import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "VimiAI — AI Video Studio | Tạo phim AI chuyên nghiệp",
  description:
    "Nền tảng AI Video Studio đầu tiên cho creators Việt Nam. Biến tiểu thuyết thành video cinematic với Gemini AI, Veo 3.1, và Nano Banana 2.",
  keywords: [
    "AI video",
    "tạo phim AI",
    "video production",
    "VimiAI",
    "Gemini AI",
    "Vietnamese creators",
  ],
  openGraph: {
    title: "VimiAI — AI Video Studio",
    description:
      "Biến tiểu thuyết thành video cinematic với AI. Dành cho creators Việt Nam.",
    type: "website",
    url: "https://vimi-ai.vercel.app",
    siteName: "VimiAI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VimiAI - AI Video Studio Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VimiAI — AI Video Studio",
    description: "Biến tiểu thuyết thành video cinematic với Gemini AI.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
