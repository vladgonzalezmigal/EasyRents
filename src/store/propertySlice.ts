import { PropertyMap } from "@/app/(private)/features/userSettings/types/propertyTypes";
import { PropertyService } from "@/app/(private)/features/userSettings/utils/propertyUtils";
import { CompanySlice } from "./companySlice";
import { TenantSlice } from "./tenantSlice";

export interface PropertySlice {
    propertyState: {data: PropertyMap, error: string | null};
    isLoadingProperties: boolean;
    isCudLoadingProperties: boolean;
    fetchProperties: () => Promise<void>;
    createProperty: (company_id: number, address: string, tenants?: Array<{
        first_name: string;
        last_name: string;
        rent_amount: string;
        rent_due_date: string;
        phone_number: string;
        email: string;
    }>) => Promise<void>;
    // updateCurrentEmployees: (currentEmployee: CurrentEmployee) => Promise<void>;
    // deleteCurrentEmployee: (employeeId: number) => Promise<void>;
}

export const createPropertySlice = (
    set: (partial: Partial<PropertySlice> | ((state: PropertySlice) => Partial<PropertySlice>)) => void,
    get: () => CompanySlice & TenantSlice
): PropertySlice => ({
    // initial state
    propertyState: { data : new Map(), error: null },
    isLoadingProperties: false,
    isCudLoadingProperties : false,

    fetchProperties: async () => {
        try {
            set({ isLoadingProperties: true });
            const company_ids = get().companyState.data?.map(company => company.id) || [];
            const property_data = new Map()
            const currentPropertyData = await PropertyService.fetchProperties();
            for (const company_id of company_ids) {
                property_data.set(company_id, currentPropertyData.data?.filter(prop => prop.company_id === company_id) || []);
            }
            set({ propertyState: { data: property_data, error: null }, isLoadingProperties: false });
            set({ isLoadingProperties: false });
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : `Error fetching property data.`;
            set({
                isLoadingProperties: false,
                propertyState: { data: new Map(), error: errorMessage }
            });
        }
    },

    createProperty: async (company_id: number, address: string, tenants?: Array<{
        first_name: string;
        last_name: string;
        rent_amount: string;
        rent_due_date: string;
        phone_number: string;
        email: string;
    }>) => {
        try {
            set({ isCudLoadingProperties: true });
            const response = await PropertyService.createProperty(company_id, address);
            
            if (response.error === null && response.data !== null) {
                set((state) => {
                    const properties = new Map(state.propertyState.data);
                    const newProperty = response.data?.[0];
                    if (!newProperty) return state;
                    const prevData = properties.get(company_id) || [];
                    properties.set(company_id, [...prevData, newProperty]);
                    
                    // Call createTenants if tenants are provided
                    if (tenants && tenants.length > 0) {
                        const tenantsWithPropertyId = tenants.map(tenant => ({
                            ...tenant,
                            property_id: newProperty.id
                        }));
                        
                        get().createTenants(tenantsWithPropertyId);
                    }
                    
                    return {
                        propertyState: {
                            data: properties,
                            error: null
                        },
                        isCudLoadingProperties: false
                    };
                });
            } else {
                // If there was an error, just update the error message
                set((state) => ({
                    isCudLoadingProperties: false,
                    propertyState: {
                        data: state.propertyState.data,
                        error: response.error
                    }
                }));
            }
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : "Error creating property data.";
            
            // Keep existing employees but update the error message
            set((state) => ({
                isCudLoadingProperties: false,
                propertyState: {
                    data: state.propertyState.data,
                    error: errorMessage
                }
            }));
        }
    },

    // updateCurrentEmployees: async (currentEmployee: CurrentEmployee) => {
    //     try {   
    //         set({ isCudLoadingProperties: true });
    //         const currentEmployeeData = await currentEmployeeService.updateCurrentEmployee(currentEmployee)
            
    //         if (currentEmployeeData.error === null) {
    //             // Update only the specific current employee in the existing state
    //             set((state) => {
    //                 const currentEmployees = state.propertyState.currentEmployees || [];
    //                 const updatedCurrentEmployees = currentEmployees.map(e => 
    //                     e.id === currentEmployee.id ? currentEmployee : e
    //                 );
                    
    //                 return {
    //                     propertyState: {
    //                         currentEmployees: updatedCurrentEmployees,
    //                         error: null
    //                     },
    //                     isCudLoadingProperties: false
    //                 };
    //             });
    //         } else {
    //             // If there was an error, just update the error message
    //             set((state) => ({
    //                 isCudLoadingProperties: false,
    //                 propertyState: {
    //                     currentEmployees: state.propertyState.currentEmployees,
    //                     error: currentEmployeeData.error
    //                 }
    //             }));
    //         }
    //     } catch (err) {
    //         const errorMessage = err instanceof Error
    //             ? err.message
    //             : "Error updating employee data.";
            
    //         // Keep existing employees but update the error message
    //         set((state) => ({
    //             isCudLoadingProperties: false,
    //             propertyState: {
    //                 currentEmployees: state.propertyState.currentEmployees,
    //                 error: errorMessage
    //             }
    //         }));
    //     }
    // },

    // deleteCurrentEmployee: async (employeeId: number) => {
    //     try {
    //         set({ isCudLoadingProperties: true });
    //         const response = await currentEmployeeService.deleteCurrentEmployee(employeeId);
            
    //         if (response.error === null) {
    //             // Remove the deleted employee from the state
    //             set((state) => {
    //                 const currentEmployees = state.propertyState.currentEmployees || [];
    //                 const filteredEmployees = currentEmployees.filter(e => e.id !== employeeId);
                    
    //                 return {
    //                     propertyState: {
    //                         currentEmployees: filteredEmployees,
    //                         error: null
    //                     },
    //                     isCudLoadingProperties: false
    //                 };
    //             });
    //         } else {
    //             // If there was an error, just update the error message
    //             set((state) => ({
    //                 isCudLoadingProperties: false,
    //                 propertyState: {
    //                     currentEmployees: state.propertyState.currentEmployees,
    //                     error: response.error
    //                 }
    //             }));
    //         }
    //     } catch (err) {
    //         const errorMessage = err instanceof Error
    //             ? err.message
    //             : "Error deleting employee data.";
            
    //         // Keep existing employees but update the error message
    //         set((state) => ({
    //             isCudLoadingProperties: false,
    //             propertyState: {
    //                 currentEmployees: state.propertyState.currentEmployees,
    //                 error: errorMessage
    //             }
    //         }));
    //     }
    // }
})
