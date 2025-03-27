"use client";
import React, { useRef, useState, useEffect } from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Volume2, VolumeX } from "lucide-react";
import Image from "next/image";

// Custom hook for media query
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const updateMatch = () => setMatches(media.matches);
    
    // Initial check
    updateMatch();
    
    // Listen for changes
    media.addEventListener('change', updateMatch);
    return () => media.removeEventListener('change', updateMatch);
  }, [query]);

  return matches;
}

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const isMobile = useMediaQuery('(max-width: 639px)');

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
      const playVideo = async () => {
        try {
          // Set muted state explicitly for mobile autoplay
          currentVideo.muted = true;
          setIsMuted(true);
          await currentVideo.play();
        } catch (error) {
          console.log("Video playback failed:", error);
        }
      };
      playVideo();
    } else {
      currentVideo.pause();
    }
  }, [isVideoVisible]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsVideoLoaded(true);
      console.log("Video loaded successfully");
    };

    const handleError = (e: Event) => {
      console.error("Video loading error:", (e as ErrorEvent).message);
      setIsVideoLoaded(false);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
      
      // If unmuting, ensure video is playing
      if (!videoRef.current.muted && videoRef.current.paused) {
        videoRef.current.play().catch(error => {
          console.log("Video playback failed:", error);
          // Revert to muted state if unmuted playback fails
          videoRef.current!.muted = true;
          setIsMuted(true);
        });
      }
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
          {isMobile ? (
            <Image
              src="/img/hero.jpg"
              alt="HackXperience Hero"
              fill
              priority
              sizes="(max-width: 640px) 100vw, 50vw"
              quality={75}
              loading="eager"
              className="object-cover rounded-xl sm:rounded-2xl"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
                willChange: 'transform'
              }}
            />
          ) : (
            <>
              <video
                ref={videoRef}
                loop
                playsInline
                muted
                preload="auto"
                poster="/img/hero.jpg"
                className={`absolute inset-0 w-full h-full object-cover rounded-xl sm:rounded-2xl ${!isVideoLoaded ? 'invisible' : ''}`}
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'translateZ(0)',
                  willChange: 'transform'
                }}
                onLoadStart={() => console.log("Video load started")}
              >
                <source 
                  src="/vids/simitc2024-hackathon.mp4" 
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-2 py-1 rounded bg-black/50 text-white text-sm">
                Highlights from 2024 Hackathon
              </div>
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
            </>
          )}
        </div>
      </ContainerScroll>
    </div>
  );
} 