import { useState, useEffect, useRef, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import NavbarButton from "./NavbarButton";
import NavbarContent from "./NavbarContent";
import "./Navbar.css";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Memoize screen size check to reduce unnecessary re-renders
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    // Initial check
    checkScreenSize();

    // Debounced resize handler
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkScreenSize, 100);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Memoize variants to prevent unnecessary recalculations
  const variants = useMemo(() => ({
    closed: {
      width: isLargeScreen ? "100px" : "80px",
      height: isLargeScreen ? "40px" : "35px",
      top: isLargeScreen ? "50px" : "25px",
      left: isLargeScreen ? "50px" : "25px",
      scale: 1,
      transition: prefersReducedMotion ? { duration: 0 } : {
        duration: 0.75,
        type: "tween",
        ease: [0.76, 0, 0.24, 1],
        when: "afterChildren"
      }
    },
    open: {
      width: isLargeScreen ? "480px" : "calc(100vw - 30px)",
      height: isLargeScreen ? "650px" : "calc(100vh - 30px)",
      top: isLargeScreen ? "25px" : "15px",
      left: isLargeScreen ? "25px" : "15px",
      scale: 1,
      transition: prefersReducedMotion ? { duration: 0 } : {
        duration: 0.75,
        type: "tween",
        ease: [0.76, 0, 0.24, 1],
        when: "beforeChildren"
      }
    }
  }), [isLargeScreen, prefersReducedMotion]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <header className="navbar">
      <motion.div
        ref={menuRef}
        variants={variants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className="navbarMainDiv"
        layout
      >
        <NavbarButton isOpen={isOpen} setIsOpen={setIsOpen} />
        <AnimatePresence mode="wait">
          {isOpen && <NavbarContent isLargeScreen={isLargeScreen} />}
        </AnimatePresence>
      </motion.div>
    </header>
  );
} 