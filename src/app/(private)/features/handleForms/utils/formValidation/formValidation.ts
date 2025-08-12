import { getDaysInMonth } from '@/app/(private)/utils/dateUtils';
import { FormData } from '@/app/(private)/types/formTypes';

export interface ValidationResult {
    isValid: boolean;
    error?: string;
    value: string;
}

export const PAYMENT_TYPES = ['CASH', 'CARD', "CHECK"].map(type => type.toUpperCase())
export const COMPANIES = ['JETRO', 'SUPREMA'].map(type => type.toUpperCase())

export const getFieldConfig = (tableName: string): Record<string, { type: 'input' | 'select' | 'search' | 'null'; options?: string[] }> => {
    if (tableName === 'expenses') {
        return {
            date: { type: 'input' },
            amount: { type: 'input' },
            detail: { type: 'input' },
            company: { type: 'search', options: COMPANIES }, // todo pull from db 
            payment_type: { type: 'select', options: PAYMENT_TYPES },
        };
    } else if (tableName === 'sales') {
        return {
            date: { type: 'null' },
            sales: { type: 'input' },
            taxes: { type: 'input' },
            daily_total: { type: 'null' },
            cumulative_total: { type: 'null' },
        };
    }
    
    // Default empty config if tableName doesn't match
    return {};
};

// For backward compatibility
export const fieldConfig = getFieldConfig('expenses');

export const isFieldEdited = (
    candidateForm: FormData | undefined,
    displayForm: Record<string, string | number>,
    candidateKey: keyof FormData
): boolean => {
    if (!candidateForm) {
        return false;
    }
    
    return candidateForm[candidateKey] !== displayForm[candidateKey];
};

export const validateDateInput = (
    value: string,
    month: number,
    year: number
): ValidationResult => {
    
    // Handle non-numeric input and leading zeros
    if (!/^\d*$/.test(value) || value === '0') {
        const returnVal = value === '0' ? '' : value.replace(/\D/g, '');
        return {
            isValid: false,
            value: returnVal,
            error: 'Only numeric input with no leading zeros is allowed'
        }
    }

    // Get max days for the given month and year
    const maxDay = getDaysInMonth(month - 1, year);
    
    // Check if date is within valid range
    const dateInRange = 1 <= Number(value) && Number(value) <= maxDay;
    
    if (!dateInRange) {
        return {
            isValid: false,
            value: value,
            error: `Day must be between 1-${maxDay}`
        };
    }

    return {
        isValid: true,
        value: value
    };
};

export const validateAmountInput = (value: string): ValidationResult => {
    // Check for empty string
    if (!value || value.trim() === '') {
        return {
            isValid: false,
            value: value,
            error: "Amount cannot be empty"
        };
    }

    if (value === '00') {
        return {
            isValid: false,
            value: '0',
            error: "Amount cannot be 00"
        };
    }

    // Handle non-numeric input 
    if (!/^\d*\.?\d*$/.test(value)) {
        if ((value.match(/\./g) || []).length > 1) {  // edge case: if there are more than one decimal point
            return {
                isValid: true,
                value: value.replace(/[^\d]/g, '')
            };
        }
        // Remove any non-numeric characters (including the decimal point)
        return {
            isValid: false,
            value: value.replace(/[^\d]/g, ''),
            error: "Only numeric input is allowed"
        };
    }

    const hasDecimal = value.includes('.');
    if (hasDecimal) {
        const parts = value.split('.');
        if (parts.length > 1 && parts[1].length !== 2) {
            return {
                isValid: false,
                value: value,
                error: "Need exactly 2 digits after decimal point"
            };
        }
    }

    return {
        isValid: true,
        value: value
    };
}; 
export const DEFAULT_COMPANY = -1;

export const validateCompanyInput = (value: string): ValidationResult => {
    if (value === "" || value === `${DEFAULT_COMPANY}`) {
        return {
            isValid: false,
            value: `${DEFAULT_COMPANY}`,
            error: "Please select a company"
        };
    }

    return {
        isValid: true,
        value: value
    };
};

// sales page related tasks 

/**
 * Calculates the next day in the month from a given date string.
 * 
 * @param dateStr - Date string in 'YYYY-MM-DD' format
 * @returns The next day as a date string in 'YYYY-MM-DD' format, or '0' if it's the last day of the month
 */
export const getNextDayInMonth = (dateStr: string): string => {
    // Parse the date components
    const [year, month, day] = dateStr.split('-').map(part => parseInt(part, 10));
    
    // Get the number of days in the month
    const daysInMonth = getDaysInMonth(month - 1, year);
    
    // Check if it's the last day of the month
    if (day >= daysInMonth) {
        return '0';
    }
    
    // Calculate the next day
    const nextDay = day + 1;
    
    // Format the next day with leading zeros if needed
    const formattedDay = nextDay < 10 ? `0${nextDay}` : `${nextDay}`;
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    
    // Return the next day in 'YYYY-MM-DD' format
    return `${year}-${formattedMonth}-${formattedDay}`;
};


/**
 * Validates an array of dates to check if they are all from the same month
 * and if all days in the month are present.
 * 
 * @param dates - Array of date strings in 'YYYY-MM-DD' format
 * @param daysInMonth - Number of days in the month
 * @returns "Form complete!" if all dates in the month are present,
 *          the next date (last date + 1) if incomplete,
 *          or "Something went wrong" if dates span multiple months
 */
export const validateDateSequence = (dates: string[], daysInMonth: number): string | number => {
    if (!dates.length) { // first day of month 
        return 1;
    }

    // Extract year and month from date strings (format: 'YYYY-MM-DD')
    const parsedDates = dates.map(dateStr => {
        const [year, month, day] = dateStr.split('-').map(part => parseInt(part, 10));
        return { year, month, day };
    });
    
    // Sort dates by year, month, and day
    parsedDates.sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        if (a.month !== b.month) return a.month - b.month;
        return a.day - b.day;
    });
    
    // Check if all dates are from the same month and year
    const firstDate = parsedDates[0];
    const month = firstDate.month;
    const year = firstDate.year;
    
    const allSameMonth = parsedDates.every(date => 
        date.month === month && date.year === year
    );
    
    if (!allSameMonth) {
        return "Form has mixed months";
    }
    
    // Check if we have all days in the month
    if (parsedDates.length === daysInMonth) {
        // Verify each day is present (1 through daysInMonth)
        const daysPresent = new Set(parsedDates.map(date => date.day));
        
        if (daysPresent.size === daysInMonth && 
            Array.from({ length: daysInMonth }, (_, i) => i + 1).every(day => daysPresent.has(day))) {
            return "Form complete!";
        }
    }
    
    // Find the next day that's missing
    const existingDays = new Set(parsedDates.map(date => date.day));
    
    // Find the first missing day
    for (let day = 1; day <= daysInMonth; day++) {
        if (!existingDays.has(day)) {
            return day;
        }
    }
    
    // If we've entered all days but there's still an issue, check for the next day after the last one
    const lastDate = parsedDates[parsedDates.length - 1];
    
    // Calculate next day without using Date object
    if (lastDate.day < daysInMonth) {
        return lastDate.day + 1;
    } else {
        // We've reached the end of the month
        return "Form complete!";
    }
};
