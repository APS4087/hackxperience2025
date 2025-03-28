import React, { useEffect, useState } from 'react';
import { RegisterForm } from './register-form';
import dynamic from 'next/dynamic';

// Dynamically import SplineScene with no SSR
const SplineScene = dynamic(() => import('./spline-scene').then(mod => mod.SplineScene), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-red-500/10 rounded-lg">
      <div className="animate-pulse text-foreground/50">Loading 3D Scene...</div>
    </div>
  ),
});

export function RegisterSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section id="register" className="py-12 sm:py-16 md:py-20 bg-background/5">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 md:gap-8 items-center">
          {/* 3D Element Container Side - Hidden on Mobile */}
          {!isMobile && isClient && (
            <div className="md:col-span-7">
              <div className="w-full h-[600px] md:h-[800px] rounded-lg shadow-lg bg-background/5 relative overflow-hidden">
                <div className="absolute inset-0 w-full h-full">
                  <SplineScene />
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