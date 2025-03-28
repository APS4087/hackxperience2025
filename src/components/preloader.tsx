"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Default volume setting for initial playback
const DEFAULT_VOLUME = 0.5;

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("0");
  const [readyForUser, setReadyForUser] = useState(false);
  const [clickEvent, setClickEvent] = useState(false);

  // Simulate loading progress
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    // First phase (0-70%): Fast progress
    if (progress < 70) {
      interval = setInterval(() => {
        setProgress(prev => Math.min(prev + Math.random() * 3, 70));
      }, 100);
    } 
    // Second phase (70-95%): Slower progress
    else if (progress < 95) {
      interval = setInterval(() => {
        setProgress(prev => Math.min(prev + Math.random() * 0.8, 95));
      }, 200);
    } 
    // Final phase (95-100%): Very slow, simulating finalization
    else if (progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 0.2, 100));
      }, 150);
    } 
    // When we reach 100%, set ready for user instead of hiding preloader
    else if (!readyForUser) {
      setReadyForUser(true);
      if (interval) clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [progress, readyForUser]);

  // Force complete loading after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle user click to continue
  useEffect(() => {
    if (readyForUser && clickEvent) {
      // Delay to allow click animation to complete
      const timer = setTimeout(() => {
        setIsLoading(false);
        
        // Trigger video play with audio and the default volume
        const event = new CustomEvent('startHeroVideo', { 
          detail: { 
            withAudio: true,
            volume: DEFAULT_VOLUME  // Set default volume level
          } 
        });
        window.dispatchEvent(event);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [readyForUser, clickEvent]);

  // Smooth progress text animation
  useEffect(() => {
    const updateProgressText = () => {
      const currentNumber = parseInt(progressText);
      if (currentNumber < Math.floor(progress)) {
        setProgressText(Math.min(currentNumber + 1, Math.floor(progress)).toString());
      }
    };
    
    const timer = setTimeout(updateProgressText, 20);
    return () => clearTimeout(timer);
  }, [progress, progressText]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            transition: { 
              duration: 0.8, 
              ease: "easeInOut",
              delay: 0.3
            } 
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black cursor-pointer"
          onClick={() => readyForUser && setClickEvent(true)}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Standard particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/40 rounded-full"
                initial={{ 
                  x: Math.random() * 100 - 50 + "%", 
                  y: Math.random() * 100 - 50 + "%" 
                }}
                animate={{ 
                  x: [
                    Math.random() * 100 - 50 + "%", 
                    Math.random() * 100 - 50 + "%"
                  ],
                  y: [
                    Math.random() * 100 - 50 + "%", 
                    Math.random() * 100 - 50 + "%"
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 10 + Math.random() * 20,
                  ease: "linear"
                }}
              />
            ))}
            
            {/* Brighter, larger particles */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`bright-${i}`}
                className="absolute w-3 h-3 bg-white/70 rounded-full blur-[1px]"
                initial={{ 
                  x: Math.random() * 100 - 50 + "%", 
                  y: Math.random() * 100 - 50 + "%" 
                }}
                animate={{ 
                  x: [
                    Math.random() * 100 - 50 + "%", 
                    Math.random() * 100 - 50 + "%"
                  ],
                  y: [
                    Math.random() * 100 - 50 + "%", 
                    Math.random() * 100 - 50 + "%"
                  ],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 15 + Math.random() * 20,
                  ease: "linear"
                }}
              />
            ))}
          </div>

          <div className="relative flex flex-col items-center z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white text-5xl md:text-7xl font-bold mb-16"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                HackXperience
              </span>
            </motion.h1>
            
            {/* Progress Bar */}
            <div className="w-72 md:w-96 h-[2px] bg-gray-800 relative overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
                className="absolute top-0 left-0 h-full bg-white"
              />
            </div>
            
            {/* Progress Text */}
            <div className="flex items-center justify-between w-72 md:w-96 mt-4">
              <motion.span 
                className="text-white/50 text-sm font-mono"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {readyForUser ? "READY" : "LOADING"}
              </motion.span>
              
              <motion.span 
                className="text-white text-sm font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {progressText}%
              </motion.span>
            </div>
            
            {/* Status Message - changes based on loading state */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: 1,
                y: 0
              }}
              transition={{ duration: 0.4 }}
              className="mt-16 text-white/70 text-sm tracking-[0.15em] uppercase"
            >
              {readyForUser ? (
                <motion.div 
                  className="flex flex-col items-center"
                  animate={{ 
                    opacity: [0.7, 1, 0.7],
                    y: [0, -3, 0]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2.5,
                    ease: "easeInOut"
                  }}
                >
                  <span className="text-white/90">TAP ANYWHERE TO BEGIN</span>
                  <motion.div 
                    className="mt-3 h-6 w-[1px] bg-white/30"
                    animate={{ scaleY: [0.6, 1, 0.6] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              ) : (
                <span>PREPARING EXPERIENCE</span>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 