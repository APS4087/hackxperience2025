"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, useAnimationControls } from "framer-motion";

export const PrizesSection = () => {
  const [isWindows, setIsWindows] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const titleControls = useAnimationControls();

  useEffect(() => {
    // Check if user is on Windows
    const checkWindows = () => {
      const userAgent = window.navigator.userAgent;
      setIsWindows(userAgent.indexOf("Windows") !== -1);
    };
    
    checkWindows();
  }, []);

  // Start the animation once the component is in view
  useEffect(() => {
    if (isInView) {
      titleControls.start({
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        transition: {
          duration: 8,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop"
        }
      });
    }
  }, [isInView, titleControls]);

  const prizes = [
    {
      id: "dynamic-web",
      title: "Dynamic Web",
      category: "Challenge Winner",
      description: "Awarded for the most innovative dynamic web solution.",
      icon: "🌐",
      hasVoucher: true,
      voucherColor: "from-indigo-500 via-blue-600 to-violet-600",
      voucherAccent: "#4f46e5",
      monetary: true,
      amount: 250,
    },
    {
      id: "kitchen-copilot",
      title: "Kitchen Copilot",
      category: "Challenge Winner",
      description: "Awarded for the most revolutionary kitchen assistant solution.",
      icon: "🍳",
      hasVoucher: true,
      voucherColor: "from-amber-500 via-orange-600 to-red-600",
      voucherAccent: "#f59e0b",
      monetary: true,
      amount: 250,
    },
    {
      id: "crowd-favorite",
      title: "Crowd Favorite",
      category: "Community Choice",
      description: "Voted as the most popular project by event attendees.",
      icon: "👑",
      hasVoucher: true,
      voucherColor: "from-emerald-500 via-teal-600 to-green-600",
      voucherAccent: "#10b981",
      monetary: true,
      amount: 75,
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { 
      opacity: 1, 
      x: 0,
      transition: { 
        ease: [0.25, 0.1, 0.25, 1],
        duration: 0.6,
      }
    },
  };

  return (
    <section ref={ref} className="py-32 md:py-40 bg-background relative">
      {/* Top divider */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-muted to-transparent" />
      
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center"
          >
            {/* Custom animated title with smooth looping gradient */}
            <div className="scale-[1.2] sm:scale-[1.5] md:scale-[1.8] transform-gpu mb-4 transition-all duration-300">
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
                animate={titleControls}
              >
                RECOGNITION
              </motion.h2>
            </div>
            <p className="mt-12 text-muted-foreground text-lg max-w-md mx-auto">
              Excellence deserves to be celebrated. These awards await the most innovative teams.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className={`grid grid-cols-1 lg:grid-cols-3 gap-x-16 gap-y-24 ${isWindows ? 'max-w-7xl' : 'max-w-6xl'} mx-auto`}
        >
          {prizes.map((prize, index) => (
            <motion.div
              key={prize.id}
              variants={item}
              className={`relative ${isWindows ? 'transform scale-105' : ''}`}
            >
              <div className="flex flex-col">
                {/* Number */}
                <div className="mb-8">
                  <span className="text-8xl font-light text-muted-foreground opacity-20">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="mb-6">
                    <div className="text-sm uppercase tracking-wider text-muted-foreground">
                      {prize.category}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <h3 className={`${isWindows ? 'text-4xl' : 'text-3xl'} font-bold`}>{prize.title}</h3>
                      <span className="text-3xl">{prize.icon}</span>
                    </div>
                  </div>
                  
                  <div className="h-px w-16 bg-primary mb-6 opacity-50" />
                  
                  <p className={`text-muted-foreground ${isWindows ? 'text-lg' : 'text-base'} max-w-sm`}>
                    {prize.description}
                  </p>
                  
                  {/* Voucher */}
                  {prize.hasVoucher && (
                    <motion.div 
                      className={`mt-8 relative rounded-lg overflow-hidden ${isWindows ? 'h-40 max-w-md' : 'h-36 max-w-sm'} w-full`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ 
                        delay: 0.4 + (index * 0.1),
                        duration: 0.6,
                      }}
                    >
                      {/* Voucher background */}
                      <div 
                        className={`absolute inset-0 bg-gradient-to-r ${prize.voucherColor} opacity-90`}
                      />
                      
                      {/* Pattern overlay */}
                      <div className="absolute inset-0 opacity-10" style={{ 
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23ffffff' fill-opacity='0.4'/%3E%3C/svg%3E")`,
                        backgroundSize: "24px 24px"
                      }} />

                      {/* Glare effect with smoother animation */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0"
                        initial={{ x: "-100%" }}
                        animate={{ 
                          x: ["-100%", "100%"], 
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 3,
                          ease: "easeInOut",
                          repeatType: "loop",
                        }}
                      />
                      
                      {/* Voucher content */}
                      <div className="relative z-10 h-full flex flex-col justify-between p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-xs text-white/70 font-mono tracking-wide uppercase">Prize Voucher</div>
                            <div className={`${isWindows ? 'text-3xl' : 'text-2xl'} text-white font-bold mt-1`}>
                              {typeof prize.amount === 'number' ? `$${prize.amount}` : prize.amount}
                            </div>
                          </div>
                          <div className="font-mono text-white text-xs border border-white/30 px-2 py-1 rounded-sm">
                            2025
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-1.5 mt-auto">
                          <div className="flex justify-between items-center">
                            <div className={`${isWindows ? 'text-sm' : 'text-xs'} text-white/70 font-mono`}>{prize.title.toUpperCase()}</div>
                            
                            {/* QR code mockup */}
                            <div className={`${isWindows ? 'w-12 h-12' : 'w-10 h-10'} bg-white/90 rounded-sm overflow-hidden flex items-center justify-center p-1`}>
                              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Position squares */}
                                <rect x="3" y="3" width="6" height="6" fill="black" />
                                <rect x="3" y="23" width="6" height="6" fill="black" />
                                <rect x="23" y="3" width="6" height="6" fill="black" />
                                
                                {/* Position square borders */}
                                <rect x="5" y="5" width="2" height="2" fill="white" />
                                <rect x="5" y="25" width="2" height="2" fill="white" />
                                <rect x="25" y="5" width="2" height="2" fill="white" />
                                
                                {/* QR data pattern */}
                                <rect x="12" y="3" width="2" height="2" fill="black" />
                                <rect x="16" y="3" width="2" height="2" fill="black" />
                                <rect x="18" y="7" width="2" height="2" fill="black" />
                                <rect x="3" y="12" width="2" height="2" fill="black" />
                                <rect x="7" y="14" width="2" height="2" fill="black" />
                                <rect x="11" y="12" width="4" height="4" fill="black" />
                                <rect x="17" y="14" width="2" height="2" fill="black" />
                                <rect x="21" y="12" width="2" height="2" fill="black" />
                                <rect x="25" y="14" width="2" height="2" fill="black" />
                                <rect x="21" y="15" width="3" height="3" fill="black" />
                                <rect x="14" y="17" width="2" height="2" fill="black" />
                                <rect x="10" y="19" width="2" height="2" fill="black" />
                                <rect x="18" y="19" width="2" height="2" fill="black" />
                                <rect x="22" y="19" width="2" height="2" fill="black" />
                                <rect x="26" y="19" width="2" height="2" fill="black" />
                                <rect x="14" y="22" width="2" height="2" fill="black" />
                                <rect x="18" y="23" width="2" height="2" fill="black" />
                                <rect x="26" y="23" width="2" height="2" fill="black" />
                                <rect x="14" y="26" width="2" height="2" fill="black" />
                                <rect x="18" y="27" width="2" height="2" fill="black" />
                                <rect x="23" y="27" width="3" height="2" fill="black" />
                              </svg>
                            </div>
                          </div>
                          
                          <div className="h-0.5 w-full bg-white/20 rounded-full" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
              
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ 
                  delay: 0.3 + (index * 0.1), 
                  duration: 0.6,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                style={{ originX: 0 }}
                className="absolute -bottom-10 left-0 right-0 h-px bg-muted"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Bottom signature */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="mt-32 text-center"
      >
        <span className="inline-block px-4 py-2 text-sm text-muted-foreground tracking-wider">
          HACKXPERIENCE 2025
        </span>
      </motion.div>
      
      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-muted to-transparent" />
    </section>
  );
} 