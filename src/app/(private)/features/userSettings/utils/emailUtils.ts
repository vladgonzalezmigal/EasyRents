import { Email, EmailResponse } from "../types/emailTypes";
import { handleApiResponse } from "./settingsAPIUtils";
import { createClient } from "@/utils/supabase/client";

const TABLE_NAME = 'emails';

export class emailService {
    static async fetchEmailData(): Promise<EmailResponse> {
        const supabase = createClient();
        // Query the 'stores' table for id and name columns
        const { data: apiData, error } = await supabase
        .from(TABLE_NAME)
        .select('id, sender_email, recipient_email'); // select auth_id 

        return handleApiResponse<Email[], EmailResponse>(apiData, error, 'emails');
    }

    static async updateEmail(email: Email): Promise<EmailResponse> {
        const supabase = createClient();
        const { data: apiData, error } = await supabase
        .from(TABLE_NAME)
        .update(email) // replace with upsert 
        .eq('id', email.id)
        .select('id, sender_email, recipient_email');

        return handleApiResponse<Email[], EmailResponse>(apiData, error, 'emails');
    }
}
