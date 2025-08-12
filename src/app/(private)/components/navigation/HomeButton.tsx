'use client';

import { useRouter } from 'next/navigation';


export default function HomeButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/selection')}
      className="flex items-center justify-center w-12 h-12 rounded-full main-theme hover:brightness-80 transition-colors duration-200"
      aria-label="Go back"
    >
        <p>Home</p>
    </button>
  );
} 