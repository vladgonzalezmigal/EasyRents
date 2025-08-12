import { Sales, SalesDisplay } from "@/app/(private)/types/formTypes";

/**
 * Utility functions for formatting and displaying form data
 */

/**
 * Formats display values for rendering in the form data rows
 * @param value - The value to format, can be a string or number
 * @returns A formatted string representation of the value
 * - For numbers: returns a dollar-formatted string with 2 decimal places
 * - For strings: returns the string value or empty string if null/undefined
 */
export const formatDisplayValue = (value: string | number): string => {
    if (typeof value === 'number') {
        return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return value?.toString() || '';
};

/**
 * Formats sales data for display
 * @param sales - The raw data to format in descending order (newest first)
 * @returns An array of sales data for the display table with cumulative totals starting from earliest date
 */
export const formatSalesData = (sales: Sales[]): SalesDisplay[] => {
    // Create a reversed copy to calculate cumulative totals from earliest to latest
    const reversedSales = [...sales].reverse();
    
    // Calculate cumulative totals from earliest to latest
    const cumulativeTotals: number[] = [];
    let runningTotal = 0;
    
    reversedSales.forEach((sale) => {
        const daily_total = Number((sale.sales + sale.taxes).toFixed(2));
        runningTotal = Number((runningTotal + daily_total).toFixed(2));
        cumulativeTotals.push(runningTotal);
    });
    
    // Reverse back to match original order and map to final format
    cumulativeTotals.reverse();
    
    return sales.map((sale, index) => {
        const daily_total = Number((sale.sales + sale.taxes).toFixed(2));
        
        return {
            ...sale,
            daily_total,
            cumulative_total: cumulativeTotals[index]
        };
    });
};






