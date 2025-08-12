'use client';

import React, { useEffect, useRef } from "react";
import Navbar from "../components/navigation/Navbar";
import { usePathname } from "next/navigation";
import { drawDottedBackground } from "../utils/styling";
import { getBackConfig } from "../utils/nav";
import TopBar from "../components/navigation/topbar/TopBar";
import { getActiveForm } from "../utils/nav";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  const pathname = usePathname();
  const activePage: string | undefined = getActiveForm(pathname);
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
      <div className="w-full min-h-screen flex flex-col items-center">
        <div className="w-full z-10">
          <TopBar activePage={activePage} />
        </div>

        <div className="flex-1 w-full relative flex flex-col min-h-0">
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />
          <div className="relative z-10 w-full flex-1 min-h-0 ">
            {children}
          </div>
        </div>
      </div>

    </div>
  );
}
