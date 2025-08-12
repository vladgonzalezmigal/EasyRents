import supabase from "@/utils/supabase/supaBaseClientConfig";
import { handleApiResponse } from "./settingsAPIUtils";
import { Vendor, VendorResponse } from "../types/vendorTypes";
import { createClient } from "@/utils/supabase/client";


const TABLE_NAME = 'vendors';

export class vendorService {
    /**
     * Fetches all vendors from the database for the current user
     * 
     * @returns {Promise<VendorResponse>} A promise that resolves to an object containing
     * either the fetched vendors data or an error message
     */
    static async fetchVendors(): Promise<VendorResponse> {
        // Query the 'stores' table for id and name columns
        const { data: apiData, error } = await supabase
        .from(TABLE_NAME)
        .select('id, vendor_name, active'); // select auth_id 

        return handleApiResponse<Vendor[], VendorResponse>(apiData, error, 'vendors');
    }

    // create vendor data
    static createVendorObject(vendor_name: string,): Omit<Vendor, 'id'> {
        return {
            vendor_name: vendor_name,
            active: true
        }
    }

    
    static async createVendor(vendor_name: string,): Promise<VendorResponse> {
        const supabase = createClient();
        const { data: { user },} = await supabase.auth.getUser()

        if (!user || !user.id) {
            return { vendors: null, error: 'User id not found' };
        }

        const vendorData = this.createVendorObject(vendor_name,);
        const { data: apiData, error } = await supabase
        .from(TABLE_NAME)
        .insert({...vendorData, user_id: user.id})
        .select('id, vendor_name, active');

        return handleApiResponse<Vendor[], VendorResponse>(apiData, error, 'vendors');
    }
    // update vendor data
    static async updateVendors(vendor: Vendor): Promise<VendorResponse> {
        const { data: apiData, error } = await supabase
        .from(TABLE_NAME)
        .update(vendor) // update 1 row 
        .eq('id', vendor.id)
        .select('id, vendor_name, active');

        return handleApiResponse<Vendor[], VendorResponse>(apiData, error, 'vendors');
    }
}