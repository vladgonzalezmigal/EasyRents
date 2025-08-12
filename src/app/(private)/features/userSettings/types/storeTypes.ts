export interface Store {
    id: number;
    store_name: string; 
    active: boolean;
}

export interface StoreResponse {
    stores: Store[] | null;
    error: string | null;
}