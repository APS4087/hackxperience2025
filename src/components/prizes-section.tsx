"use client";

import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { useEffect, useState } from "react";

export const PrizesSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center min-h-[400px] md:min-h-[600px] text-center">
          <div className="w-full h-[300px] md:h-[300px]">
            <TextHoverEffect 
              text="COMING SOON" 
              automatic={isMobile}
              duration={isMobile ? 0.2 : 0}
            />
          </div>
          <p className="mt-8 text-muted-foreground text-base md:text-lg">
            Stay tuned for exciting prize announcements
          </p>
        </div>
      </div>
    </section>
  );
} 