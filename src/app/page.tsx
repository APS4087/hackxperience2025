"use client";

import { HeroSection } from "@/components/hero-section";
import { Footer } from "@/components/footer";
import { AboutSection } from "@/components/about-section";
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { Preloader } from "@/components/preloader";

// Custom loading components with reduced animation when reduced motion is preferred
function LoadingSection({ className = "" }: { className?: string }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className={`w-full min-h-[600px] ${prefersReducedMotion ? 'bg-muted/20' : 'animate-pulse bg-muted/20'} rounded-lg ${className}`}>
      <div className="container mx-auto px-4 py-16">
        <div className={`h-8 w-48 bg-muted/40 rounded mb-8 ${!prefersReducedMotion && 'animate-pulse'}`} />
        <div className="space-y-4">
          <div className={`h-4 w-full bg-muted/40 rounded ${!prefersReducedMotion && 'animate-pulse'}`} />
          <div className={`h-4 w-3/4 bg-muted/40 rounded ${!prefersReducedMotion && 'animate-pulse'}`} />
          <div className={`h-4 w-1/2 bg-muted/40 rounded ${!prefersReducedMotion && 'animate-pulse'}`} />
        </div>
      </div>
    </div>
  );
}

// Lazy load sections with custom loading states and smaller chunks
const PartnersSection = dynamic(() => import("@/components/partners-section").then(mod => mod.PartnersSection), {
  loading: () => <LoadingSection />,
  ssr: false
});

// Group similar sections together for better code splitting
const PrizesSection = dynamic(() => import("@/components/prizes-section").then(mod => mod.PrizesSection), {
  loading: () => <LoadingSection />,
  ssr: false
});

const ProblemStatementsSection = dynamic(() => import("@/components/problem-statements-section").then(mod => mod.ProblemStatementsSection), {
  loading: () => <LoadingSection />,
  ssr: false
});

const ScheduleSection = dynamic(() => import("@/components/schedule-section").then(mod => mod.ScheduleSection), {
  loading: () => <LoadingSection />,
  ssr: false
});

// Keep FAQ and Register as separate bundles to be loaded on-demand
const FAQSection = dynamic(() => import("@/components/faq-section").then(mod => mod.FAQSection), {
  loading: () => <LoadingSection />,
  ssr: false
});

const RegisterSection = dynamic(() => import("@/components/register-section").then(mod => mod.RegisterSection), {
  loading: () => <LoadingSection />,
  ssr: false
});

const ReadySection = dynamic(() => import("@/components/ready-section").then(mod => mod.ReadySection), {
  loading: () => <LoadingSection />,
  ssr: false
});

export default function Home() {
  // Initialize smooth scrolling
  useSmoothScroll();
  
  return (
    <>
      <Preloader />
      <div className="min-h-screen flex flex-col overflow-x-hidden">
        <main className="flex-1 relative">
          {/* Critical sections loaded immediately */}
          <HeroSection />
          <AboutSection />
          
          {/* Lazy loaded sections */}
          <Suspense fallback={<LoadingSection />}>
            <PartnersSection />
          </Suspense>
          
          {/* Prizes and Schedule sections */}
          <Suspense fallback={<LoadingSection />}>
            <PrizesSection />
          </Suspense>
          <Suspense fallback={<LoadingSection />}>
            <ProblemStatementsSection />
          </Suspense>
          <Suspense fallback={<LoadingSection />}>
            <ScheduleSection />
          </Suspense>
          
          {/* Lower-priority sections loaded later */}
          <Suspense fallback={<LoadingSection />}>
            <ReadySection />
          </Suspense>
          <Suspense fallback={<LoadingSection />}>
            <RegisterSection />
          </Suspense>
          <Suspense fallback={<LoadingSection />}>
            <FAQSection />
          </Suspense>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
