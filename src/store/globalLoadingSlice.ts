export interface GlobalLoadingSlice {
    isGlobalLoading: boolean;
    setGlobalLoading: (loading: boolean) => void;
  }
  
  export const createGlobalLoadingSlice = (
    set: (partial: Partial<GlobalLoadingSlice> | ((state: GlobalLoadingSlice) => Partial<GlobalLoadingSlice>)) => void
  ): GlobalLoadingSlice => ({
    isGlobalLoading: false,
    setGlobalLoading: (loading: boolean) => {
      set({ isGlobalLoading: loading });
    }
  });