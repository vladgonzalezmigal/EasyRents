import { createClient } from '@/utils/supabase/client';

export interface AccountSlice {
    userEmail: string | null;
    isLoadingEmail: boolean;
    error: string | null;
    fetchUserEmail: () => Promise<void>;
}

export const createAccountSlice = (
    set: (partial: Partial<AccountSlice> | ((state: AccountSlice) => Partial<AccountSlice>)) => void,
): AccountSlice => ({
    // initial state
    userEmail: null,
    isLoadingEmail: false,
    error: null,

    fetchUserEmail: async () => {
        try {
            set({ isLoadingEmail: true });
            const supabase = createClient();
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (error) {
                throw error;
            }
            
            set({ 
                userEmail: user?.email || null,
                isLoadingEmail: false,
                error: null
            });
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : "Error fetching user email.";
            set({
                isLoadingEmail: false,
                error: errorMessage
            });
        }
    }
})
