import { DbResponse } from "./parentTypes";

export interface Company {
    id: number;
    company_name: string; 
    active: boolean;
}

export type CompanyResponse = DbResponse<Company[]>;