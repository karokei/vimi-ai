import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${outfit.variable} ${plusJakarta.variable}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
