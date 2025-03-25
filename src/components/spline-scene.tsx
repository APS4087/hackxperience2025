"use client";

import { useEffect, useState, useRef } from "react";
import type { Application } from "@splinetool/runtime";
import type { Object3D, PerspectiveCamera, WebGLRenderer } from "three";
import Spline from '@splinetool/react-spline';

interface SplineApplication extends Application {
  renderer?: WebGLRenderer;
  scene?: {
    children: Object3D[];
  };
}

export function SplineScene() {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const splineRef = useRef<SplineApplication | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      // Cleanup Spline instance on unmount
      if (splineRef.current) {
        splineRef.current.dispose();
      }
    };
  }, []);

  const onLoad = (splineApp: SplineApplication) => {
    splineRef.current = splineApp;
    
    try {
      // Remove watermark and ensure perfect transparency
      const canvas = document.querySelector('canvas');
      if (canvas) {
        canvas.style.removeProperty('background');
        canvas.style.backgroundColor = 'transparent';
        canvas.style.opacity = '1';
        canvas.style.mixBlendMode = 'normal';
      }

      // Optimize performance settings
      if (splineApp.renderer) {
        splineApp.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        splineApp.renderer.setSize(window.innerWidth, window.innerHeight, false);
      }

      // Adjust camera position to zoom out
      const camera = splineApp.scene?.children.find((child: Object3D) => child.name === 'Camera') as PerspectiveCamera;
      if (camera) {
        camera.position.set(0, 0, 1000);
        camera.updateProjectionMatrix();
      }
    } catch (err) {
      console.error('Error setting up Spline scene:', err);
      setError('Failed to load 3D scene');
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (splineRef.current?.renderer) {
        splineRef.current.renderer.setSize(window.innerWidth, window.innerHeight, false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse text-foreground/50">Loading 3D Scene...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <Spline
        scene="https://prod.spline.design/H1BsXXkOLnsN4CcE/scene.splinecode"
        onLoad={onLoad}
        style={{
          background: 'transparent',
          width: '100%',
          height: '100%',
          mixBlendMode: 'normal',
        }}
      />
      {/* Overlay to hide watermark */}
      <div className="absolute bottom-0 right-0 w-48 h-24 bg-background backdrop-blur-sm rounded-tl-lg" />
    </div>
  );
}   