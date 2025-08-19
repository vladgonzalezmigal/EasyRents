import { Company, CompanyResponse } from "../types/CompanyTypes";
import { Vendor, VendorResponse } from "../types/vendorTypes";
import { Email, EmailResponse } from "../types/emailTypes";
import { CurrentEmployee, CurrentEmployeeResponse } from "../types/employeeTypes";
import { PostgrestError } from "@supabase/supabase-js";
import { Property, PropertyResponse } from "../types/propertyTypes";

export function handleApiResponse<T extends Company[] | Vendor[] | Email[] | Property[], R extends CompanyResponse | VendorResponse | EmailResponse | PropertyResponse>(
  apiData: T | null,
  apiError: PostgrestError | null,
  dataType: 'companies' | 'vendors' | 'emails' | 'properties'
): R {
  if (apiError) {
    if (dataType === 'companies') {
      return { data : null, error: apiError.message || "Unknown error" } as R;
    } else if (dataType === 'emails') {
      return { emails: null, error: apiError.message || "Unknown error" } as R;
    } else if (dataType === 'properties') {
        return { data : null, error: apiError.message || "Unknown error" } as R;
    }
    return { vendors: null, error: apiError.message || "Unknown error" } as R;
  } else {
    if (dataType === 'companies') {
      return { data: apiData as Company[], error: null } as R;
    } else if (dataType === 'emails') {
      return { emails: apiData as Email[], error: null } as R;
    } else if (dataType === 'properties') {
        return { data: apiData as Property[], error: null } as R;
    }
    return { vendors: apiData as Vendor[], error: null } as R;
  }
}
