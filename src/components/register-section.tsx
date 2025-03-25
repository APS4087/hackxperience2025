import React from 'react';
import { RegisterForm } from './register-form';
import { SplineScene } from './spline-scene';

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