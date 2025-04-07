"use client";

import React, { useEffect, useState, useRef } from 'react';
import { RegisterForm } from './register-form';
import { SplineScene } from './spline-scene';

export function RegisterSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="register" className="py-12 sm:py-16 md:py-20 bg-background/5">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 md:gap-8 items-center">
          {/* 3D Element Container Side - Hidden on Mobile */}
          {!isMobile && isClient && (
            <div className="md:col-span-7">
              <div className="w-full h-[600px] md:h-[800px] rounded-lg shadow-lg bg-background/5 relative overflow-hidden">
                <div className="absolute inset-0 w-full h-full">
                  {isInView && <SplineScene />}
                </div>
              </div>
            </div>
          )}

          {/* Registration Form Side - Full Width on Mobile */}
          <div className={`${isMobile ? 'w-full' : 'md:col-span-5 w-full'} max-w-xl mx-auto md:max-w-none`}>
            <RegisterForm />
          </div>
        </div>
      </div>
    </section>
  );
} 