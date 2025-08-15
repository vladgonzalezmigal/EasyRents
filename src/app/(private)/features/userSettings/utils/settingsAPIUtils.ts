import { Company, CompanyResponse } from "../types/CompanyTypes";
import { Vendor, VendorResponse } from "../types/vendorTypes";
import { Email, EmailResponse } from "../types/emailTypes";
import { CurrentEmployee, CurrentEmployeeResponse } from "../types/employeeTypes";
import { PostgrestError } from "@supabase/supabase-js";

export function handleApiResponse<T extends Company[] | Vendor[] | Email[] | CurrentEmployee[], R extends CompanyResponse | VendorResponse | EmailResponse | CurrentEmployeeResponse>(
  apiData: T | null,
  apiError: PostgrestError | null,
  dataType: 'companies' | 'vendors' | 'emails' | 'current_employees'
): R {
  if (apiError) {
    if (dataType === 'companies') {
      return { data : null, error: apiError.message || "Unknown error" } as R;
    } else if (dataType === 'emails') {
      return { emails: null, error: apiError.message || "Unknown error" } as R;
    } else if (dataType === 'current_employees') {
        return { currentEmployees: null, error: apiError.message || "Unknown error" } as R;
    }
    return { vendors: null, error: apiError.message || "Unknown error" } as R;
  } else {
    if (dataType === 'companies') {
      return { data: apiData as Company[], error: null } as R;
    } else if (dataType === 'emails') {
      return { emails: apiData as Email[], error: null } as R;
    } else if (dataType === 'current_employees') {
        return { currentEmployees: apiData as CurrentEmployee[], error: null } as R;
    }
    return { vendors: apiData as Vendor[], error: null } as R;
  }
}
