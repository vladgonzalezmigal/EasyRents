import { Sales, } from '@/app/(private)/types/formTypes';
import { getMonthDateRange } from '@/app/(private)/utils/dateUtils';
import { fetchSalesData } from '../utils/mailUtils';
import { Company } from "../../features/userSettings/types/CompanyTypes";

interface StoreSalesData {
    storeName: string;
    salesData: Sales[];
}

interface SalesGenerationResult {
    data: StoreSalesData[];
    error?: string;
}

/**
 * Generates PDFs for sales data across multiple stores
 * @async
 * @function generateSalesPdfs
 * @param {number[]} selectedStores - Array of store IDs to generate PDFs for
 * @param {Company[]} stores - Array of store objects containing store information
 * @param {number} currentYear - The year to generate PDFs for
 * @param {number} currentMonth - The month to generate PDFs for (0-11)
 * @returns {Promise<SalesGenerationResult>} Promise resolving to sales generation result
 * @throws {Error} If store is not found or sales data cannot be fetched
 */
export async function generateSalesPdfs(
    selectedStores: number[],
    stores: Company[],
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