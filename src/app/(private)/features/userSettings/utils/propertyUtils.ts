import { handleApiResponse } from "./settingsAPIUtils";
import { Property, PropertyResponse } from '../types/propertyTypes';
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
            .select('id, company_id, address')

        return handleApiResponse<Property[], PropertyResponse>(apiData, error, 'properties');
    }

    static async createProperty(company_id: number, address: string): Promise<PropertyResponse> {
        const supabase = createClient();
        const { data: { user }, } = await supabase.auth.getUser();

        if (!user || !user.id) {
            return { data: null, error: 'User id not found' };
        }

        const propertyData = { company_id: company_id, address: address };
        const { data: apiData, error } = await supabase
            .from(PropertyService.TABLE_NAME)
            .insert({ ...propertyData, user_id: user.id })
            .select('id, company_id, address');

        return handleApiResponse<Property[], PropertyResponse>(apiData, error, 'properties');
    }

    static async deleteProperty(propertyIds: number[]): Promise<PropertyResponse> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.id) {
            return { data: null, error: 'User id not found' };
        }

        // Soft delete: set active=false instead of deleting
        const { data: apiData, error } = await supabase
            .from(PropertyService.TABLE_NAME)
            .update({ active: false })
            .in('id', propertyIds)
            .select('id, company_id, address');

        return handleApiResponse<Property[], PropertyResponse>(apiData, error, 'properties');
    }

    static async updateProperties(properties: Array<{ id: number; company_id: number; address: string; }>): Promise<PropertyResponse> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.id) {
            return { data: null, error: 'User id not found' };
        }

        // Upsert by id so each property can have distinct values
        const upsertData = properties.map(p => ({ ...p, user_id: user.id }));
        const { data: apiData, error } = await supabase
            .from(PropertyService.TABLE_NAME)
            .upsert(upsertData, { onConflict: 'id' })
            .select('id, company_id, address');

        return handleApiResponse<Property[], PropertyResponse>(apiData, error, 'properties');
    }
}