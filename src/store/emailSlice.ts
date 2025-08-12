import { Email, EmailResponse } from "@/app/(private)/features/userSettings/types/emailTypes";
import { emailService } from "@/app/(private)/features/userSettings/utils/emailUtils";

export interface EmailSlice {
    emailState: EmailResponse;
    isLoadingEmail: boolean;
    isCudEmailLoading: boolean;
    // fetch email data 
    fetchEmail: () => Promise<void>;
    updateEmail: (email: Email) => Promise<void>;
}

export const createEmailSlice = (
    set: (partial: Partial<EmailSlice> | ((state: EmailSlice) => Partial<EmailSlice>)) => void,
    // get: () => EmailSlice
): EmailSlice => ({
    // initial state
    emailState: { emails: null, error: null },
    isLoadingEmail: false,
    isCudEmailLoading: false,

    fetchEmail: async () => {
        try {
            set({ isLoadingEmail: true });
            const emailData = await emailService.fetchEmailData();
            set({ emailState: emailData, isLoadingEmail: false });
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : "Error fetching email data.";
            set({
                isLoadingEmail: false,
                emailState: { emails: null, error: errorMessage },
            });
        }
    },

    updateEmail: async (email: Email) => {
        try {   
            set({ isCudEmailLoading: true });
            const emailData = await emailService.updateEmail(email);
            
            if (emailData.error === null) {
                // Update only the specific email in the existing state
                set((state) => {
                    const currentEmails = state.emailState.emails || [];
                    const updatedEmails = currentEmails.map(e => 
                        e.id === email.id ? email : e
                    );
                    
                    return {
                        emailState: {
                            emails: updatedEmails,
                            error: null
                        },
                        isCudEmailLoading: false
                    };
                });
            } else {
                // If there was an error, just update the error message
                set((state) => ({
                    isCudEmailLoading: false,
                    emailState: {
                        emails: state.emailState.emails,
                        error: emailData.error
                    }
                }));
            }
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : "Error updating email data.";
            
            // Keep existing emails but update the error message
            set((state) => ({
                isCudEmailLoading: false,
                emailState: {
                    emails: state.emailState.emails,
                    error: errorMessage
                }
            }));
        }
    }
})
