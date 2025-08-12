import { Sales, Payroll, Expense } from '@/app/(private)/types/formTypes';
import { getMonthDateRange } from '@/app/(private)/utils/dateUtils';
import { fetchSalesData, fetchPayrollData, fetchExpenseData } from '../utils/mailUtils';
import { Store } from "../../features/userSettings/types/storeTypes";

interface StoreSalesData {
    storeName: string;
    salesData: Sales[];
}

interface SalesGenerationResult {
    data: StoreSalesData[];
    error?: string;
}

interface PayrollData {
    startDate: string;
    endDate: string;
    payrollData: Payroll[];
}

interface PayrollGenerationResult {
    data: PayrollData[];
    error?: string;
}

interface ExpenseData {
    expenseName: string;
    expenseData: Expense[];
}

interface ExpenseGenerationResult {
    data: ExpenseData[];
    error?: string;
}

/**
 * Generates PDFs for sales data across multiple stores
 * @async
 * @function generateSalesPdfs
 * @param {number[]} selectedStores - Array of store IDs to generate PDFs for
 * @param {Store[]} stores - Array of store objects containing store information
 * @param {number} currentYear - The year to generate PDFs for
 * @param {number} currentMonth - The month to generate PDFs for (0-11)
 * @returns {Promise<SalesGenerationResult>} Promise resolving to sales generation result
 * @throws {Error} If store is not found or sales data cannot be fetched
 */
export async function generateSalesPdfs(
    selectedStores: number[],
    stores: Store[],
    currentYear: number,
    currentMonth: number,
): Promise<SalesGenerationResult> {
    try {
        const { startDate, endDate } = getMonthDateRange(String(currentYear), String(currentMonth + 1));
        
        // Process each store
        const storePromises = selectedStores.map(async (storeId) => {
            try {
                const store = stores?.find(s => s.id === storeId);
                if (!store) {
                    throw new Error(`Store with ID ${storeId} not found`);
                }
                const salesData = await fetchSalesData(storeId, startDate, endDate);
                if (salesData.error || !salesData.data) {
                    throw new Error(salesData.error || 'An error occurred while fetching sales data');
                }

                return {
                    storeName: store.store_name,
                    salesData: salesData.data as Sales[]
                };
            } catch (error) {
                throw new Error(`Error processing store ${storeId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });

        const results = await Promise.all(storePromises);
        const validResults = results.filter((result): result is StoreSalesData => result !== null);

        if (validResults.length === 0) {
            return {
                data: [],
                error: 'No valid sales data found for the selected stores'
            };
        }

        return {
            data: validResults
        };
    } catch (error) {
        return {
            data: [],
            error: error instanceof Error ? error.message : 'An unexpected error occurred while generating sales PDFs'
        };
    }
}

/**
 * Generates PDFs for expense data
 * @async
 * @function generateExpensePdfs
 * @param {string[]} selectedExpenses - Array of expense types to generate PDFs for
 * @param {number} currentYear - The year to generate PDFs for
 * @param {number} currentMonth - The month to generate PDFs for (0-11)
 * @returns {Promise<ExpenseGenerationResult>} Promise resolving to expense generation result
 * @throws {Error} If expense data cannot be fetched
 */
export async function generateExpensePdfs(
    selectedExpenses: string[],
    currentYear: number,
    currentMonth: number,
): Promise<ExpenseGenerationResult> {
    try {
        const { startDate, endDate } = getMonthDateRange(String(currentYear), String(currentMonth + 1));
        
        // Process each expense type
        const expensePromises = selectedExpenses.map(async (expenseType) => {
            try {
                const expenseData = await fetchExpenseData(startDate, endDate);
                if (expenseData.error || !expenseData.data) {
                    throw new Error(expenseData.error || 'An error occurred while fetching expense data');
                }

                return {
                    expenseName: expenseType,
                    expenseData: expenseData.data
                };
            } catch (error) {
                throw new Error(`Error processing expense ${expenseType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });

        const results = await Promise.all(expensePromises);
        const validResults = results.filter((result): result is ExpenseData => result !== null);

        if (validResults.length === 0) {
            return {
                data: [],
                error: 'No valid expense data found for the selected expenses'
            };
        }

        return {
            data: validResults
        };
    } catch (error) {
        return {
            data: [],
            error: error instanceof Error ? error.message : 'An unexpected error occurred while generating expense PDFs'
        };
    }
}

/**
 * Generates PDFs for payroll data for selected periods
 * @async
 * @function generatePayrollPdfs
 * @param {{startDate: string, endDate: string}[]} selectedPayrolls - Array of payroll periods to generate PDFs for
 * @returns {Promise<PayrollGenerationResult>} Promise resolving to payroll generation result
 * @throws {Error} If payroll data cannot be fetched
 */
export async function generatePayrollPdfs(
    selectedPayrolls: { startDate: string; endDate: string }[],
): Promise<PayrollGenerationResult> {
    try {
        // Process each payroll period
        const payrollPromises = selectedPayrolls.map(async (payroll) => {
            try {
                const payrollData = await fetchPayrollData(payroll.startDate, payroll.endDate);
                if (payrollData.error || !payrollData.data) {
                    throw new Error(payrollData.error || 'An error occurred while fetching payroll data');
                }

                return {
                    startDate: payroll.startDate,
                    endDate: payroll.endDate,
                    payrollData: payrollData.data
                };
            } catch (error) {
                throw new Error(`Error processing payroll period ${payroll.startDate} to ${payroll.endDate}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });

        const results = await Promise.all(payrollPromises);
        const validResults = results.filter((result): result is PayrollData => result !== null);

        if (validResults.length === 0) {
            return {
                data: [],
                error: 'No valid payroll data found for the selected periods'
            };
        }

        return {
            data: validResults
        };
    } catch (error) {
        return {
            data: [],
            error: error instanceof Error ? error.message : 'An unexpected error occurred while generating payroll PDFs'
        };
    }
} 

/**
 * Generates PDFs blobls from pdf docuemnts and returns array of pdf blobs 
 */
    
