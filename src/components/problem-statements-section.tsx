import { motion, useAnimationControls } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const companies = [
  {
    name: "DynamicWeb",
    title: "SmartGifter - Reinventing the Art of Gift-Giving",
    gradientFrom: "from-[#0071CE]",
    gradientTo: "to-[#00AEEF]",
    logo: "/images/dynamicweb-logo.svg",
    description: "Gift-giving should be joyful, but it's often filled with friction. Finding the perfect item, coordinating to avoid duplicate presents, remembering important dates, and the waste from unwanted gifts are common frustrations.",
    challenge: "We invite you to tackle these frustrations head-on. Conceptualize and build a key technological solution that improves the gifting process. How can we create a modern, helpful, and efficient experience – accessible via web and mobile – for individuals, families, or even companies?",
    areas: [
      "Making gift wishlists truly effortless to create, share, and manage.",
      "Solving the coordination nightmare for group gifts.",
      "Using smart technology (like AI) to help discover perfect gifts or find deals.",
      "Connecting the gifting process more smoothly with online retailers or other services.",
      "Designing systems that reduce waste and ensure gifts are genuinely wanted."
    ],
    deliverable: "Develop a working prototype showcasing your innovative solution to a specific aspect of this challenge. Focus on demonstrating a creative approach that offers clear value to users involved in the gifting process (givers or receivers).",
    difficulty: "Hard",
    experience: 250,
    skills: ["Coding", "Design", "Problem Solving"],
    rewardIcon: "🎁",
    questType: "Technology Quest",
    bonus: "Gift Optimization"
  },
  {
    name: "Kitchen Copilot",
    title: "Gamify Healthy Cooking with Kitchen Copilot",
    gradientFrom: "from-[#F56565]",
    gradientTo: "to-[#ED8936]",
    logo: "/images/kitchen-copilot-logo.png",
    description: "Sticking to healthy eating goals and consistently using cooking apps can be challenging. Kitchen Copilot helps with recipes, but lacks elements that make the journey truly engaging, motivating, and socially connected over the long term. Users might lack incentives to explore new healthy recipes, share their progress, or interact with others.",
    challenge: "We invite you to inject fun and motivation into healthy cooking! Conceptualize and build a key gamification system for Kitchen Copilot. How can game mechanics transform the app into an engaging experience that encourages users to cook healthily, interact with the community, and build lasting habits?",
    areas: [
      "Designing point systems, badges, or rewards for achieving cooking goals, trying healthy recipes, or completing meal plans.",
      "Creating leaderboards or friendly competitions related to cooking frequency, recipe variety, or healthy milestones.",
      "Developing team-based challenges or collaborative cooking quests within the community.",
      "Integrating social mechanics where users can cheer each other on, share achievements, or unlock rewards together.",
      "Using game elements to encourage exploration of new features, cuisines, or healthy ingredients within the app."
    ],
    deliverable: "Develop a working prototype showcasing your innovative gamification strategy for Kitchen Copilot. Focus on demonstrating how your game mechanics effectively motivate users, foster community interaction around healthy cooking, and make the app more engaging and \"sticky.\"",
    difficulty: "Medium",
    experience: 200,
    skills: ["Coding", "Design", "Problem Solving"],
    rewardIcon: "🍳",
    questType: "Gamification Quest",
    bonus: "Health Streak"
  }
];

// Glitch text effect component
const GlitchText = ({ text, className = "" }: { text: string; className?: string }) => {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative inline-block">
        {text}
        <span className="absolute top-0 left-0 -ml-[2px] text-[#0ff] opacity-70 animate-glitch1">{text}</span>
        <span className="absolute top-0 left-0 -ml-[1px] text-[#f0f] opacity-70 animate-glitch2">{text}</span>
      </span>
    </span>
  );
};

// TerminalText component
const TerminalText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const cursorTimer: NodeJS.Timeout = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    
    // Start typing effect after delay
    const startTimer = setTimeout(() => {
      let i = 0;
      timer = setInterval(() => {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(timer);
        }
      }, 30);
    }, delay);
    
    return () => {
      clearTimeout(startTimer);
      clearInterval(timer);
      clearInterval(cursorTimer);
    };
  }, [text, delay]);
  
  return (
    <span className="font-mono text-green-500 inline-block">
      {displayedText}
      <span className={`${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>_</span>
    </span>
  );
};

// Pixel art frame component
const PixelFrame = ({ children, variant = "primary" }: { children: React.ReactNode; variant?: "primary" | "secondary" }) => {
  const borderColor = variant === "primary" ? "border-blue-500" : "border-red-500";
  const bgColor = variant === "primary" ? "bg-blue-900/20" : "bg-red-900/20";
  
  return (
    <div className={`relative border-2 ${borderColor} ${bgColor} p-2`}>
      {/* Pixel corners */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 -mt-1 -ml-1 border-white"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 -mt-1 -mr-1 border-white"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 -mb-1 -ml-1 border-white"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 -mb-1 -mr-1 border-white"></div>
      {children}
    </div>
  );
};

// XP Bar component
const XPBar = ({ value, max, label, color = "blue" }: { value: number; max: number; label: string; color?: string }) => {
  const percentage = (value / max) * 100;
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span className="font-mono text-gray-400">{label}</span>
        <span className="font-mono text-gray-400">{value}/{max} XP</span>
      </div>
      <div className="h-2 w-full bg-gray-800 rounded overflow-hidden">
        <motion.div 
          className={`h-full ${color === "blue" ? "bg-blue-500" : "bg-red-500"}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// Skill Pill component
const SkillPill = ({ skill, color = "blue" }: { skill: string; color?: string }) => {
  return (
    <motion.div 
      className={`inline-block px-2 py-1 rounded-full text-xs font-mono mr-1 mb-1 ${
        color === "blue" ? "bg-blue-900/40 text-blue-300 border border-blue-500" : 
                           "bg-red-900/40 text-red-300 border border-red-500"
      }`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2, scale: 1.05 }}
    >
      {skill}
    </motion.div>
  );
};

// Quest Card component
const QuestCard = ({ quest, index, isActive, onActivate }: { 
  quest: typeof companies[0]; 
  index: number; 
  isActive: boolean;
  onActivate: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const isBlue = index === 0;
  const bgColor = isBlue ? "from-blue-900/30 to-blue-800/10" : "from-red-900/30 to-red-800/10";
  const borderColor = isBlue ? "border-blue-500" : "border-red-500";
  const accentColor = isBlue ? "blue" : "red";
  
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setIsUnlocked(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);
  
  return (
    <motion.div
      className={`relative w-full rounded-md overflow-hidden ${isUnlocked ? "" : "grayscale-[70%]"}`}
      animate={{ 
        scale: isActive ? 1 : 0.98,
        opacity: isActive ? 1 : 0.8
      }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onActivate}
    >
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${bgColor}`}></div>
      
      {/* Card content */}
      <div className="relative z-10 p-4">
        {/* Header */}
        <div className="flex items-center mb-3">
          <div className={`relative w-12 h-12 mr-3 rounded-md overflow-hidden border-2 ${borderColor} p-1 ${isUnlocked ? "bg-black/50" : "bg-black/80"}`}>
            <Image
              src={quest.logo}
              alt={`${quest.name} logo`}
              width={40}
              height={40}
              className="object-contain"
            />
            <div className="absolute inset-0 bg-noise opacity-20"></div>
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold tracking-tight">
                <GlitchText text={quest.name} />
              </h3>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-black border ${borderColor} text-lg`}>
                {quest.rewardIcon}
              </div>
            </div>
            
            <div className="flex items-center text-sm mt-1">
              <span className={`inline-block px-2 py-0.5 rounded ${isBlue ? "bg-blue-900/50 text-blue-200" : "bg-red-900/50 text-red-200"} mr-2`}>
                {quest.questType}
              </span>
              <span className={`text-xs ${quest.difficulty === "Hard" ? "text-red-400" : "text-yellow-400"}`}>
                {quest.difficulty} • Level {index + 1}
              </span>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-3">
          <XPBar 
            value={isUnlocked ? quest.experience : Math.floor(quest.experience * 0.1)} 
            max={quest.experience} 
            label="QUEST XP" 
            color={accentColor} 
          />
        </div>
        
        {/* Content Area */}
        <PixelFrame variant={isBlue ? "primary" : "secondary"}>
          <div className="p-2">
            <h4 className={`font-bold text-lg mb-2 ${isBlue ? "text-blue-200" : "text-red-200"}`}>
              {quest.title}
            </h4>
            
            {isActive ? (
              <div className="space-y-3 relative">
                <div className="font-mono text-xs">
                  <div className="mb-1 text-gray-400 uppercase">MISSION BRIEF:</div>
                  <div className="text-gray-300">
                    {isUnlocked ? <TerminalText text={quest.description} /> : (
                      <div className="flex items-center">
                        <span className="animate-pulse mr-2">⟨⟨</span>
                        <span>Decrypting mission data...</span>
                        <span className="animate-pulse ml-2">⟩⟩</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {isUnlocked && (
                  <>
                    <div className="font-mono text-xs">
                      <div className="mb-1 text-gray-400 uppercase">QUEST OBJECTIVE:</div>
                      <div className="text-gray-300">
                        <TerminalText text={quest.challenge} delay={200} />
                      </div>
                    </div>
                    
                    <div className="font-mono text-xs">
                      <div className="mb-1 text-gray-400 uppercase">MISSION AREAS:</div>
                      <div className="pl-2 border-l-2 border-gray-700">
                        {quest.areas.map((area, idx) => (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 + idx * 0.15 }}
                            className="flex items-start mb-1"
                          >
                            <span className={`mr-2 ${isBlue ? "text-blue-400" : "text-red-400"}`}>⊢</span>
                            <span className="text-gray-300 text-xs">{area}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                {/* Skills */}
                <div className="mt-2">
                  <div className="text-xs text-gray-400 mb-1">REQUIRED SKILLS:</div>
                  <div>
                    {quest.skills.map((skill, idx) => (
                      <SkillPill 
                        key={idx} 
                        skill={skill} 
                        color={accentColor} 
                      />
                    ))}
                  </div>
                </div>
                
                {/* Deliverable */}
                {isUnlocked && (
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <div className="font-mono text-xs">
                      <div className="flex items-center mb-1">
                        <span className={`inline-block w-2 h-2 mr-1 ${isBlue ? "bg-blue-500" : "bg-red-500"} animate-pulse`}></span>
                        <span className="text-gray-400 uppercase">REWARD CONDITION:</span>
                      </div>
                      <div className="text-gray-300">
                        <TerminalText text={quest.deliverable} delay={400} />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Achievement/Bonus */}
                <div className="mt-3 p-2 border border-dashed border-gray-600 rounded bg-gray-900/50">
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                      isUnlocked ? `${isBlue ? "bg-blue-800" : "bg-red-800"} animate-pulse` : "bg-gray-800"
                    }`}>
                      <span className="text-xs">⭐</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-300">BONUS ACHIEVEMENT</div>
                      <div className="text-xs text-gray-400">{quest.bonus} (+50 XP)</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center">
                <button 
                  className={`px-4 py-2 rounded font-mono ${
                    isBlue ? "bg-blue-800 hover:bg-blue-700" : "bg-red-800 hover:bg-red-700"
                  } text-white transition-colors duration-300`}
                  onClick={onActivate}
                >
                  [ACTIVATE QUEST]
                </button>
              </div>
            )}
          </div>
        </PixelFrame>
        
        {/* Bottom toolbar */}
        <div className="flex justify-between items-center mt-3 text-xs text-gray-500 font-mono">
          <div className="flex items-center">
            <span className={`inline-block w-2 h-2 rounded-full ${isActive ? "bg-green-500" : "bg-gray-500"} mr-1`}></span>
            <span>{isActive ? "QUEST ACTIVE" : "QUEST IDLE"}</span>
          </div>
          <div>
            {isHovered && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-400"
              >
                CLICK TO {isActive ? "DEACTIVATE" : "ACTIVATE"}
              </motion.span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Horizontal Scroller
const HorizontalScroller = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const scrollElement = scrollRef.current;
    
    const handleWheel = (e: WheelEvent) => {
      if (scrollElement) {
        e.preventDefault();
        scrollElement.scrollLeft += e.deltaY;
      }
    };
    
    if (scrollElement) {
      scrollElement.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);
  
  return (
    <div 
      ref={scrollRef}
      className="overflow-x-auto scrollbar-hide pb-4"
    >
      <div className="flex flex-col sm:flex-row gap-6 px-4 md:justify-center">
        {children}
      </div>
    </div>
  );
};

// Scanlines effect
const Scanlines = () => (
  <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden opacity-20">
    <div className="absolute inset-0 bg-scanlines"></div>
  </div>
);

// Distortion effect
const Distortion = () => {
  const [distortionLevel, setDistortionLevel] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDistortionLevel(Math.random() * 5);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      className="pointer-events-none fixed inset-0 z-40 mix-blend-overlay opacity-30"
      style={{
        filter: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='distortion'><feTurbulence type='fractalNoise' baseFrequency='0.01 0.04' numOctaves='5' seed='2' stitchTiles='stitch'/><feDisplacementMap in='SourceGraphic' scale='${distortionLevel}'/></filter></svg>#distortion")`,
      }}
    ></div>
  );
};

export const ProblemStatementsSection = () => {
  const [playerXp, setPlayerXp] = useState(120);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [activeQuestIndices, setActiveQuestIndices] = useState<number[]>([]);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const titleControls = useAnimationControls();

  useEffect(() => {
    if (inView) {
      // Start the animation once the component is in view
      titleControls.start({
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        transition: {
          duration: 8,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop"
        }
      });
      
      // Start the decryption animation
      let progress = 0;
      const interval = setInterval(() => {
        progress += 1;
        // setDecryptionProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 30);
      
      return () => clearInterval(interval);
    }
  }, [inView, titleControls]);

  const handleQuestActivation = (index: number) => {
    setActiveQuestIndices(prev => {
      // Check if the quest is already active
      if (prev.includes(index)) {
        // If active, remove it from the active array
        return prev.filter(i => i !== index);
      } else {
        // If not active, add it to the active array
        // Add XP when activating a quest (only if it wasn't already active)
        setPlayerXp(prev => Math.min(prev + 25, 500));
        if (playerXp >= 200 && playerLevel === 1) {
          setPlayerLevel(2);
        }
        return [...prev, index];
      }
    });
  };

  return (
    <section
      ref={ref}
      id="problem-statements"
      className="relative py-20 overflow-hidden bg-black text-white selection:bg-green-500 selection:text-black"
    >
      <Scanlines />
      <Distortion />
      
      {/* Static noise background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-noise animate-noise"></div>
      </div>
      
      {/* Decorative grid lines */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-grid"></div>
      </div>
      
      {/* Standard section header */}
      <div className="container mx-auto px-4 mb-12 sm:mb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="mx-auto mb-8 sm:mb-12">
            <div className="relative inline-block">
              <span className="absolute -top-12 sm:-top-16 -left-3 text-[80px] sm:text-[120px] font-black text-zinc-800 select-none hidden md:block opacity-50">
                QUESTS
              </span>
              
              <div className="relative z-10">
                <span className="text-xs sm:text-sm tracking-widest uppercase text-gray-500 dark:text-gray-400 block mb-2 font-medium">
                  {'// Innovation Awaits'}
                </span>
                <motion.h2 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
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
                  Problem Statements
                </motion.h2>
              </div>
              
              <motion.div 
                className="absolute -bottom-8 left-0 h-1 w-32 bg-gradient-to-r from-blue-600 to-purple-600"
                initial={{ width: 0 }}
                animate={inView ? { width: 128 } : { width: 0 }}
                transition={{ duration: 1.2, delay: 0.4 }}
              ></motion.div>
            </div>
            
            <div className="max-w-md mt-8 sm:mt-12 mx-auto text-center px-4 sm:px-0">
              <div className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Prepare for groundbreaking challenges that will push your innovation boundaries and create real-world impact
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="w-full h-10 relative">
          <div className="absolute left-0 bottom-0 h-px w-full bg-muted"></div>
        </div>
      </div>
      
      {/* Quest cards */}
      <div className="relative overflow-hidden mb-20 px-2 md:px-4">
        <HorizontalScroller>
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className={`relative ${index === 0 ? "mb-6 sm:mb-0" : ""} min-w-[300px] w-full sm:w-[480px] md:w-[580px] lg:w-[650px] flex-shrink-0`}
            >
              <QuestCard 
                quest={company} 
                index={index} 
                isActive={activeQuestIndices.includes(index)}
                onActivate={() => handleQuestActivation(index)}
              />
            </motion.div>
          ))}
        </HorizontalScroller>
      </div>
      
      {/* Game controls help */}
      <div className="container mx-auto px-4 mb-8">
        <div className="border border-gray-800 p-3 bg-black/50 font-mono text-xs">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center">
              <span className="inline-block px-2 py-1 bg-gray-800 rounded mr-2">CLICK</span>
              <span className="text-gray-400">Activate Quest</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block px-2 py-1 bg-gray-800 rounded mr-2">SCROLL</span>
              <span className="text-gray-400">Navigate Quests</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block px-2 py-1 bg-gray-800 rounded mr-2">HOVER</span>
              <span className="text-gray-400">Inspect Details</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom marquee text */}
      <div className="overflow-hidden border-t border-b border-green-500 py-2 mb-0">
        <motion.div
          animate={{
            x: [0, -1000]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="whitespace-nowrap flex"
        >
          {Array(10).fill("HACK_XPERIENCE_2025 * PROBLEM_STATEMENTS * INNOVATION * CHALLENGES * ").map((text, i) => (
            <span key={i} className="font-mono text-lg mr-4">{text}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}; 