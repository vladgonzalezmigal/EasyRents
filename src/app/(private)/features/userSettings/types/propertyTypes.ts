import { DbResponse } from "./parentTypes";

export interface Property { 
    id: number;
    company_id : number;
    address: string;
    tenant_name: string;
    tenant_email: string;
    tenant_phone: string;
    rent_amount: number;
    rent_due_date: number;
}
export type PropertyResponse = DbResponse<Property[]>;

export type PropertyMap = Map<number, Property[]>

