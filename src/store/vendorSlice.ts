import { vendorService } from '@/app/(private)/features/userSettings/utils/vendorUtils';
import { Vendor, VendorResponse } from './../app/(private)/features/userSettings/types/vendorTypes';

export interface VendorSlice {
    vendorState: VendorResponse;
    isLoadingVendors: boolean;
    isCudVendorLoading: boolean;
    // fetch vendor data 
    fetchVendorData: () => Promise<void>;
    createVendor: (vendor: string) => Promise<void>;
    updateVendorRow: (vendor: Vendor) => Promise<void>;
}

export const createVendorSlice = (
    set: (partial: Partial<VendorSlice> | ((state: VendorSlice) => Partial<VendorSlice>)) => void,
    // get: () => VendorSlice
): VendorSlice => ({
    // initial state
    vendorState: { vendors: null, error: null },
    isLoadingVendors: false,
    isCudVendorLoading: false,

    fetchVendorData: async () => {
        try {
            set({ isLoadingVendors: true });
            const vendorData = await vendorService.fetchVendors();
            set({ vendorState: vendorData, isLoadingVendors: false });
        } catch (err) {
            const errorMessage = err instanceof Error
            ? err.message
            : "Error fetching vendor data.";
            set({
                isLoadingVendors: false,
                vendorState: { vendors: null, error: errorMessage },
            });
        }
    },

    createVendor: async (vendor_name: string) => {
        try {
            set({ isCudVendorLoading: true });
            const vendorData = await vendorService.createVendor(vendor_name);
            if (vendorData.vendors !== null) {
                set((state) => {
                    const currentVendors = state.vendorState.vendors || [];
                    return {
                        isCudVendorLoading: false,
                        vendorState: { 
                            vendors: [...currentVendors, ...(vendorData.vendors || [])], 
                            error: null 
                        }
                    };
                });
            } else {
                set((state) => ({
                    isCudVendorLoading: false,
                    vendorState: { vendors: state.vendorState.vendors, error: vendorData.error }
                }));
            }
        } catch (err) {
            const errorMessage = err instanceof Error
            ? err.message
            : "Error creating vendor data.";
            set({ isCudVendorLoading: false, vendorState: { vendors: null, error: errorMessage } });
        }
    },
    
    updateVendorRow: async (vendor: Vendor) => {
        try {   
            set({ isCudVendorLoading: true });
            const vendorData = await vendorService.updateVendors(vendor);
            
            if (vendorData.error === null) {
                // Update only the specific vendor in the existing state
                set((state) => {
                    const currentVendors = state.vendorState.vendors || [];
                    const updatedVendors = currentVendors.map(v => 
                        v.id === vendor.id ? vendor : v
                    );
                    
                    return {
                        vendorState: {
                            vendors: updatedVendors,
                            error: null
                        },
                        isCudVendorLoading: false
                    };
                });
            } else {
                // If there was an error, just update the error message
                set((state) => ({
                    isCudVendorLoading: false,
                    vendorState: {
                        vendors: state.vendorState.vendors,
                        error: vendorData.error
                    }
                }));
            }
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : "Error updating vendor data.";
            
            // Keep existing vendors but update the error message
            set((state) => ({
                isCudVendorLoading: false,
                vendorState: {
                    vendors: state.vendorState.vendors,
                    error: errorMessage
                }
            }));
        }
    }
})