'use client'

import { AccountingData, Payable, Receivable, Unoccupied } from "./types/rentTypes";
import { PayablesService } from "./services/PayablesService";
import { ReceivablesService } from './services/ReceivableService';
import { UnoccupiedService } from "./services/UnoccupiedService";
import { PropertyMap } from "../userSettings/types/propertyTypes";

interface fetchRentDataParams {
    propertyData: PropertyMap
    company_id: number
    startDate: string
    endDate: string
    setFetchError:  React.Dispatch<React.SetStateAction<string | null>>
    setFetchLoading:  React.Dispatch<React.SetStateAction<boolean>>
}

export const fetchRents = async ({ propertyData, company_id, startDate, endDate, setFetchError, setFetchLoading}
    : fetchRentDataParams) : Promise<AccountingData> => {
    let newAccountingData: AccountingData = new Map();
    const property_ids: number[] = propertyData.get(Number(company_id))?.filter(c => c.active).map(p => p.id) || []
    const [receivable_result, payable_result, unoccupied_result] = await Promise.all([
        ReceivablesService.fetchReceivables({ startDate, endDate, property_ids }),
        PayablesService.fetchPayables({ startDate, endDate, property_ids }),
        UnoccupiedService.fetchUnoccupied({ startDate, endDate, property_ids })
    ]);

    // Handle receivables error
    if (!receivable_result) {
        setFetchError('Failed to fetch receivables.');
        setFetchLoading(false);
        return newAccountingData;
    }
    const { data: receivableData, error: receivableError } = receivable_result;
    if (receivableError) {
        setFetchError(receivableError);
        setFetchLoading(false);
        return newAccountingData;
    }

    // Handle payables error
    if (!payable_result) {
        setFetchError('Failed to fetch payables.');
        setFetchLoading(false);
        return newAccountingData;
    }
    const { data: payableData, error: payableError } = payable_result;
    if (payableError) {
        setFetchError(payableError);
        setFetchLoading(false);
        return newAccountingData;
    }

    // Handle unoccupied error
    if (!unoccupied_result) {
        setFetchError('Failed to fetch unoccupied records.');
        setFetchLoading(false);
        return newAccountingData;
    }
    const { data: unoccupiedData, error: unoccupiedError } = unoccupied_result;
    if (unoccupiedError) {
        setFetchError(unoccupiedError);
        setFetchLoading(false);
        return newAccountingData;
    }
    
    // Group receivables and payables by property_id
    if (receivableData || payableData || unoccupiedData) {
        const grouped = new Map<number, { property_name: string; unoccupied: Unoccupied[]; receivables: Receivable[]; payables: Payable[] }>();

        property_ids.forEach(property_id => {
            grouped.set(property_id, {
                property_name: propertyData?.get(Number(company_id))?.find(p => p.id === property_id)?.address || "not found",
                unoccupied: [],
                receivables: [],
                payables: [],
            });
        });

        // Process receivables
        if (receivableData) {
            receivableData.forEach(r => {
                if (grouped.has(r.property_id)) {
                    grouped.get(r.property_id)!.receivables.push(r);
                }
            });
        }

        // Process payables
        if (payableData) {
            payableData.forEach(pay => {
                if (grouped.has(pay.property_id)) {
                    grouped.get(pay.property_id)!.payables.push(pay);
                }
            });
        }

        // Process unoccupied records
        if (unoccupiedData) {
            unoccupiedData.forEach(u => {
                if (grouped.has(u.property_id)) {
                    grouped.get(u.property_id)!.unoccupied.push(u);
                }
            });
        }

        newAccountingData = grouped;
    }
    return newAccountingData
}