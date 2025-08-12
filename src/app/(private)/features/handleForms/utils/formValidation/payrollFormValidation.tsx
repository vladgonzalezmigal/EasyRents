import { ValidationResult } from './formValidation';

export const checkExistingEmployeeName = (value: string, existingNames: string[]): ValidationResult => {
    const trimmedValue = value.trim().toUpperCase();
    
    if (existingNames.includes(trimmedValue)) {
        return {
            isValid: false,
            value: value, // Return original value
            error: 'Employee name already exists'
        };
    }
    
    return {
        isValid: true,
        value: trimmedValue
    };
};

export const validateEmployeeName = (value: string): ValidationResult => {
    const trimmedValue = value.trim();
    
    return {
        isValid: true,
        value: trimmedValue
    };
};

export const validateMinutes = (value: string): ValidationResult => {
    const numValue = parseInt(value);
    
    if (numValue < 0 || numValue > 59) {
        return {
            isValid: false,
            value: value,
            error: 'Minutes must be between 0 and 59'
        };
    }
    
    return {
        isValid: true,
        value: value
    };
};

export const validateHours = (value: string): ValidationResult => {
    
    // Check if the input contains any non-integer characters
    if (!/^\d*$/.test(value)) {
        return {
            isValid: true, // Always return true as requested
            value: value.replace(/\D/g, ''), // Remove any non-digit characters
        };
    }
    
    return {
        isValid: true,
        value: value
    };
};

export const validateTotal = (value: string): ValidationResult => {
    // Check if the value is empty
    if (!value || value.trim() === '') {
        return {
            isValid: false,
            value: value,
            error: "Total cannot be empty"
        };
    }

    // Check if the value has a decimal point
    if (value.includes('.')) {
        return {
            isValid: true,
            value: value
        };
    } else {
        // If there's no decimal, add .00
        return {
            isValid: true,
            value: `${value}.00`
        };
    }
};
