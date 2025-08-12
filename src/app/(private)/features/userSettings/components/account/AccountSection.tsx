'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function AccountSection() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getUserEmail() {
      try {
        setIsLoading(true);
        const supabase = createClient();
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          throw error;
        }
        
        setUserEmail(user?.email || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user email');
        console.error('Error fetching user email:', err);
      } finally {
        setIsLoading(false);
      }
    }

    getUserEmail();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm w-[300px]">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Username</h2>
      
      {isLoading ? (
        <p className="text-gray-500">Loading user information...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-[16px] font-medium text-[#585858]">
          {userEmail || 'No email found'}
        </p>
      )}
    </div>
  );
}
