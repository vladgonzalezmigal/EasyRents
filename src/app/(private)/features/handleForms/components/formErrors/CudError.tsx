'use client';
import React from 'react';

interface CudErrorProps {
  cudError: string | null;
}

export function CudError({ cudError }: CudErrorProps) {
  return (
    <div className="flex flex-row justify-center items-center h-[32px]">
      {cudError && <p className="text-red-500">{cudError}</p>}
    </div>
  );
}