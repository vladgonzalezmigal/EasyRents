import { Store, StoreResponse } from "@/app/(private)/features/userSettings/types/storeTypes";
import { storeService } from "@/app/(private)/features/userSettings/utils/storeUtils";

export interface StoreSlice {
    storeState: StoreResponse;
    isLoadingStore: boolean;
    isCudStoreLoading: boolean;
    // fetch store data 
    fetchStore: () => Promise<void>;
    updateStore: (store: Store) => Promise<void>;
    createStore: (store_name: string) => Promise<void>;
}

export const createStoreSlice = (
    set: (partial: Partial<StoreSlice> | ((state: StoreSlice) => Partial<StoreSlice>)) => void,
    // get: () => StoreSlice
): StoreSlice => ({
    // initial state
    storeState: { stores: null, error: null },
    isLoadingStore: false,
    isCudStoreLoading: false,
    fetchStore: async () => {
        try {
            set({ isLoadingStore: true });
            const storeData = await storeService.fetchStores();
            set({ storeState: storeData, isLoadingStore: false });
        } catch (err) {
            const errorMessage = err instanceof Error
            ? err.message
            : "Error fetching store data.";
            set({
                isLoadingStore: false,
                storeState: { stores: null, error: errorMessage },
            });
        }
    },

    createStore: async (store_name: string) => {
        try {
            set({ isCudStoreLoading: true });
            const storeData = await storeService.createStore(store_name);
            if (storeData.stores !== null) {
                set((state) => {
                    const currentStores = state.storeState.stores || [];
                    return {
                        isCudStoreLoading: false,
                        storeState: { 
                            stores: [...currentStores, ...(storeData.stores || [])], 
                            error: null 
                        }
                    };
                });
            } else {
                set((state) => ({
                    isCudStoreLoading: false,
                    storeState: { stores: state.storeState.stores, error: storeData.error }
                }));
            }
        } catch (err) {
            const errorMessage = err instanceof Error
            ? err.message
            : "Error creating store data.";
            set({ isCudStoreLoading: false, storeState: { stores: null, error: errorMessage } });
        }
    },

    updateStore: async (store: Store) => {
        try {   
            set({ isCudStoreLoading: true });
            const storeData = await storeService.updateStore(store);
            
            if (storeData.error === null) {
                // Update only the specific vendor in the existing state
                set((state) => {
                    const currentStores = state.storeState.stores || [];
                    const updatedStores = currentStores.map(s => 
                        s.id === store.id ? store : s
                    );
                    
                    return {
                        storeState: {
                            stores: updatedStores,
                            error: null
                        },
                        isCudStoreLoading: false
                    };
                });
            } else {
                // If there was an error, just update the error message
                set((state) => ({
                    isCudStoreLoading: false,
                    storeState: {
                        stores: state.storeState.stores,
                        error: storeData.error
                    }
                }));
            }
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : "Error updating store data.";
            
            // Keep existing vendors but update the error message
            set((state) => ({
                isCudStoreLoading: false,
                storeState: {
                    stores: state.storeState.stores,
                    error: errorMessage
                }
            }));
        }
    }
})