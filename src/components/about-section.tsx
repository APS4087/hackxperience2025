import React from 'react';

const highlights = [
  "$50,000 in prizes and scholarships",
  "Mentorship from industry experts",
  "Workshops and technical sessions",
  "Networking opportunities with top companies",
  "Free food and swag for all participants",
  "Post-event job and internship opportunities"
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">About HackXperience 2025</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg mb-6">
              HackXperience is the premier hackathon event bringing together talented developers,
              designers, and innovators from around the world.
            </p>
            <p className="text-lg mb-6">
              Over the course of 48 hours, participants will collaborate in teams to build
              groundbreaking projects that tackle real-world challenges.
            </p>
            <p className="text-lg mb-6">
              Whether you&apos;re a seasoned developer or just starting your coding journey,
              HackXperience welcomes all skill levels and backgrounds.
            </p>
          </div>
          
          <div className="bg-card rounded-xl p-6 shadow-lg border border-border/40">
            <h3 className="text-xl font-semibold mb-4">Event Highlights</h3>
            <ul className="space-y-3">
              {highlights.map((highlight, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-primary">✓</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
} 