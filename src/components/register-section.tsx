import React from 'react';
import { RegisterForm } from './register-form';

export function RegisterSection() {
  return (
    <section id="register" className="py-20 bg-secondary/10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">Register Now</h2>
        <RegisterForm />
      </div>
    </section>
  );
} 