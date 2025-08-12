import supabase from "@/utils/supabase/supaBaseClientConfig";
import { Store, StoreResponse } from "../types/storeTypes";
import { handleApiResponse } from "./settingsAPIUtils";
import { createClient } from "@/utils/supabase/client";

const TABLE_NAME = 'stores';

export class storeService {
    /**
     * Fetches all stores from the database for the current user
     * 
     * @returns {Promise<StoreResponse>} A promise that resolves to an object containing
     * either the fetched stores data or an error message
     */
    static async fetchStores(): Promise<StoreResponse> {
        // Query the 'stores' table for id and name columns
        const { data: apiData, error } = await supabase
        .from(TABLE_NAME)
        .select('id, store_name, active'); // select auth_id 

        return handleApiResponse<Store[], StoreResponse>(apiData, error, 'stores');
    }

    // create store data
    static createStoreObject(store_name: string,): Omit<Store, 'id'> {
        return {
            store_name: store_name,
            active: true
        }
    }

    static async createStore(store_name: string,): Promise<StoreResponse> {
        const supabase = createClient();
        const { data: { user },} = await supabase.auth.getUser()

        if (!user || !user.id) {
            return { stores: null, error: 'User id not found' };
        }

        const storeData = this.createStoreObject(store_name,);
        const { data: apiData, error } = await supabase
        .from(TABLE_NAME)
        .insert({...storeData, user_id: user.id})
        .select('id, store_name, active');

        return handleApiResponse<Store[], StoreResponse>(apiData, error, 'stores');
    }

    // update store data
    static async updateStore(store: Store): Promise<StoreResponse> {
        const { data: apiData, error } = await supabase
        .from(TABLE_NAME)
        .update(store) // replace with upsert 
        .eq('id', store.id)
        .select('id, store_name, active');

        return handleApiResponse<Store[], StoreResponse>(apiData, error, 'stores');
    }
}