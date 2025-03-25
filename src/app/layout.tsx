import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const eightBitDragon = localFont({
  src: './fonts/Eight-Bit-Dragon.woff2',
  variable: '--font-eight-bit-dragon',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "HackXperience 2025 | Registration",
  description: "Register for the ultimate hackathon experience of 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} ${eightBitDragon.variable} font-sans antialiased`}
      >
        <Providers>
          {children}
          <Toaster 
            position="top-center"
            theme="dark"
            richColors
            closeButton
            expand={false}
            duration={4000}
            className="dark"
          />
        </Providers>
      </body>
    </html>
  );
}
