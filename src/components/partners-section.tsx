"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CanvasRevealEffect } from "./ui/canvas-reveal-effect";

const Icon = ({ className, ...rest }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};

const PartnerCard = ({
  title,
  colors,
}: {
  title: string;
  colors: number[][];
}) => {
  const [isRevealed, setIsRevealed] = React.useState(false);

  const getTeaserText = (title: string) => {
    if (title === "Partner Company A") {
      return "A multinational company revolutionizing digital solutions";
    }
    if (title === "Partner Company B") {
      return "An evolving startup transforming everyday experiences";
    }
    return "More details coming soon";
  };

  // Handle both mouse and touch events
  const handleInteractionStart = () => setIsRevealed(true);
  const handleInteractionEnd = () => setIsRevealed(false);

  return (
    <div
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      className="border border-black/[0.2] group/canvas-card flex items-center justify-center dark:border-white/[0.2] max-w-sm w-full mx-auto p-4 relative h-[30rem] cursor-pointer select-none touch-manipulation"
    >
      <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full absolute inset-0"
          >
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-black"
              colors={colors}
              dotSize={2}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white z-10">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="text-xl text-center font-medium"
              >
                {getTeaserText(title)}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20">
        <motion.div
          animate={{
            y: isRevealed ? -16 : 0,
            opacity: isRevealed ? 0 : 1
          }}
          transition={{ duration: 0.2 }}
          className="text-center w-full mx-auto flex flex-col items-center justify-center gap-2"
        >
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground md:hidden">Tap to teaser</p>
          <p className="text-sm text-muted-foreground hidden md:block">Hover to teaser</p>
        </motion.div>
      </div>
    </div>
  );
};

export function PartnersSection() {
  const partners = [
    {
      title: "Partner Company A",
      colors: [
        [236, 72, 153], // Pink
        [232, 121, 249], // Purple
      ],
    },
    {
      title: "Partner Company B",
      colors: [
        [34, 197, 94], // Green
        [16, 185, 129], // Emerald
      ],
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Our Partners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {partners.map((partner) => (
            <PartnerCard key={partner.title} {...partner} />
          ))}
        </div>
      </div>
    </section>
  );
} 