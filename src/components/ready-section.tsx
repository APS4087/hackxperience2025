"use client";
import React from "react";
import { MorphingText } from "@/components/magicui/morphing-text";

const texts = [
  "Code",
  "Design",
  "Create",
  "Innovate",
  "Build",
  "Develop",
  "Transform",
  "Explore",
  "Learn",
  "Grow",
];

export function ReadySection() {
  return (
    <section id="ready" className="py-24 md:py-32">
      <div className="flex flex-col items-center justify-center w-full mx-auto px-8">
        <div className="text-center">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-primary to-red-500 bg-clip-text text-transparent ">
            Are You Ready to{" "}
            <span className="text-primary">
              <MorphingText texts={texts} />
            </span>
          </h2>
        </div>
      </div>
    </section>
  );
} 