import { Company } from "../../features/userSettings/types/CompanyTypes";
import { AccountingData } from '../../features/rents/types/rentTypes';
import { PropertyMap } from '../../features/userSettings/types/propertyTypes';
import { fetchRents } from '../../features/rents/utils';


interface CompanyAccountingData {
    companyName: string; 
    accountingData: AccountingData
}

interface CompanyAccountingGenerationResult {
    data: CompanyAccountingData[];
    errors?: string[];
}

/**
 * Generates PDFs for sales data across multiple stores
 * @async
 * @function generateSalesPdfs
 * @param { PropertyMap } selectedProperties - Map of company ids to property ids to generate PDFs for
 * @param {Company[]} companies - Array of company objects containing store information
 * @param {string} startDate - Beginning date to search from in YYYY-MM-DD format
 * @param {string} endDate - End date to search from in YYYY-MM-DD format
 * @returns {Promise<CompanyAccountingGenerationResult>} Promise resolving to sales generation result
 * @throws {Error} If store is not found or sales data cannot be fetched
 */
export async function generateCompanyPdfs(
    selectedProperties: PropertyMap,
    companies: Company[],
    startDate: string,
    endDate: string,
    setFetchError:  React.Dispatch<React.SetStateAction<string | null>>,
    setFetchLoading:  React.Dispatch<React.SetStateAction<boolean>>
): Promise<CompanyAccountingGenerationResult> {
    try {
        setFetchLoading(true);
        setFetchError(null);
    
        // Create an array of promises for each company
        const companyPromises = Array.from(selectedProperties.entries()).map(async ([co_id,]) => {
          try {
            const companyId = Number(co_id); // Convert string to number
            const company = companies.find(c => c.id === companyId);
            if (!company) {
              throw new Error(`Company with ID ${co_id} not found`);
            }
    
            const propertyData = await fetchRents({
              propertyData: selectedProperties,
              company_id: companyId,
              startDate,
              endDate,
              setFetchError,
              setFetchLoading,
            });
    
            return {
              companyName: company.company_name,
              accountingData: propertyData as AccountingData,
            };
          } catch (error) {
            const errorMessage = `Error processing company ${co_id}: ${
              error instanceof Error ? error.message : "Unknown error"
            }`;
            setFetchError(errorMessage); // Update UI with error
            throw error; // Rethrow to collect in results
          }
        });
    
        // Wait for all promises, collecting results and errors
        const settledResults = await Promise.allSettled(companyPromises);
        const data: { companyName: string; accountingData: AccountingData }[] = [];
        const errors: string[] = [];
    
        settledResults.forEach((result, index) => {
          if (result.status === "fulfilled") {
            data.push(result.value);
          } else {
            const co_id = Array.from(selectedProperties.keys())[index];
            errors.push(`Company ${co_id}: ${result.reason instanceof Error ? result.reason.message : "Unknown error"}`);
          }
        });
    
        if (errors.length > 0) {
          setFetchError(errors.join("; "));
        }
    
        return { data, errors };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unexpected error generating PDFs";
        setFetchError(errorMessage);
        return { data: [], errors: [errorMessage] };
      } finally {
        setFetchLoading(false);
      }
}

// /**
//  * Generates PDFs for sales data across multiple stores
//  * @async
//  * @function generateSalesPdfs
//  * @param {number[]} selectedStores - Array of store IDs to generate PDFs for
//  * @param {Company[]} stores - Array of store objects containing store information
//  * @param {number} currentYear - The year to generate PDFs for
//  * @param {number} currentMonth - The month to generate PDFs for (0-11)
//  * @returns {Promise<SalesGenerationResult>} Promise resolving to sales generation result
//  * @throws {Error} If store is not found or sales data cannot be fetched
//  */
// export async function generateSalesPdfs(
//     selectedStores: number[],
//     stores: Company[],
//     currentYear: number,
//     currentMonth: number,
// ): Promise<SalesGenerationResult> {
//     try {
//         const { startDate, endDate } = getMonthDateRange(String(currentYear), String(currentMonth + 1));
        
//         // Process each store
//         const storePromises = selectedStores.map(async (storeId) => {
//             try {
//                 const store = stores?.find(s => s.id === storeId);
//                 if (!store) {
//                     throw new Error(`Store with ID ${storeId} not found`);
//                 }
//                 const salesData = await fetchSalesData(storeId, startDate, endDate);
//                 if (salesData.error || !salesData.data) {
//                     throw new Error(salesData.error || 'An error occurred while fetching sales data');
//                 }

//                 return {
//                     storeName: store.store_name,
//                     salesData: salesData.data as Sales[]
//                 };
//             } catch (error) {
//                 throw new Error(`Error processing store ${storeId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
//             }
//         });

//         const results = await Promise.all(storePromises);
//         const validResults = results.filter((result): result is StoreSalesData => result !== null);

//         if (validResults.length === 0) {
//             return {
//                 data: [],
//                 error: 'No valid sales data found for the selected stores'
//             };
//         }

//         return {
//             data: validResults
//         };
//     } catch (error) {
//         return {
//             data: [],
//             error: error instanceof Error ? error.message : 'An unexpected error occurred while generating sales PDFs'
//         };
//     }
// }