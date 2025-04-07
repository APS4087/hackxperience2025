import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";
import Image from "next/image";

const companies = [
  {
    name: "DynamicWeb",
    gradientFrom: "from-[#0071CE]",
    gradientTo: "to-[#00AEEF]",
    logo: "/images/dynamicweb-logo.svg"
  },
  {
    name: "Kitchen Copilot",
    gradientFrom: "from-[#F56565]",
    gradientTo: "to-[#ED8936]",
    logo: "/images/kitchen-copilot-logo.png"
  }
];

export const ProblemStatementsSection = () => {
  const [isRevealed] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section
      ref={ref}
      id="problem-statements"
      className="relative py-16 sm:py-24 md:py-32 overflow-hidden bg-zinc-50 dark:bg-zinc-950"
    >
      {/* Simplified background effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px)', backgroundSize: '80px 80px' }}></div>
        </div>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-12 sm:mb-20"
        >
          <div className="mx-auto mb-12 sm:mb-20">
            <div className="relative inline-block">
              <span className="absolute -top-12 sm:-top-16 -left-3 text-[80px] sm:text-[120px] font-black text-zinc-100 dark:text-zinc-900 select-none hidden md:block opacity-50">
                CHALLENGES
              </span>
              
              <div className="relative z-10">
                <span className="text-xs sm:text-sm tracking-widest uppercase text-zinc-500 dark:text-zinc-400 block mb-2 font-medium">
                  {'// Innovation Awaits'}
                </span>
                <motion.h2 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight break-words sm:whitespace-nowrap px-4 sm:px-0"
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
                  Problem Statements
                </motion.h2>
              </div>
              
              <div className="absolute -bottom-8 left-0 h-1 w-32 bg-blue-600"></div>
            </div>
            
            <div className="max-w-md mt-8 sm:mt-12 mx-auto text-center px-4 sm:px-0">
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Prepare for groundbreaking challenges that will push your innovation boundaries and create real-world impact
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mt-8 sm:mt-12 relative">
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ x: index === 0 ? -50 : 50, opacity: 0 }}
              animate={inView ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.3 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${company.gradientFrom} ${company.gradientTo} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
              <div className="relative backdrop-blur-3xl rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 md:p-8 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 bg-white/50 dark:bg-black/50">
                {!isRevealed && (
                  <motion.div
                    initial={false}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 backdrop-blur-sm bg-white/80 dark:bg-black/80 flex items-center justify-center rounded-2xl"
                  >
                    <div className="text-center p-4 sm:p-8">
                      <motion.div
                        animate={{ 
                          rotateY: [0, 180, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="relative w-20 h-20 mx-auto mb-6"
                      >
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${company.gradientFrom} ${company.gradientTo} opacity-20`} />
                        <div className="absolute inset-[2px] rounded-lg bg-white dark:bg-black flex items-center justify-center">
                          <div className="relative w-12 h-12">
                            <Image
                              src={company.logo}
                              alt={`${company.name} logo`}
                              className="object-contain opacity-50"
                              width={48}
                              height={48}
                            />
                          </div>
                        </div>
                      </motion.div>
                      <h4 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-white mb-2">Problem Statement Coming Soon</h4>
                      <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">Stay tuned for the challenge reveal</p>
                    </div>
                  </motion.div>
                )}

                <div className="min-h-[280px] sm:min-h-[320px] flex flex-col justify-between">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-gradient-to-r ${company.gradientFrom} ${company.gradientTo}`} />
                        <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
                          {company.name}
                        </h3>
                      </div>
                      <div className={`h-1 w-20 bg-gradient-to-r ${company.gradientFrom} ${company.gradientTo} rounded-full`} />
                    </div>
                  </div>

                  <div className="mt-6 sm:mt-8">
                  </div>
                </div>

                {/* Decorative corner gradients */}
                <div className={`absolute top-0 left-0 w-32 h-32 bg-gradient-to-br ${company.gradientFrom}/10 to-transparent rounded-tl-2xl pointer-events-none`} />
                <div className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl ${company.gradientTo}/10 to-transparent rounded-br-2xl pointer-events-none`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Reduced and optimized floating orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              animate={{
                x: [0, (i % 2 ? 50 : -50)],
                y: [0, (i < 2 ? 50 : -50)],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              style={{
                left: `${25 + (i % 2) * 50}%`,
                top: `${25 + Math.floor(i / 2) * 50}%`,
              }}
            >
              <div 
                className="w-4 h-4 rounded-full bg-gradient-to-r from-primary to-red-500 opacity-10"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}; 