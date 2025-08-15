import { Company, CompanyResponse } from "@/app/(private)/features/userSettings/types/CompanyTypes";
import { companyService } from "@/app/(private)/features/userSettings/utils/companyUtils";

export interface CompanySlice {
    companyState: CompanyResponse;
    isLoadingCompany: boolean;
    isCudCompanyLoading: boolean;
    fetchCompany: () => Promise<void>;
    updateCompany: (company: Company) => Promise<void>;
    createCompany: (company_name: string) => Promise<void>;
}

export const createCompanySlice = (
    set: (partial: Partial<CompanySlice> | ((state: CompanySlice) => Partial<CompanySlice>)) => void,
): CompanySlice => ({
    companyState: { data: null, error: null }, // initial state
    isLoadingCompany: false,
    isCudCompanyLoading: false,
    fetchCompany: async () => {
        try {
            set({ isLoadingCompany: true });
            const companyData = await companyService.fetchCompanies();
            set({ companyState: companyData, isLoadingCompany: false });
        } catch (err) {
            const errorMessage = err instanceof Error
            ? err.message
            : "Error fetching company data.";
            set({
                isLoadingCompany: false,
                companyState: { data: null, error: errorMessage },
            });
        }
    },

    createCompany: async (company_name: string) => {
        try {
            set({ isCudCompanyLoading: true });
            const companyData = await companyService.createCompany(company_name);
            if (companyData.data !== null) {
                set((state) => {
                    const currentCompanies = state.companyState.data || [];
                    return {
                        isCudCompanyLoading: false,
                        companyState: { 
                            data: [...currentCompanies, ...(companyData.data || [])], 
                            error: null 
                        }
                    };
                });
            } else {
                set((state) => ({
                    isCudCompanyLoading: false,
                    companyState: { data: state.companyState.data, error: companyData.error }
                }));
            }
        } catch (err) {
            const errorMessage = err instanceof Error
            ? err.message
            : "Error creating company data.";
            set({ isCudCompanyLoading: false, companyState: { data: null, error: errorMessage } });
        }
    },

    updateCompany: async (company: Company) => {
        try {   
            set({ isCudCompanyLoading: true });
            const companyData = await companyService.updateCompany(company);
            
            if (companyData.error === null) {
                set((state) => {
                    const currentCompanies = state.companyState.data || [];
                    const updatedCompanies = currentCompanies.map(c => 
                        c.id === company.id ? company : c
                    );
                    
                    return {
                        companyState: {
                            data: updatedCompanies,
                            error: null
                        },
                        isCudCompanyLoading: false
                    };
                });
            } else {
                // If there was an error, just update the error message
                set((state) => ({
                    isCudCompanyLoading: false,
                    companyState: {
                        data: state.companyState.data,
                        error: companyData.error
                    }
                }));
            }
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : "Error updating company data.";
            
            // Keep existing vendors but update the error message
            set((state) => ({
                isCudCompanyLoading: false,
                companyState: {
                    data: state.companyState.data,
                    error: errorMessage
                }
            }));
        }
    }
})