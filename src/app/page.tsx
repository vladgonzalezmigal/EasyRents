'use client';

import LoginForm from './login/LoginForm';
import { useEffect, useRef } from 'react';
import { drawDottedBackground } from './(private)/utils/styling';

// home page acts as login page
export default function Home() { 
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cleanup = drawDottedBackground(canvas);
    return cleanup;
  }, []);

  return (
    <div className="min-h-screen h-full w-full flex items-center justify-center relative">
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
      <div className="w-full flex items-center justify-center relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}
