import { DbResponse } from "./parentTypes";

export interface Property { 
    id: number;
    company_id : number;
    address: string;
    active: boolean; 
}
export type PropertyResponse = DbResponse<Property[]>;

export type PropertyMap = Map<number, Property[]>

