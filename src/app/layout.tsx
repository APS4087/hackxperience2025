import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import { Providers } from "./providers";
import { ToasterProvider } from "@/components/toaster-provider";

// Configure fonts with display swap and preload for critical fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Only preload critical fonts
});

const eightBitDragon = localFont({
  src: './fonts/Eight-Bit-Dragon.woff2',
  variable: '--font-eight-bit-dragon',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "HackXperience 2025 | Registration",
  description: "Register for the ultimate hackathon experience of 2025",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="lenis" suppressHydrationWarning>
      <head>
        {/* Add high priority resource hints */}
        <link rel="preload" href="/img/hero.jpg" as="image" fetchPriority="high" />
      </head>
      <body
        className={`${inter.variable} ${geistMono.variable} ${eightBitDragon.variable} font-sans antialiased min-h-screen overflow-x-hidden`}
      >
        <Providers>
          {children}
          <ToasterProvider />
        </Providers>
      </body>
    </html>
  );
}
