'use client';

import ChevronIcon from "../svgs/ChevronIcon";

export default function ChevronNav({isActive}: {isActive: boolean}) {

  return (
    <div className={`transform ${isActive ? 'rotate-270' : 'rotate-180'} transition-transform duration-200`}>
        <ChevronIcon className="w-6 h-6" />
    </div>
  );
}
