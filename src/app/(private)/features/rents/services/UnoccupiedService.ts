import { createClient } from "@/utils/supabase/client";
import { Unoccupied } from "../types/rentTypes";

export class UnoccupiedService {
    private static readonly TABLE_NAME = 'unoccupied';

    /**
     * Fetches unoccupied records within a date range for given properties
     * @param params Object with startDate, endDate (YYYY-MM-DD), and property_ids
     * @returns Promise<{data: Unoccupied[] | null; error: string | null}>
     */
    static async fetchUnoccupied(params: { startDate: string; endDate: string; property_ids: number[] }): Promise<{ data: Unoccupied[] | null; error: string | null }> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.id) {
            return { data: null, error: 'User id not found' };
        }

        const { data, error } = await supabase
            .from(UnoccupiedService.TABLE_NAME)
            .select('id, property_id, month')
            .gte('month', params.startDate)
            .lte('month', params.endDate)
            .filter('property_id', 'in', `(${params.property_ids.join(',')})`)
            .eq('user_id', user.id)
            .order('month', { ascending: false });

        if (error) {
            return { data: null, error: error.message };
        }

        // Map plain objects to Unoccupied class instances
        const unoccupiedData = data ? data.map(item => ({
            id: item.id,
            property_id: item.property_id,
            month: item.month
        })) : null;

        return { data: unoccupiedData, error: null };
    }

    /**
     * Bulk inserts unoccupied records into the database
     * @param unoccupied Array of unoccupied records (without id)
     * @returns Promise<{data: Unoccupied[] | null; error: string | null}>
     */
    static async createUnoccupied(unoccupied: Array<{
        property_id: number;
        month: string;
    }>): Promise<{ data: Unoccupied[] | null; error: string | null }> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.id) {
            return { data: null, error: 'User id not found' };
        }

        const { data, error } = await supabase
            .from(UnoccupiedService.TABLE_NAME)
            .insert(unoccupied.map(u => ({ ...u, user_id: user.id })))
            .select('id, property_id, month');

        if (error) {
            return { data: null, error: error.message };
        }

        // Map plain objects to Unoccupied class instances
        const unoccupiedData = data ? data.map(item => ({
            id: item.id,
            property_id: item.property_id,
            month: item.month
        })) : null;

        return { data: unoccupiedData, error: null };
    }

    /**
     * Deletes specific unoccupied records by id
     * @param unoccupiedIds Array of unoccupied record IDs to delete
     * @returns Promise<{data: Unoccupied[] | null; error: string | null}>
     */
    static async deleteUnoccupied(unoccupiedIds: number[]): Promise<{ data: Unoccupied[] | null; error: string | null }> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.id) {
            return { data: null, error: 'User id not found' };
        }

        if (unoccupiedIds.length === 0) {
            return { data: null, error: 'No unoccupied IDs provided' };
        }

        const { data, error } = await supabase
            .from(UnoccupiedService.TABLE_NAME)
            .delete()
            .in('id', unoccupiedIds)
            .eq('user_id', user.id)
            .select('id, property_id, month');

        if (error) {
            return { data: null, error: error.message };
        }

        // Map plain objects to Unoccupied class instances
        const unoccupiedData = data ? data.map(item => ({
            id: item.id,
            property_id: item.property_id,
            month: item.month
        })) : null;

        return { data: unoccupiedData, error: null };
    }
}