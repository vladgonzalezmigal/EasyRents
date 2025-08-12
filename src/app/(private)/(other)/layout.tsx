'use client';

import React, { useEffect, useRef } from "react";
import Navbar from "../components/navigation/Navbar";
import { usePathname } from "next/navigation";
import { drawDottedBackground } from "../utils/styling";
import { getBackConfig } from "../utils/nav";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { backURL } = getBackConfig(pathname);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cleanup = drawDottedBackground(canvas);
    return cleanup;
  }, []);

  return (
    <div className="flex">
      <Navbar backURL={backURL} />
      {/* Main content */}
      <div className="w-full min-h-screen w-full relative ">
        <canvas 
          ref={canvasRef} 
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
