import { handleApiResponse } from "./settingsAPIUtils";
import { Property , PropertyMap, PropertyResponse } from '../types/propertyTypes';
import { createClient } from "@/utils/supabase/client";

export class PropertyService {
    private static readonly TABLE_NAME = 'properties';
    /**
     * Fetches all properties from the database for the current user
     * 
     * @returns {Promise<PropertyResponse>} A promise that resolves to an object containing
     * either the fetched properties data or an error message
     */
    static async fetchProperties(): Promise<PropertyResponse> {
        const supabase = createClient();
        // Query the 'stores' table for id and name columns
        const { data: apiData, error } = await supabase
            .from(PropertyService.TABLE_NAME)
            .select('id, company_id, address, tenant_name, tenant_email, tenant_phone, rent_amount, rent_due_date')

        return handleApiResponse<Property[], PropertyResponse>(apiData, error, 'properties');
    }

    static async createProperty(company_id: number, address: string, tenant_name: string, tenant_email: string, tenant_phone: string, rent_amount: number, rent_due_date: number): Promise<PropertyResponse> {
        const supabase = createClient();
        const { data: { user }, } = await supabase.auth.getUser();

        if (!user || !user.id) {
            return { data: null, error: 'User id not found' };
        }

        const propertyData = { company_id : company_id, address : address, tenant_name : tenant_name, tenant_email : tenant_email, tenant_phone : tenant_phone, rent_amount : rent_amount, rent_due_date : rent_due_date };
        const { data: apiData, error } = await supabase
            .from(PropertyService.TABLE_NAME)
            .insert({ ...propertyData, user_id: user.id })
            .select('id, company_id, address, tenant_name, tenant_email, tenant_phone, rent_amount, rent_due_date');

        return handleApiResponse<Property[], PropertyResponse>(apiData, error, 'properties');
        }
}