'use client';

import React from 'react';
import PlusIcon from '@/app/(private)/components/svgs/PlusIcon';

interface CreateBtnProps {
  onClick: () => void
  disabled?: boolean;
}

export default function CreateBtn({  disabled = false, onClick }: CreateBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-6 h-6 rounded-full bg-[#DFF4F3] border border-[#8ABBFD] flex items-center justify-center transition-colors duration-200 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#B6E8E4]'
      }`}
      style={{ minWidth: '24px', minHeight: '24px' }}
    >
      <PlusIcon className="w-3 h-3 text-[#0C3C74]" />
    </button>
  );
}
