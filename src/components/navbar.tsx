import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NavbarButton from "./NavbarButton";
import NavbarContent from "./NavbarContent";
import "./Navbar.css";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(
    typeof window !== "undefined" ? window.innerWidth > 500 : false
  );
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 500);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const variants = {
    closed: {
      width: "100px",
      height: "40px",
      top: "50px",
      left: "50px",
      scale: 1,
      transition: {
        duration: 0.75,
        type: "tween",
        ease: [0.76, 0, 0.24, 1],
        when: "afterChildren"
      }
    },
    open: {
      width: isLargeScreen ? "480px" : "100%",
      height: isLargeScreen ? "650px" : "480px",
      top: "25px",
      left: "25px",
      scale: 1,
      transition: {
        duration: 0.75,
        type: "tween",
        ease: [0.76, 0, 0.24, 1],
        when: "beforeChildren"
      }
    }
  };

  return (
    <header className="navbar">
      <motion.div
        ref={menuRef}
        variants={variants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className="navbarMainDiv"
      >
        <NavbarButton isOpen={isOpen} setIsOpen={setIsOpen} />
        <AnimatePresence mode="wait">
          {isOpen && <NavbarContent isLargeScreen={isLargeScreen} />}
        </AnimatePresence>
      </motion.div>
    </header>
  );
} 