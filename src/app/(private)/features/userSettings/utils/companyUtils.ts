
import supabase from "@/utils/supabase/supaBaseClientConfig";
import { Company, CompanyResponse } from "../types/CompanyTypes";
import { handleApiResponse } from "./settingsAPIUtils";
import { createClient } from "@/utils/supabase/client";

export class companyService {
    private static readonly TABLE_NAME = 'companies';
    /**
     * Fetches all companies from the database for the current user
     * 
     * @returns {Promise<CompanyResponse>} A promise that resolves to an object containing
     * either the fetched companies data or an error message
     */
    static async fetchCompanies(): Promise<CompanyResponse> {
        const { data: apiData, error } = await supabase
            .from(companyService.TABLE_NAME)
            .select('id, company_name, active');

        return handleApiResponse<Company[], CompanyResponse>(apiData, error, 'companies');
    }

    static async createCompany(company_name: string): Promise<CompanyResponse> {
        const supabase = createClient();
        const { data: { user }, } = await supabase.auth.getUser();

        if (!user || !user.id) {
            return { data: null, error: 'User id not found' };
        }

        const companyData = { company_name: company_name, active: true };
        const { data: apiData, error } = await supabase
            .from(companyService.TABLE_NAME)
            .insert({ ...companyData, user_id: user.id })
            .select('id, company_name, active');

        return handleApiResponse<Company[], CompanyResponse>(apiData, error, 'companies');
    }

    // update store data
    static async updateCompany(store: Company): Promise<CompanyResponse> {
        const { data: apiData, error } = await supabase
            .from(companyService.TABLE_NAME)
            .update(store) // replace with upsert
            .eq('id', store.id)
            .select('id, company_name, active');

        return handleApiResponse<Company[], CompanyResponse>(apiData, error, 'companies');
    }

    //  static createStoreObject(company_name: string): Omit<Company, 'id'> {
    //     return {
    //         company_name: company_name,
    //         active: true
    //     }
    // }
}