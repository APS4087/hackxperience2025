"use client";

import { Toaster } from "sonner";

export function ToasterProvider() {
  return (
    <Toaster 
      position="top-center"
      theme="dark"
      richColors
      closeButton
      expand={false}
      duration={4000}
      className="dark"
    />
  );
} 