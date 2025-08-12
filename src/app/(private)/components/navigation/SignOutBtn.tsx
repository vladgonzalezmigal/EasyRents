'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { signOut } from '@/utils/AuthActions';
import { useStore } from '@/store';

const SignOutBtn = () => {
  const [signOutError, setSignOutError] = useState<string | null>(null);
  
  const { setGlobalLoading } = useStore();

  const router = useRouter();

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement> ) => {
     e.preventDefault();
     setGlobalLoading(true);
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      setGlobalLoading(false);
      setSignOutError(error as string);
    } 
    
  };

  return (
    <>
    <div className="h-full">
      <button
        onClick={handleSignOut}
        className="py-2 px-4 text-gray-800 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
      >
        Sign out
      </button>
    </div>
    <div>
        {signOutError && <p className="text-red-500">{signOutError}</p>}
    </div>
    </>
  );
};

export default SignOutBtn;
