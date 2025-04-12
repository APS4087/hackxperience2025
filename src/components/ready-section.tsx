"use client";
import React from "react";
import { MorphingText } from "@/components/magicui/morphing-text";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <section id="ready" className="py-32 md:py-40 lg:py-48">
      <div className="flex flex-col items-center justify-center w-full mx-auto px-8 md:px-12">
        <div className="text-center">
          <h2 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-12 bg-gradient-to-r from-primary to-red-500 bg-clip-text text-transparent ">
            Are You Ready to{" "}
            <span className="text-primary">
              <MorphingText texts={texts} />
            </span>
          </h2>
          <div className="mt-20">
            <Button 
              asChild
              className="px-8 py-6 text-lg bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 transition-all duration-300"
              size="lg"
            >
              <Link href="/submit">Submit Your Project</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 