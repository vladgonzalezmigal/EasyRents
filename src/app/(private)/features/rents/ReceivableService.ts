import { createClient } from "@/utils/supabase/client";
import { Receivable } from "./rentTypes";

export class ReceivablesService {
    private static readonly TABLE_NAME = 'receivables';

    /**
     * Fetches all receivables within a date range
     * @param params Object with startDate and endDate (YYYY-MM-DD)
     * @returns Promise<Receivable[] | null>
     */
    static async fetchReceivables(params: { startDate: string; endDate: string;  }): Promise<{data: Receivable[] | null; error: string | null} | null> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from(ReceivablesService.TABLE_NAME)
            .select('id, property_id, amount_paid, amount_due, due_date, paid_by, tenant_name')
            .gte('due_date', params.startDate)
            .lte('due_date', params.endDate)
            .order('due_date', { ascending: false });
        if (error) {
            return {data: null, error: error.message};
        }
        return {data : data as Receivable[] | null, error: null};
    }
}
