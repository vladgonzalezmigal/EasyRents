import { createClient } from "@/utils/supabase/client";
import { Payable } from "../types/rentTypes";

export class PayablesService {
	private static readonly TABLE_NAME = 'payables';

	static async fetchPayables(params: { startDate: string; endDate: string; property_ids: number[] }): Promise<{ data: Payable[] | null; error: string | null }> {
		const supabase = createClient();
		const { data, error } = await supabase
			.from(PayablesService.TABLE_NAME)
			.select('id, property_id, expense_name, expense_amount, expense_date, paid_with, detail')
			.gte('expense_date', params.startDate)
			.lte('expense_date', params.endDate)
			.filter('property_id', 'in', `(${params.property_ids.join(',')})`)
			.order('expense_date', { ascending: false });

		if (error) {
			return { data: null, error: error.message };
		}

		const payablesData = data ? data.map(item => new Payable(
			item.id,
			item.property_id,
			item.expense_name,
			item.expense_amount,
			item.expense_date,
			item.paid_with,
			item.detail
		)) : null;

		return { data: payablesData, error: null };
	}
	/**
	 * Bulk inserts expenses (payables) into the database
	 * @param payables Array of payables (without id)
	 * @returns Promise<{data: Payable[] | null; error: string | null}>
	 */
	static async createExpense(payables: Array<{
		property_id: number;
		expense_name: string;
		expense_amount: number;
		expense_date: string;
		paid_with: string;
		detail: string;
	}>): Promise<{ data: Payable[] | null; error: string | null }> {
		const supabase = createClient();
		const { data: { user }, } = await supabase.auth.getUser();
		if (!user || !user.id) {
			return { data: null, error: 'User id not found' };
		}
		const { data, error } = await supabase
			.from(PayablesService.TABLE_NAME)
			.insert(payables.map(p => ({ ...p, user_id: user.id })))
			.select('id, property_id, expense_name, expense_amount, expense_date, paid_with, detail');

		if (error) {
			return { data: null, error: error.message };
		}
		// Map plain objects to Payable class instances
		const payablesData = data ? data.map(item => new Payable(
			item.id,
			item.property_id,
			item.expense_name,
			item.expense_amount,
			item.expense_date,
			item.paid_with,
			item.detail
		)) : null;

		return { data: payablesData, error: null };
	}

	/**
	 * Bulk upserts payables into the database
	 * @param payables Array of payable objects (with id for update, without id for insert)
	 * @returns Promise<{data: Payable[] | null; error: string | null}>
	 */
	static async updatePayables(payables: Array<{
		id: number;
		property_id: number;
		expense_name: string;
		expense_amount: number;
		expense_date: string;
		paid_with: string;
		detail: string;
	}>): Promise<{ data: Payable[] | null; error: string | null }> {
		const supabase = createClient();
		const { data: { user } } = await supabase.auth.getUser();
		if (!user || !user.id) {
			return { data: null, error: 'User id not found' };
		}
		const { data, error } = await supabase
			.from(PayablesService.TABLE_NAME)
			.upsert(payables.map(p => ({ ...p, user_id: user.id })), { onConflict: 'id' })
			.select('id, property_id, expense_name, expense_amount, expense_date, paid_with, detail');

		if (error) {
			return { data: null, error: error.message };
		}

		// Map plain objects to Payable class instances
		const payablesData = data ? data.map(item => new Payable(
			item.id,
			item.property_id,
			item.expense_name,
			item.expense_amount,
			item.expense_date,
			item.paid_with,
			item.detail
		)) : null;

		return { data: payablesData, error: null };
	}

	/**
     * Deletes specific payables by id for a given property
     * @param payableIds Array of payable IDs to delete
     * @returns Promise<{data: Payable[] | null; error: string | null}>
     */
	
    static async deletePayables( payableIds: number[]): Promise<{ data: Payable[] | null; error: string | null }> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.id) {
            return { data: null, error: 'User id not found' };
        }

        const { data, error } = await supabase
            .from(PayablesService.TABLE_NAME)
            .delete()
            .in('id', payableIds)
            .select('id, property_id, expense_name, expense_amount, expense_date, paid_with, detail');

        if (error) {
            return { data: null, error: error.message };
        }

        // Map plain objects to Payable class instances
        const payablesData = data ? data.map(item => new Payable(
            item.id,
            item.property_id,
            item.expense_name,
            item.expense_amount,
            item.expense_date,
            item.paid_with,
            item.detail
        )) : null;

        return { data: payablesData, error: null };
    }
}
