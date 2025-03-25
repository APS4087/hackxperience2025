"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  
  // Hackathon date - example: May 15, 2025
  const hackathonDate = new Date("2025-05-15T00:00:00");
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = hackathonDate.getTime() - now.getTime();
      
      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      setDays(d);
      setHours(h);
      setMinutes(m);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <section className="relative overflow-hidden py-32 md:py-40">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-purple-950/20 z-0" />
      
      {/* Animated shapes in background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      
      <div className="container relative z-10 mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">HackXperience</span> 2025
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join the ultimate 48-hour innovation marathon. Build, learn, and connect with the brightest minds.
        </p>
        
        {/* Countdown timer */}
        <div className="flex justify-center gap-4 md:gap-8 mb-10">
          <CountdownItem value={days} label="Days" />
          <CountdownItem value={hours} label="Hours" />
          <CountdownItem value={minutes} label="Minutes" />
        </div>
        
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

function CountdownItem({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 md:w-24 h-16 md:h-24 bg-card rounded-lg border border-border flex items-center justify-center">
        <span className="text-2xl md:text-4xl font-bold">{value}</span>
      </div>
      <span className="text-sm md:text-base text-muted-foreground mt-2">{label}</span>
    </div>
  );
} 