import { Vendor } from '@/app/(private)/features/userSettings/types/vendorTypes';
import { Company } from '@/app/(private)/features/userSettings/types/CompanyTypes';

interface ValidationResult {
    isValid: boolean;
    message?: string;
}

export const vendorFormValidation = {
    isVendorNameEmpty: (vendor: Vendor | undefined): ValidationResult => {
        if (!vendor?.vendor_name || vendor.vendor_name.trim() === '') {
            return {
                isValid: false,
                message: 'Vendor name cannot be empty'
            };
        }
        return { isValid: true };
    },
    
    isVendorNameDuplicate: (vendor: Vendor | undefined, existingVendors: string[], originalVendorName: string): ValidationResult => {
        if (!vendor?.vendor_name) {
            return { isValid: true };
        }
        
        const normalizedVendorName = vendor.vendor_name.trim().toUpperCase();
        if (existingVendors.includes(normalizedVendorName) && normalizedVendorName !== originalVendorName) {
            return {
                isValid: false,
                message: 'Vendor name already exists'
            };
        }
        return { isValid: true };
    },

    validateVendorForm: (vendor: Vendor | undefined, existingVendors: string[], originalVendorName: string): ValidationResult => {
        const nameValidation = vendorFormValidation.isVendorNameEmpty(vendor);
        if (!nameValidation.isValid) {
            return nameValidation;
        }
        
        const duplicateValidation = vendorFormValidation.isVendorNameDuplicate(vendor, existingVendors, originalVendorName);
        if (!duplicateValidation.isValid) {
            return duplicateValidation;
        }

        return { isValid: true };
    }
}; 

// store form validation

export const storeFormValidation = {
    isStoreNameEmpty: (company: Company | undefined): ValidationResult => {
        if (!company?.company_name || company.company_name.trim() === '') {
            return {
                isValid: false,
                message: 'Store name cannot be empty'
            };
        }
        return { isValid: true };
    },
    
    isStoreNameDuplicate: (store: Company | undefined, existingStores: string[], originalStoreName: string): ValidationResult => {
        if (!store?.company_name) {
            return { isValid: true };
        }
        
        const normalizedStoreName = store.company_name.trim().toUpperCase();
        if (existingStores.includes(normalizedStoreName) && normalizedStoreName !== originalStoreName) {
            return {
                isValid: false,
                message: 'Company name already exists'
            };
        }
        return { isValid: true };
    },

    validateStoreForm: (store: Company | undefined, existingStores: string[], originalStoreName: string): ValidationResult => {
        const nameValidation = storeFormValidation.isStoreNameEmpty(store);
        if (!nameValidation.isValid) {
            return nameValidation;
        }
        
        const duplicateValidation = storeFormValidation.isStoreNameDuplicate(store, existingStores, originalStoreName);
        if (!duplicateValidation.isValid) {
            return duplicateValidation;
        }

        return { isValid: true };
    }
}; 