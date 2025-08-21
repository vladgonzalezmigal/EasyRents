import { TenantMap } from "@/app/(private)/features/userSettings/types/tenantTypes";
import { TenantService } from "@/app/(private)/features/userSettings/utils/tenantUtils";

export interface TenantSlice {
    tenantState: {data: TenantMap, error: string | null};
    isLoadingTenants: boolean;
    isCudLoadingTenants: boolean;
    fetchTenants: () => Promise<void>;
    createTenant: (property_id: number, first_name: string, last_name: string, rent_amount: string, rent_due_date: string, phone_number: string, email: string) => Promise<void>;
    createTenants: (tenants: Array<{
        property_id: number;
        first_name: string;
        last_name: string;
        rent_amount: string;
        rent_due_date: string;
        phone_number: string;
        email: string;
    }>) => Promise<void>;
    deleteAllTenants: (propertyIds: number[]) => Promise<void>;
    deleteTenants: (propertyId: number, tenantIds: number[]) => Promise<void>;
}

export const createTenantSlice = (
    set: (partial: Partial<TenantSlice> | ((state: TenantSlice) => Partial<TenantSlice>)) => void,
): TenantSlice => ({
    // initial state
    tenantState: { data: new Map(), error: null },
    isLoadingTenants: false,
    isCudLoadingTenants: false,

    fetchTenants: async () => {
        try {
            set({ isLoadingTenants: true });
            const tenantData = await TenantService.fetchTenants();
            
            if (tenantData.error === null && tenantData.data !== null) {
                const tenantMap = new Map();
                
                // Group tenants by property_id
                for (const tenant of tenantData.data) {
                    const propertyId = tenant.property_id;
                    const existingTenants = tenantMap.get(propertyId) || [];
                    tenantMap.set(propertyId, [...existingTenants, tenant]);
                }
                
                set({ tenantState: { data: tenantMap, error: null }, isLoadingTenants: false });
            } else {
                set({
                    isLoadingTenants: false,
                    tenantState: { data: new Map(), error: tenantData.error }
                });
            }
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : `Error fetching tenant data.`;
            set({
                isLoadingTenants: false,
                tenantState: { data: new Map(), error: errorMessage }
            });
        }
    },

    createTenant: async (property_id: number, first_name: string, last_name: string, rent_amount: string, rent_due_date: string, phone_number: string, email: string) => {
        try {
            set({ isCudLoadingTenants: true });
            const response = await TenantService.createTenant(property_id, first_name, last_name, rent_amount, rent_due_date, phone_number, email);
            
            if (response.error === null && response.data !== null) {
                set((state) => {
                    const tenants = new Map(state.tenantState.data);
                    const newTenant = response.data?.[0];
                    if (!newTenant) return state;
                    
                    const prevData = tenants.get(property_id) || [];
                    tenants.set(property_id, [...prevData, newTenant]);
                    
                    return {
                        tenantState: {
                            data: tenants,
                            error: null
                        },
                        isCudLoadingTenants: false
                    };
                });
            } else {
                set((state) => ({
                    isCudLoadingTenants: false,
                    tenantState: {
                        data: state.tenantState.data,
                        error: response.error
                    }
                }));
            }
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : "Error creating tenant data.";
            
            set((state) => ({
                isCudLoadingTenants: false,
                tenantState: {
                    data: state.tenantState.data,
                    error: errorMessage
                }
            }));
        }
    },

    createTenants: async (tenants: Array<{
        property_id: number;
        first_name: string;
        last_name: string;
        rent_amount: string;
        rent_due_date: string;
        phone_number: string;
        email: string;
    }>) => {
        try {
            set({ isCudLoadingTenants: true });
            const response = await TenantService.createTenants(tenants);
            
            if (response.error === null && response.data !== null) {
                set((state) => {
                    const tenantMap = new Map(state.tenantState.data);
                    
                    // Add all new tenants to the map
                    for (const newTenant of response.data || []) {
                        const propertyId = newTenant.property_id;
                        const prevData = tenantMap.get(propertyId) || [];
                        tenantMap.set(propertyId, [...prevData, newTenant]);
                    }
                    
                    return {
                        tenantState: {
                            data: tenantMap,
                            error: null
                        },
                        isCudLoadingTenants: false
                    };
                });
            } else {
                set((state) => ({
                    isCudLoadingTenants: false,
                    tenantState: {
                        data: state.tenantState.data,
                        error: response.error
                    }
                }));
            }
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : "Error creating tenants data.";
            
            set((state) => ({
                isCudLoadingTenants: false,
                tenantState: {
                    data: state.tenantState.data,
                    error: errorMessage
                }
            }));
        }
    },
    // delete all tenants for a given property
    deleteAllTenants: async (propertyIds: number[]) => {
        try {
            set({ isCudLoadingTenants: true });
            const response = await TenantService.deleteAllTenants(propertyIds);
            
            if (response.error === null && response.data !== null) {
                set((state) => {
                    const tenantMap = new Map(state.tenantState.data);
                    
                    // Remove all tenants associated with the deleted properties
                    for (const [propertyId,] of tenantMap.entries()) {
                        if (propertyIds.includes(propertyId)) {
                            tenantMap.delete(propertyId);
                        }
                    }
                    
                    return {
                        tenantState: {
                            data: tenantMap,
                            error: null
                        },
                        isCudLoadingTenants: false
                    };
                });
            } else {
                set((state) => ({
                    isCudLoadingTenants: false,
                    tenantState: {
                        data: state.tenantState.data,
                        error: response.error
                    }
                }));
            }
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : "Error deleting tenant data.";
            
            set((state) => ({
                isCudLoadingTenants: false,
                tenantState: {
                    data: state.tenantState.data,
                    error: errorMessage
                }
            }));
        }
    },

    // delete specific tenants by id for a single property
    deleteTenants: async (propertyId: number, tenantIds: number[]) => {
        try {
            set({ isCudLoadingTenants: true });
            const response = await TenantService.deleteTenants(propertyId, tenantIds);
            
            if (response.error === null) {
                set((state) => {
                    const tenantMap = new Map(state.tenantState.data);
                    const existing = tenantMap.get(propertyId) || [];
                    const remaining = existing.filter(t => !tenantIds.includes(t.id));
                    if (remaining.length > 0) {
                        tenantMap.set(propertyId, remaining);
                    } else {
                        tenantMap.delete(propertyId);
                    }

                    return {
                        tenantState: { data: tenantMap, error: null },
                        isCudLoadingTenants: false
                    };
                });
            } else {
                set((state) => ({
                    isCudLoadingTenants: false,
                    tenantState: { data: state.tenantState.data, error: response.error }
                }));
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error deleting selected tenants.';
            set((state) => ({
                isCudLoadingTenants: false,
                tenantState: { data: state.tenantState.data, error: errorMessage }
            }));
        }
    },
});
