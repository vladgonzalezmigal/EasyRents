'use client';

import React from 'react';

interface DocSearchTitleProps {
  title: string;
}

export default function DocSearchTitle({ title }: DocSearchTitleProps) {
  return (
    <div className="text-2xl font-bold text-[#2F2F2F] mb-8  ">
      {title}
    </div>
  );
}
