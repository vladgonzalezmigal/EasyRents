export type WageType = 'hourly' | 'salary';

export interface CurrentEmployee { 
    id: number;
    employee_name: string;
    wage_type: WageType;
    wage_rate: number;
    active: boolean;
}

export interface CurrentEmployeeResponse {
    currentEmployees: CurrentEmployee[] | null;
    error: string | null;
}
