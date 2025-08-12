import { CurrentEmployee, CurrentEmployeeResponse, WageType } from "../types/employeeTypes";
import { handleApiResponse } from "./settingsAPIUtils";
import { createClient } from "@/utils/supabase/client";

const TABLE_NAME = 'current_employees';

export class currentEmployeeService {
    static async fetchCurrentEmployeeData(): Promise<CurrentEmployeeResponse> {
        const supabase = createClient();
        // Query the 'stores' table for id and name columns
        const { data: apiData, error } = await supabase
        .from(TABLE_NAME)
        .select('id, employee_name, wage_type, wage_rate, active'); // select auth_id 

        return handleApiResponse<CurrentEmployee[], CurrentEmployeeResponse>(apiData, error, 'current_employees');
    }
    // create current employee

    // create current employee object
    static createCurrentEmployeeObject(name: string, wage_type: WageType, wage_rate: number): Partial<CurrentEmployee> {
        return {
            employee_name: name,
            wage_type: wage_type,
            wage_rate: wage_rate,
            active: true
        }
    }

    static async createCurrentEmployee(name: string, wage_type: WageType, wage_rate: number): Promise<CurrentEmployeeResponse> {
        const supabase = createClient();
        const { data: { user },} = await supabase.auth.getUser()

        if (!user || !user.id) {
            return { currentEmployees: null, error: 'User id not found' };
        }

        const currentEmployeeData = this.createCurrentEmployeeObject(name, wage_type, wage_rate);

        const { data: apiData, error } = await supabase
        .from(TABLE_NAME)
        .insert({...currentEmployeeData, user_id: user.id})
        .select('id, employee_name, wage_type, wage_rate, active');

        return handleApiResponse<CurrentEmployee[], CurrentEmployeeResponse>(apiData, error, 'current_employees');
    }

    

    static async updateCurrentEmployee(currentEmployee: CurrentEmployee): Promise<CurrentEmployeeResponse> {
        const supabase = createClient();
        const { data: apiData, error } = await supabase
        .from(TABLE_NAME)
        .update(currentEmployee) // replace with upsert 
        .eq('id', currentEmployee.id)
        .select('id, employee_name, wage_type, wage_rate, active');

        return handleApiResponse<CurrentEmployee[], CurrentEmployeeResponse>(apiData, error, 'current_employees');
    }

    // delete current employee
    static async deleteCurrentEmployee(id: number): Promise<CurrentEmployeeResponse> {
        const supabase = createClient();
        const { data: { user },} = await supabase.auth.getUser()

        if (!user || !user.id) {
            return { currentEmployees: null, error: 'User id not found' };
        }
        const { data: apiData, error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id', id)
        .select('id, employee_name, wage_type, wage_rate, active');

        return handleApiResponse<CurrentEmployee[], CurrentEmployeeResponse>(apiData, error, 'current_employees');
    }
}
