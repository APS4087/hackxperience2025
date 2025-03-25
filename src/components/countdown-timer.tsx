"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  
  const hackathonDate = useMemo(() => new Date("2025-05-15T00:00:00"), []);
  
  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const difference = hackathonDate.getTime() - now.getTime();
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    };
  }, [hackathonDate]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return (
    <div className="flex justify-center gap-4 md:gap-8 mb-10">
      <CountdownItem value={timeLeft.days} label="Days" />
      <CountdownItem value={timeLeft.hours} label="Hours" />
      <CountdownItem value={timeLeft.minutes} label="Minutes" />
    </div>
  );
}

function CountdownItem({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 md:w-24 h-16 md:h-24 bg-card rounded-lg border border-border flex items-center justify-center">
        <span className="text-2xl md:text-4xl font-bold">{value}</span>
      </div>
      <span className="text-sm md:text-base text-muted-foreground mt-2">{label}</span>
    </div>
  );
} 