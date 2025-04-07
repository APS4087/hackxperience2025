"use client";

import React, { useState, useRef, useEffect, ReactNode } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

// Custom marquee component for continuous text animation
const Marquee = ({ children, direction = "left", speed = 25, className = "" }: { 
  children: ReactNode;
  direction?: "left" | "right";
  speed?: number;
  className?: string;
}) => {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div 
        className="inline-block marquee-content"
        style={{
          animation: `marquee ${speed}s linear infinite ${direction === "right" ? "reverse" : "normal"}`
        }}
      >
        <span className="inline-block mr-4">{children}</span>
        <span className="inline-block mr-4">{children}</span>
        <span className="inline-block mr-4">{children}</span>
        <span className="inline-block mr-4">{children}</span>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .marquee-content {
          min-width: 100%;
        }
      `}</style>
    </div>
  );
};

const PartnerCard = ({
  title,
  description,
  logo,
  heroImage,
  tagline,
  colors,
  website,
  index,
}: {
  title: string;
  description: string;
  logo: string;
  heroImage: string;
  tagline: string;
  colors: number[][];
  website: string;
  index: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Generate dynamic CSS variables from colors
  const primaryColor = `rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})`;
  const secondaryColor = `rgb(${colors[1][0]}, ${colors[1][1]}, ${colors[1][2]})`;
  
  // Optimize mouse move handler with debounce/throttle effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !isHovered) return; // Only track mouse when hovered
    
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };
  
  // Determine if card should be positioned differently based on index
  const isOffset = index % 2 === 1;
  
  // Variants for staggered animations - simplified for performance
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20, // Reduced movement distance
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5, // Shorter duration
        ease: "easeOut", 
        delay: index * 0.1,
      }
    }
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={`partner-card relative ${isOffset ? 'mt-12 md:mt-24' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Reduced decorative elements for performance */}
      <div className="absolute -top-10 -right-6 w-20 h-20 opacity-20 hidden md:block">
        <svg className="animate-spin-slow" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" stroke={primaryColor} strokeWidth="2" />
          <line x1="5" y1="50" x2="95" y2="50" stroke={primaryColor} strokeWidth="2" />
          <line x1="50" y1="5" x2="50" y2="95" stroke={primaryColor} strokeWidth="2" />
        </svg>
      </div>
      
      {/* Main card content */}
      <div className="card-content group bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 overflow-hidden relative">
        {/* Mousemove spotlight effect - only rendered when hovered for performance */}
        {isHovered && (
          <div 
            className="absolute w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none z-10 transition-opacity duration-200"
            style={{ 
              background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
              left: mousePosition.x - 150,
              top: mousePosition.y - 150,
            }}
          />
        )}
        
        {/* Top section */}
        <div className="flex flex-col md:flex-row h-auto">
          {/* Logo section with creative clipping */}
          <div className="w-full md:w-[45%] relative overflow-hidden h-60">
            <div 
              className="absolute inset-0 clip-diagonal z-0" 
              style={{ 
                clipPath: "polygon(0 0, 100% 0%, 85% 100%, 0% 100%)",
              }}
            >
              <Image 
                src={heroImage} 
                alt={title} 
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                priority={index < 2} // Only prioritize first few images
                className="object-cover"
              />
              <div 
                className="absolute inset-0"
                style={{ backgroundColor: `rgba(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]}, 0.4)` }}  
              />
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className={`relative w-24 h-24 rounded-full p-2 ${title === "Kitchen Copilot" || title === "DynamicWeb" ? "bg-white dark:bg-white" : "bg-white dark:bg-black"}`}>
                <Image 
                  src={logo} 
                  alt={`${title} logo`}
                  fill
                  sizes="96px"
                  className="object-contain p-3"
                />
              </div>
            </div>
            
            <div className="absolute bottom-0 w-full h-12 flex items-center overflow-hidden bg-gradient-to-b from-transparent to-black/30 z-10">
              <Marquee direction={index % 2 === 0 ? "left" : "right"} speed={80} className="text-white text-sm font-medium uppercase tracking-wider">
                {tagline} ● {tagline} ● {tagline} ● {tagline} ● {tagline} ●
              </Marquee>
            </div>
          </div>
          
          {/* Title & description section */}
          <div className="w-full md:w-[55%] p-8 flex flex-col h-auto">
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white leading-tight mb-2">
                {title}
              </h3>
              
              {/* Animated underline - simplified for performance */}
              <div className="mt-2 mb-4 relative">
                <div className="h-1 w-12 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                <div 
                  className="h-1 absolute top-0 left-0 rounded-full transition-all duration-500 ease-out origin-left scale-x-0 group-hover:scale-x-100" 
                  style={{ backgroundColor: secondaryColor, width: '80px' }}
                ></div>
              </div>
              
              <div className="prose prose-sm dark:prose-invert mt-4 h-auto md:h-[80px] overflow-visible md:overflow-y-auto pr-2">
                <p className="text-zinc-700 dark:text-zinc-300 text-sm">
                  {description}
                </p>
              </div>
            </div>
            
            {/* Button with creative hover effect */}
            <a 
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="visit-button mt-6 relative overflow-hidden group/button inline-block"
            >
              <span className="sr-only">Visit {title} website</span>
              
              <div className="flex items-center gap-4 p-4 border border-zinc-200 dark:border-zinc-800 group-hover/button:border-transparent transition-all duration-300">
                <span className="text-sm uppercase tracking-wider font-semibold text-zinc-900 dark:text-white">
                  Explore
                </span>
                <div className="relative">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.33334 12.6667L12.6667 3.33334M12.6667 3.33334V12.6667M12.6667 3.33334H3.33334" 
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                      className="transition-transform duration-300 group-hover/button:translate-x-1 group-hover/button:-translate-y-1"
                    />
                  </svg>
                </div>
              </div>
              
              {/* Background animation */}
              <div 
                className="absolute inset-0 -z-10 scale-x-0 group-hover/button:scale-x-100 transition-transform duration-300 origin-left"
                style={{ backgroundColor: primaryColor }}
              ></div>
            </a>
          </div>
        </div>
      </div>
      
      {/* Custom animation for spinning SVG */}
      <style jsx global>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </motion.div>
  );
};

export function PartnersSection() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  
  // Update mouse position for background effect with throttling
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current || !hasScrolled) return;
    
    // Only update mouse position every other event for performance
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };
  
  // Scroll-based animations - simplified for performance
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // This ensures we don't apply the expensive background effect until the user has scrolled
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(v => {
      if (v > 0.1 && !hasScrolled) {
        setHasScrolled(true);
      }
    });
    
    return () => unsubscribe();
  }, [scrollYProgress, hasScrolled]);
  
  // Create string value for opacity to solve the type issue
  const bgOpacityStyle = useTransform(
    scrollYProgress, 
    [0, 0.2, 0.8, 1], 
    ["0", "0.5", "0.5", "0"]
  );
  
  const partners = [
    {
      title: "DynamicWeb",
      tagline: "Composable eCommerce Suite for B2B and B2C",
      description: "Dynamicweb offers a comprehensive, fully-customizable platform that simplifies eCommerce for B2B and B2C businesses. With all-in-one capabilities including CMS, PIM, and Marketing in a single interface, their flexible solution integrates seamlessly with leading ERPs like Microsoft Dynamics 365.",
      logo: "/images/dynamicweb-logo.svg",
      heroImage: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      colors: [
        [0, 113, 206], // Blue
        [0, 174, 239], // Light Blue
      ],
      website: "https://www.dynamicweb.com",
    },
    {
      title: "Kitchen Copilot",
      tagline: "Smart meal planning made simple",
      description: "Kitchen Copilot is an innovative meal planning app that helps home cooks simplify mealtime with smart planning, easy cooking, and meaningful connections. Features include personalized scheduling, intelligent meal planning, and a dynamic recipe library to inspire your cooking journey.",
      logo: "/images/kitchen-copilot-logo.png",
      heroImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop",
      colors: [
        [245, 101, 101], // Redc
        [237, 137, 54], // Orange
      ],
      website: "https://kitchencopilot.com",
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-32 relative overflow-hidden bg-zinc-50 dark:bg-zinc-950"
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic background gradient - only rendered after scrolling for performance */}
      {hasScrolled && (
        <motion.div 
          className="absolute inset-0 -z-10 pointer-events-none opacity-0"
          style={{ 
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, #3c31fa10 0%, transparent 60%)`,
            opacity: bgOpacityStyle
          }} 
        />
      )}
      
      {/* Static grid background instead of animated one */}
      <div className="absolute inset-0 -z-20 opacity-[0.03] dark:opacity-[0.08]">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Stylized section heading - simplified */}
        <div className="ml-4 md:ml-12 mb-20">
          <div className="relative inline-block">
            {/* Simplified background text */}
            <span className="absolute -top-16 -left-3 text-[120px] font-black text-zinc-100 dark:text-zinc-900 select-none hidden md:block opacity-50">
              ALLIES
            </span>
            
            <div className="relative z-10">
              <span className="text-sm tracking-widest uppercase text-zinc-500 dark:text-zinc-400 block mb-2 font-medium">
                {'// Collaborators'}
              </span>
              <motion.h2 
                className="text-4xl sm:text-5xl md:text-6xl font-bold whitespace-nowrap tracking-tight"
                style={{ 
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundSize: "300% 100%",
                  backgroundImage: "linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 25%, #ef4444 50%, #e2e8f0 75%, #f1f5f9 100%)",
                  filter: "drop-shadow(0 0 20px rgba(226,232,240,0.2))"
                }}
                animate={{
                  backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                Our Partners
              </motion.h2>
            </div>
            
            {/* Decorative line */}
            <div className="absolute -bottom-8 left-0 h-1 w-32 bg-blue-600"></div>
          </div>
          
          <div className="max-w-md mt-12">
            <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
              Collaborating with industry leaders to drive innovation 
              and create exceptional experiences that shape the future
            </p>
          </div>
        </div>
        
        {/* Simplified layout structure */}
        <div className="mt-24 relative">
          {/* Reduced decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 border-r-2 border-t-2 border-zinc-300 dark:border-zinc-700 -z-10 opacity-50"></div>
          
          {/* Cards - vertical layout for better performance */}
          <div className="grid grid-cols-1 gap-16">
            {partners.map((partner, index) => (
              <PartnerCard key={partner.title} {...partner} index={index} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Simplified custom styles */}
      <style jsx global>{`
        .clip-diagonal {
          clip-path: polygon(0 0, 100% 0%, 85% 100%, 0% 100%);
        }
      `}</style>
    </section>
  );
} 