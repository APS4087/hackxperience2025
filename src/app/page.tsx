"use client";

import { HeroSection } from "@/components/hero-section";
import { Footer } from "@/components/footer";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load sections that are not immediately visible
const AboutSection = dynamic(() => import("@/components/about-section").then(mod => mod.AboutSection), {
  loading: () => (
    <div className="w-full min-h-[600px] animate-pulse bg-muted/20 rounded-lg">
      <div className="container mx-auto px-4 py-16">
        <div className="h-8 w-48 bg-muted/40 rounded mb-8" />
        <div className="space-y-4">
          <div className="h-4 w-full bg-muted/40 rounded" />
          <div className="h-4 w-3/4 bg-muted/40 rounded" />
          <div className="h-4 w-1/2 bg-muted/40 rounded" />
        </div>
      </div>
    </div>
  ),
  ssr: false
});

const ScheduleSection = dynamic(() => import("@/components/schedule-section").then(mod => mod.ScheduleSection), {
  loading: () => (
    <div className="w-full min-h-[600px] animate-pulse bg-muted/20 rounded-lg">
      <div className="container mx-auto px-4 py-16">
        <div className="h-8 w-48 bg-muted/40 rounded mb-8" />
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted/40 rounded" />
          ))}
        </div>
      </div>
    </div>
  ),
  ssr: false
});

const FAQSection = dynamic(() => import("@/components/faq-section").then(mod => mod.FAQSection), {
  loading: () => (
    <div className="w-full min-h-[600px] animate-pulse bg-muted/20 rounded-lg">
      <div className="container mx-auto px-4 py-16">
        <div className="h-8 w-48 bg-muted/40 rounded mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted/40 rounded" />
          ))}
        </div>
      </div>
    </div>
  ),
  ssr: false
});

const RegisterSection = dynamic(() => import("@/components/register-section").then(mod => mod.RegisterSection), {
  loading: () => (
    <div className="w-full min-h-[600px] animate-pulse bg-muted/20 rounded-lg">
      <div className="container mx-auto px-4 py-16">
        <div className="h-8 w-48 bg-muted/40 rounded mb-8" />
        <div className="max-w-md mx-auto">
          <div className="h-12 bg-muted/40 rounded mb-4" />
          <div className="h-12 bg-muted/40 rounded mb-4" />
          <div className="h-12 bg-muted/40 rounded" />
        </div>
      </div>
    </div>
  ),
  ssr: false
});

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <main className="flex-1 relative">
        <HeroSection />
        <Suspense fallback={<div className="w-full min-h-[600px] animate-pulse bg-muted/20 rounded-lg" />}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={<div className="w-full min-h-[600px] animate-pulse bg-muted/20 rounded-lg" />}>
          <RegisterSection />
        </Suspense>
        <Suspense fallback={<div className="w-full min-h-[600px] animate-pulse bg-muted/20 rounded-lg" />}>
          <ScheduleSection />
        </Suspense>
        <Suspense fallback={<div className="w-full min-h-[600px] animate-pulse bg-muted/20 rounded-lg" />}>
          <FAQSection />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
}
