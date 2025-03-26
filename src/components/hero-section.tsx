"use client";
import React, { useRef, useState, useEffect } from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Volume2, VolumeX } from "lucide-react";

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVideoVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    const currentVideo = videoRef.current;
    if (currentVideo) {
      observer.observe(currentVideo);
    }

    return () => {
      if (currentVideo) {
        observer.unobserve(currentVideo);
      }
    };
  }, []);

  useEffect(() => {
    const currentVideo = videoRef.current;
    if (!currentVideo) return;

    if (isVideoVisible) {
      currentVideo.play()
        .catch((error) => {
          console.log("Video playback failed:", error);
        });
    } else {
      currentVideo.pause();
    }
  }, [isVideoVisible]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden -mx-4 sm:mx-0">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-black dark:text-white px-4 sm:px-0">
              Join the ultimate <br />
              <span className="text-5xl sm:text-6xl md:text-7xl lg:text-[8rem] font-bold mt-1 leading-none bg-gradient-to-r from-primary to-red-500 bg-clip-text text-transparent">
                HackXperience
              </span>
            </h1>
          </>
        }
      >
        <div className="relative w-full h-full px-4 sm:px-0">
          <video
            ref={videoRef}
            loop
            playsInline
            muted
            preload="metadata"
            poster="/vids/poster-frame.jpg"
            className="absolute inset-0 w-full h-full object-cover rounded-xl sm:rounded-2xl"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
              willChange: 'transform'
            }}
          >
            <source 
              src="/vids/simitc2024-hackathon.mp4" 
              type="video/mp4"
              media="(min-width: 640px)"
            />
            <source 
              src="/vids/simitc2024-hackathon-mobile.mp4" 
              type="video/mp4"
              media="(max-width: 639px)"
            />
            Your browser does not support the video tag.
          </video>
          <button
            onClick={toggleMute}
            className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 p-1.5 sm:p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-10"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            )}
          </button>
        </div>
      </ContainerScroll>
    </div>
  );
} 