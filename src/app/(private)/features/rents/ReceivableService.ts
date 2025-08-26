import { createClient } from "@/utils/supabase/client";
import { Receivable } from "./rentTypes";

export class ReceivablesService {
    private static readonly TABLE_NAME = 'receivables';

    /**
     * Fetches all receivables within a date range
     * @param params Object with startDate and endDate (YYYY-MM-DD)
     * @returns Promise<Receivable[] | null>
     */
    static async fetchReceivables(params: { startDate: string; endDate: string; property_ids: number[] }): Promise<{ data: Receivable[] | null; error: string | null }> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from(ReceivablesService.TABLE_NAME)
            .select('id, property_id, amount_paid, amount_due, due_date, paid_by, tenant_name')
            .gte('due_date', params.startDate)
            .lte('due_date', params.endDate)
            .filter('property_id', 'in', `(${params.property_ids.join(',')})`)
            .order('due_date', { ascending: false });

        if (error) {
            return { data: null, error: error.message };
        }

        // Map plain objects to Receivable class instances
        const receivables = data ? data.map(item => new Receivable(
            item.id,
            item.property_id,
            item.amount_paid,
            item.amount_due,
            item.due_date,
            item.paid_by,
            item.tenant_name
        )) : null;

        return { data: receivables, error: null };
    }

     /**
     * Bulk inserts receivables into the database
     * @param receivables Array of receivables (without id)
     * @returns Promise<{data: any[] | null; error: string | null}>
     */
    static async createReceivables(receivables: Array<{
        property_id: number;
        amount_paid: number;
        amount_due: number;
        due_date: string;
        paid_by: string | null;
        tenant_name: string;
    }>): Promise<{data: Receivable[] | null; error: string | null}> {
        const supabase = createClient();
        const { data: { user }, } = await supabase.auth.getUser();
        if (!user || !user.id) {
            return { data: null, error: 'User id not found' };
        }
        const { data, error } = await supabase
            .from(ReceivablesService.TABLE_NAME)
            .insert(receivables.map(r => ({ ...r, user_id: user.id })))
            .select('id, property_id, amount_paid, amount_due, due_date, paid_by, tenant_name')

        if (error) {
            return { data: null, error: error.message };
        }
        return { data : data as Receivable[] | null, error: null };
    }

    /**
     * Bulk upserts receivables into the database
     * @param receivables Array of receivable objects (with id for update, without id for insert)
     * @returns Promise<{data: Receivable[] | null; error: string | null}>
     */
    static async updateReceivables(receivables: Array<{
        id: number;
        property_id: number;
        amount_paid: number;
        amount_due: number;
        due_date: string;
        paid_by: string | null;
        tenant_name: string;
    }>): Promise<{data: Receivable[] | null; error: string | null}> {
        const supabase = createClient();
        const { data: { user }, } = await supabase.auth.getUser();
        if (!user || !user.id) {
            return { data: null, error: 'User id not found' };
        }
        const { data, error } = await supabase
            .from(ReceivablesService.TABLE_NAME)
            .upsert(receivables.map(r => ({ ...r, user_id: user.id })), { onConflict: 'id' })
            .select('id, property_id, amount_paid, amount_due, due_date, paid_by, tenant_name');
        if (error) {
            return { data: null, error: error.message };
        }
        return { data : data as Receivable[] | null, error: null };
    }
}
