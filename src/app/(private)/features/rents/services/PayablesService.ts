import { createClient } from "@/utils/supabase/client";
import { Payable } from "../types/rentTypes";

export class PayablesService {
	private static readonly TABLE_NAME = 'payables';
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
	}>): Promise<{data: Payable[] | null; error: string | null}> {
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
		return { data: data as Payable[] | null, error: null };
	}
}
