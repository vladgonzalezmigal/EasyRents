'use client';

import React from 'react';
import PlusIcon from '@/app/(private)/components/svgs/PlusIcon';

interface CreateBtnProps {
  onSubmit: () => void;
  disabled?: boolean;
}

export default function CreateBtn({ onSubmit, disabled = false }: CreateBtnProps) {
  return (
    <button
      onClick={onSubmit}
      disabled={disabled}
      className={`border-2 text-[#0C3C74] border-[#8ABBFD] h-[40px] px-4 bg-[#DFF4F3] rounded-3xl transition-colors duration-200 flex items-center justify-center gap-1 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#B6E8E4]'
      }`}
    >
      <PlusIcon className="w-4 h-4" />
      <span>Create</span>
    </button>
  );
}
