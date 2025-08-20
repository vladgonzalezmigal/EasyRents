import { DbResponse } from "./parentTypes";

export interface Tenant { 
    id: number;
    property_id : number;
    first_name: string;
    last_name: string; 
    rent_amount: string; 
    rent_due_date: string
    phone_number: string
    email: string; 
}
export type TenantResponse = DbResponse<Tenant[]>;

// maps property id to tenant 
export type TenantMap = Map<number, Tenant[]>
