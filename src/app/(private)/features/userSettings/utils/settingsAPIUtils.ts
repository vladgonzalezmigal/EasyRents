import { Company, CompanyResponse } from "../types/CompanyTypes";
import { Vendor, VendorResponse } from "../types/vendorTypes";
import { Email, EmailResponse } from "../types/emailTypes";
import { PostgrestError } from "@supabase/supabase-js";
import { Property, PropertyResponse } from "../types/propertyTypes";
import { Tenant, TenantResponse } from "../types/tenantTypes";

export function handleApiResponse<T extends Company[] | Vendor[] | Email[] | Property[] | Tenant[], R extends CompanyResponse | VendorResponse | EmailResponse | PropertyResponse | TenantResponse>(
  apiData: T | null,
  apiError: PostgrestError | null,
  dataType: 'companies' | 'vendors' | 'emails' | 'properties' | 'tenants'
): R {
  if (apiError) {
    if (dataType === 'companies' || dataType === 'tenants') {
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
    } else if (dataType === 'tenants') {
      return { data: apiData as Tenant[], error: null } as R;
  }
    return { vendors: apiData as Vendor[], error: null } as R;
  }
}
