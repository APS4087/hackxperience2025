import React from 'react';
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
  return (
    <section id="register" className="py-20 bg-background/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* 3D Element Container Side */}
          <div className="md:col-span-8 w-full h-[800px] rounded-lg shadow-lg overflow-hidden bg-background/5">
            <SplineScene />
          </div>

          {/* Registration Form Side */}
          <div className="md:col-span-4 w-full">
            <RegisterForm />
          </div>
        </div>
      </div>
    </section>
  );
} 