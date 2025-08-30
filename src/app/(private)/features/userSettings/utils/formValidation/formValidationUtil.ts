// company form validation

import { Company } from "../../types/CompanyTypes";

interface ValidationResult {
    isValid: boolean;
    message?: string;
}

export const companyFormValidation = {
    isCompanyNameEmpty: (company: Company | undefined): ValidationResult => {
        if (!company?.company_name || company.company_name.trim() === '') {
            return {
                isValid: false,
                message: 'Company name cannot be empty'
            };
        }
        return { isValid: true };
    },
    
    isCompanyNameDuplicate: (company: Company | undefined, existingStores: string[], originalStoreName: string): ValidationResult => {
        if (!company?.company_name) {
            return { isValid: true };
        }
        
        const normalizedStoreName = company.company_name.trim().toUpperCase();
        if (existingStores.includes(normalizedStoreName) && normalizedStoreName !== originalStoreName) {
            return {
                isValid: false,
                message: 'Company name already exists'
            };
        }
        return { isValid: true };
    },

    validateCompanyForm: (store: Company | undefined, existingStores: string[], originalStoreName: string): ValidationResult => {
        const nameValidation = companyFormValidation.isCompanyNameEmpty(store);
        if (!nameValidation.isValid) {
            return nameValidation;
        }
        
        const duplicateValidation = companyFormValidation.isCompanyNameDuplicate(store, existingStores, originalStoreName);
        if (!duplicateValidation.isValid) {
            return duplicateValidation;
        }

        return { isValid: true };
    }
}; 