"use client";
import React, { useRef, useState, useEffect } from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import { AvatarCircles } from "@/registry/magicui/avatar-circles";
import Head from "next/head";

const avatars = [
  {
    imageUrl: "/img/7.jpg",
  },
  {
    imageUrl: "/img/3.jpeg",
  },
  {
    imageUrl: "/img/9.jpg",
  },
  {
    imageUrl: "/img/1.jpeg",
  },
  {
    imageUrl: "/img/6.jpg",
  },
  {
    imageUrl: "/img/4.jpeg",
  },
  {
    imageUrl: "/img/8.jpg",
  },
  {
    imageUrl: "/img/2.jpeg",
  },
  {
    imageUrl: "/img/5.jpeg",
  },
];

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
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const isMobile = useMediaQuery('(max-width: 639px)');
  const [preloaderDismissed, setPreloaderDismissed] = useState(false);
  const [volume, setVolume] = useState(1);

  // Preload the hero image with high priority
  useEffect(() => {
    // Use the browser's Image constructor for preloading
    const preloadImage = document.createElement('img');
    preloadImage.src = "/img/hero.jpg";
    // Set as high priority (though browser might ignore)
    preloadImage.fetchPriority = "high";
  }, []);

  // Listen for the startHeroVideo event from the preloader
  useEffect(() => {
    const startVideo = (e: Event) => {
      const customEvent = e as CustomEvent;
      const withAudio = customEvent.detail?.withAudio || false;
      const initialVolume = customEvent.detail?.volume || volume;
      
      // Update volume state with the provided value
      setVolume(initialVolume);
      
      // Mark the preloader as dismissed
      setPreloaderDismissed(true);
      
      if (videoRef.current) {
        // Set muted state based on event detail
        videoRef.current.muted = !withAudio;
        setIsMuted(!withAudio);
        
        // Apply volume setting from the event
        videoRef.current.volume = initialVolume;
        
        // Play the video
        videoRef.current.play().catch(error => {
          console.log("Video playback failed:", error);
          // Fallback to muted if autoplay with sound fails
          if (!videoRef.current!.muted) {
            videoRef.current!.muted = true;
            setIsMuted(true);
            videoRef.current!.play().catch(err => 
              console.log("Muted playback also failed:", err)
            );
          }
        });
      }
    };

    window.addEventListener('startHeroVideo', startVideo);
    
    return () => {
      window.removeEventListener('startHeroVideo', startVideo);
    };
  }, []);

  // Only play when the preloader has been dismissed, but don't stop when leaving viewport
  useEffect(() => {
    const currentVideo = videoRef.current;
    if (!currentVideo) return;

    // Only control video on preloader dismissal, not viewport visibility
    if (preloaderDismissed) {
      const playVideo = async () => {
        try {
          await currentVideo.play();
        } catch (error) {
          console.log("Video playback failed:", error);
        }
      };
      playVideo();
    }
    // We intentionally don't pause the video when it leaves the viewport
  }, [preloaderDismissed]);

  // Separate effect for setting visibility without affecting playback
  useEffect(() => {
    const observer = new IntersectionObserver(
      () => {
        // We're only tracking intersection for analytics/performance purposes
        // but not taking any action based on it
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
      const newMutedState = !videoRef.current.muted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      
      // Apply current volume setting when unmuting
      if (!newMutedState) {
        videoRef.current.volume = volume;
      }
      
      // If unmuting, ensure video is playing
      if (!newMutedState && videoRef.current.paused) {
        videoRef.current.play().catch(error => {
          console.log("Video playback failed:", error);
          // Revert to muted state if unmuted playback fails
          videoRef.current!.muted = true;
          setIsMuted(true);
        });
      }
    }
  };

  // Get volume icon based on mute state
  const getVolumeIcon = () => {
    if (isMuted) {
      return <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-white" />;
    } else {
      return <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />;
    }
  };

  return (
    <>
      <Head>
        {/* Preload critical assets */}
        <link rel="preload" href="/img/hero.jpg" as="image" fetchPriority="high" />
        {!isMobile && <link rel="preload" href="/vids/simitc2024-hackathon.mp4" as="video" type="video/mp4" />}
      </Head>
      <div className="flex flex-col overflow-hidden -mx-4 sm:mx-0">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex flex-col items-end gap-2">
          <span className="text-sm sm:text-base font-medium text-white">
            By SIM IT Club
          </span>
          <AvatarCircles avatarUrls={avatars} numPeople={20} />
        </div>
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
                fetchPriority="high"
              />
            ) : (
              <>
                <Image
                  src="/img/hero.jpg"
                  alt="HackXperience Hero"
                  fill
                  priority
                  sizes="100vw"
                  quality={75}
                  className={`absolute inset-0 w-full h-full object-cover rounded-xl sm:rounded-2xl ${isVideoLoaded ? 'hidden' : ''}`}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)',
                    willChange: 'transform'
                  }}
                  fetchPriority="high"
                />
                <video
                  ref={videoRef}
                  loop
                  playsInline
                  muted
                  preload="metadata"
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
                  {getVolumeIcon()}
                </button>
              </>
            )}
          </div>
        </ContainerScroll>
      </div>
    </>
  );
} 