"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { Application } from "@splinetool/runtime";
import type { Object3D, PerspectiveCamera, WebGLRenderer, Scene } from "three";
import Spline from '@splinetool/react-spline';

interface SplineApplication extends Application {
  renderer?: WebGLRenderer;
  scene?: Scene;
  camera?: PerspectiveCamera;
}

export function SplineScene() {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const splineRef = useRef<SplineApplication | null>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check WebGL support
  useEffect(() => {
    if (!isClient) return;

    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        setWebglSupported(!!gl);
      } catch {
        setWebglSupported(false);
      }
    };

    checkWebGLSupport();
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    setMounted(true);
    return () => {
      if (splineRef.current) {
        splineRef.current.dispose();
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [isClient]);

  const onLoad = useCallback((splineApp: SplineApplication) => {
    if (!isClient) return;
    
    splineRef.current = splineApp;
    
    try {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        canvas.style.removeProperty('background');
        canvas.style.backgroundColor = 'transparent';
        canvas.style.opacity = '1';
        canvas.style.mixBlendMode = 'normal';
      }

      if (splineApp.renderer) {
        // Get the container dimensions
        const container = canvas?.parentElement;
        if (container) {
          const { width, height } = container.getBoundingClientRect();
          splineApp.renderer.setSize(width, height, false);
        }
        
        // Optimize renderer settings
        splineApp.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Only set up animation loop if WebGL is supported
        if (webglSupported) {
          splineApp.renderer.setAnimationLoop(() => {
            if (document.hidden) {
              splineApp.renderer?.setAnimationLoop(null);
            } else if (splineApp.scene && splineApp.camera && splineApp.renderer) {
              splineApp.renderer.render(splineApp.scene, splineApp.camera);
            }
          });
        }
      }

      const camera = splineApp.scene?.children.find((child: Object3D) => child.name === 'Camera') as PerspectiveCamera;
      if (camera) {
        // Adjust camera position to better center the 3D element
        camera.position.set(0, 0, 600);
        camera.updateProjectionMatrix();
      }
    } catch (err) {
      console.error('Error setting up Spline scene:', err);
      setError('Failed to load 3D scene');
    }
  }, [webglSupported, isClient]);

  // Debounced window resize handler
  useEffect(() => {
    if (!isClient) return;

    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      resizeTimeoutRef.current = setTimeout(() => {
        if (splineRef.current?.renderer) {
          const container = document.querySelector('canvas')?.parentElement;
          if (container) {
            const { width, height } = container.getBoundingClientRect();
            splineRef.current.renderer.setSize(width, height, false);
          }
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isClient]);

  if (!isClient || !mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse text-foreground/50">Loading 3D Scene...</div>
      </div>
    );
  }

  if (error || !webglSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-red-500/10 rounded-lg">
        <div className="text-center p-8">
          <h3 className="text-xl font-semibold mb-2">Unable to load 3D scene</h3>
          <p className="text-muted-foreground">
            {!webglSupported 
              ? "Your browser or device doesn't support WebGL. Please try using a different browser or device."
              : error || "An error occurred while loading the 3D scene."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
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