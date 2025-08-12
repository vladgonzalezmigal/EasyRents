import { WageType } from "../features/userSettings/types/employeeTypes";

export type Expense = {
    id: number;
    date: string; // Supabase returns date as string
    payment_type: string;
    detail: string;
    company: number;
    amount: number;
};

export interface Sales {
    id: number;
    store_id: number; 
    date: string; // Supabase returns it as string
    sales: number;
    taxes: number; 
};

export interface SalesDisplay extends Sales {
    daily_total: number;
    cumulative_total: number;
}

export type Payroll = {
    id: number;
    end_date: string;
    employee_name: string; // handle repeat names 
    wage_type: WageType;
    wage_rate: number;
    hours: number;
    minutes: number;
    total_pay: number;
};

export type FormData = Expense | Sales | SalesDisplay | Payroll;