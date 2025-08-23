import { createClient } from "@/utils/supabase/client";
import { Receivable } from "./rentTypes";

export class PayablesService {
    private static readonly TABLE_NAME = 'payables';

    /**
     * Fetches all payables within a date range
     * @param params Object with startDate and endDate (YYYY-MM-DD)
     * @returns Promise<Payable[] | null>
     */
    static async fetchPayables(params: { startDate: string; endDate: string }): Promise<Receivable[] | null> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from(PayablesService.TABLE_NAME)
            .select('id, property_id, amount_paid, amount_due, due_date, paid_by, tenant_name')
            .gte('end_date', params.startDate)
            .lte('end_date', params.endDate)
            .order('end_date', { ascending: false });
        if (error) {
            console.error('Error fetching payables:', error);
            return null;
        }
        return data as Receivable[];
    }
}
