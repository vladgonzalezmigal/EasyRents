import { handleApiResponse } from "./settingsAPIUtils";
import { Tenant, TenantResponse } from '../types/tenantTypes';
import { createClient } from "@/utils/supabase/client";

export class TenantService {
    private static readonly TABLE_NAME = 'tenants';
    
    /**
     * Fetches all tenants from the database for the current user
     * 
     * @returns {Promise<TenantResponse>} A promise that resolves to an object containing
     * either the fetched tenants data or an error message
     */
    static async fetchTenants(): Promise<TenantResponse> {
        const supabase = createClient();
        const { data: apiData, error } = await supabase
            .from(TenantService.TABLE_NAME)
            .select('id, property_id, first_name, last_name, rent_amount, rent_due_date, phone_number, email');

        return handleApiResponse<Tenant[], TenantResponse>(apiData, error, 'tenants');
    }

    static async createTenant(
        property_id: number, 
        first_name: string, 
        last_name: string, 
        rent_amount: string, 
        rent_due_date: string, 
        phone_number?: string | null, 
        email?: string | null
    ): Promise<TenantResponse> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.id) {
            return { data: null, error: 'User id not found' };
        }

        const tenantData = { 
            property_id, 
            first_name, 
            last_name, 
            rent_amount, 
            rent_due_date, 
            phone_number: phone_number ?? '', 
            email: email ?? '' 
        };
        
        const { data: apiData, error } = await supabase
            .from(TenantService.TABLE_NAME)
            .insert({ ...tenantData, user_id: user.id })
            .select('id, property_id, first_name, last_name, rent_amount, rent_due_date, phone_number, email');

        return handleApiResponse<Tenant[], TenantResponse>(apiData, error, 'tenants');
    }

    static async createTenants(tenants: Array<{
        property_id: number;
        first_name: string;
        last_name: string;
        rent_amount: number;
        rent_due_date: number;
        phone_number: string;
        email: string;
    }>): Promise<TenantResponse> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.id) {
            return { data: null, error: 'User id not found' };
        }

        // Prepare tenant data with user_id
        const tenantDataArray = tenants.map(tenant => ({
            ...tenant,
            user_id: user.id
        }));
        
        const { data: apiData, error } = await supabase
            .from(TenantService.TABLE_NAME)
            .insert(tenantDataArray)
            .select('id, property_id, first_name, last_name, rent_amount, rent_due_date, phone_number, email');

        return handleApiResponse<Tenant[], TenantResponse>(apiData, error, 'tenants');
    }

    // Bulk update (upsert) tenant rows by id
    static async updateTenants(updates: Array<{
        id: number;
        property_id: number;
        first_name: string;
        last_name: string;
        rent_amount: number;
        rent_due_date: number;
        phone_number?: string;
        email?: string;
    }>): Promise<TenantResponse> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.id) {
            return { data: null, error: 'User id not found' };
        }

        const upsertData = updates.map(u => ({ ...u, user_id: user.id }));
        const { data: apiData, error } = await supabase
            .from(TenantService.TABLE_NAME)
            .upsert(upsertData, { onConflict: 'id' })
            .select('id, property_id, first_name, last_name, rent_amount, rent_due_date, phone_number, email');

        return handleApiResponse<Tenant[], TenantResponse>(apiData, error, 'tenants');
    }

    static async deleteAllTenants(propertyIds: number[]): Promise<TenantResponse> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.id) {
            return { data: null, error: 'User id not found' };
        }

        const { data: apiData, error } = await supabase
            .from(TenantService.TABLE_NAME)
            .delete()
            .in('property_id', propertyIds)
            .select('id, property_id, first_name, last_name, rent_amount, rent_due_date, phone_number, email');

        return handleApiResponse<Tenant[], TenantResponse>(apiData, error, 'tenants');
    }

    // Delete specific tenants by id for a given property
    static async deleteTenants(propertyId: number, tenantIds: number[]): Promise<TenantResponse> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.id) {
            return { data: null, error: 'User id not found' };
        }

        const { data: apiData, error } = await supabase
            .from(TenantService.TABLE_NAME)
            .delete()
            .in('id', tenantIds)
            .eq('property_id', propertyId)
            .select('id, property_id, first_name, last_name, rent_amount, rent_due_date, phone_number, email');

        return handleApiResponse<Tenant[], TenantResponse>(apiData, error, 'tenants');
    }
}
