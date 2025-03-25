import { Suspense } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// Dynamically import the countdown component
const CountdownTimer = dynamic(() => import("./countdown-timer"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center gap-4 md:gap-8 mb-10">
      {[1, 2, 3].map((i) => (
        <div key={i} className="w-16 md:w-24 h-16 md:h-24 bg-card rounded-lg border border-border animate-pulse" />
      ))}
    </div>
  ),
});

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-32 md:py-40">
      {/* Background gradient effect - moved to a separate component */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-red-950/20 z-0" />
      
      {/* Animated shapes - moved to a separate component */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      
      <div className="container relative z-10 mx-auto px-4 text-center">
        {/* Main heading with priority loading */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-primary to-red-500 bg-clip-text text-transparent">HackXperience</span> 2025
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join the ultimate 48-hour innovation marathon. Build, learn, and connect with the brightest minds.
        </p>
        
        {/* Countdown timer with suspense boundary */}
        <Suspense fallback={
          <div className="flex justify-center gap-4 md:gap-8 mb-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-16 md:w-24 h-16 md:h-24 bg-card rounded-lg border border-border animate-pulse" />
            ))}
          </div>
        }>
          <CountdownTimer />
        </Suspense>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="#register"
            className={cn(
              "px-8 py-3 rounded-md text-lg font-medium",
              "bg-primary text-primary-foreground",
              "hover:bg-primary/90 transition-colors"
            )}
          >
            Register Now
          </Link>
          
          <Link
            href="#learn-more"
            className={cn(
              "px-8 py-3 rounded-md text-lg font-medium",
              "bg-secondary text-secondary-foreground",
              "hover:bg-secondary/90 transition-colors"
            )}
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
} 