"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "motion/react";
 
export const TextHoverEffect = ({
  text,
  duration = 0,
  automatic = false,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });
  const controls = useAnimation();

  // Handle automatic animation for mobile
  useEffect(() => {
    if (automatic) {
      const animateGradient = async () => {
        while (true) {
          // Move from left to right
          await controls.start({
            cx: "100%",
            cy: "50%",
            transition: { duration: 2, ease: "easeInOut" }
          });
          // Reset to left
          await controls.start({
            cx: "0%",
            cy: "50%",
            transition: { duration: 0 }
          });
        }
      };
      
      setHovered(true);
      animateGradient();
    } else {
      controls.stop();
      setHovered(false);
    }
  }, [automatic, controls]);
 
  useEffect(() => {
    if (!automatic && svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor, automatic]);
 
  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 1200 300"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => !automatic && setHovered(true)}
      onMouseLeave={() => !automatic && setHovered(false)}
      onMouseMove={(e) => !automatic && setCursor({ x: e.clientX, y: e.clientY })}
      onTouchMove={(e) => {
        if (!automatic) {
          const touch = e.touches[0];
          setCursor({ x: touch.clientX, y: touch.clientY });
        }
      }}
      className="select-none w-full h-full"
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#ffff00" />
              <stop offset="25%" stopColor="#ff0000" />
              <stop offset="50%" stopColor="#00ffff" />
              <stop offset="75%" stopColor="#00ff00" />
              <stop offset="100%" stopColor="#ff00ff" />
            </>
          )}
        </linearGradient>
 
        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r={automatic ? "40%" : "20%"}
          initial={{ cx: "50%", cy: "50%" }}
          animate={automatic ? controls : maskPosition}
          transition={{ duration: duration, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-neutral-200 font-[helvetica] text-[9.5rem] md:text-[10rem] font-bold dark:stroke-neutral-800"
        style={{ opacity: 1 }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-neutral-200 font-[helvetica] text-[9.5rem] md:text-[10rem] font-bold dark:stroke-neutral-800"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
        style={{ strokeWidth: "0.5" }}
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.5"
        mask="url(#textMask)"
        className="fill-transparent font-[helvetica] text-[9.5rem] md:text-[10rem] font-bold"
      >
        {text}
      </text>
    </svg>
  );
}; 