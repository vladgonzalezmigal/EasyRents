'use client';

import React, { useEffect, useState } from 'react';
import TableTitle from './TableTitle';
import { Loading } from '@/app/components/Loading';
import { useParams } from 'next/navigation';
import { ReceivablesService } from '../services/ReceivableService';
import { getMonthDateRange } from '../../../utils/dateUtils';
import RentTable from './RentTable';
import { AccountingData, Payable, Receivable, deepCopyMap } from '../types/rentTypes';
import { useStore } from '@/store';
import { Property } from '../../userSettings/types/propertyTypes';
import { PayablesService } from '../services/PayablesService';

export default function RentPage() {

    const { propertyState } = useStore()
    const { company_id, year, month } = useParams();
    const [accountingData, setAccountingData] = useState<AccountingData>(new Map());
    const [lastSave, setLastSave] = useState<AccountingData>(new Map())
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [fetchLoading, setFetchLoading] = useState<boolean>(true);
    const { startDate, endDate } = getMonthDateRange(String(year), String(month));

    useEffect(() => {
        const fetchRentData = async () => {
            let newAccountingData: AccountingData = new Map();
            const property_ids: number[] = propertyState.data.get(Number(company_id))?.filter(c => c.active).map(p => p.id) || []
            const [receivable_result, payable_result] = await Promise.all([
                ReceivablesService.fetchReceivables({ startDate, endDate, property_ids }),
                PayablesService.fetchPayables({ startDate, endDate, property_ids })
            ]);

            // Handle receivables error
            if (!receivable_result) {
                setFetchError('Failed to fetch receivables.');
                setFetchLoading(false);
                return;
            }
            const { data: receivableData, error: receivableError } = receivable_result;
            if (receivableError) {
                setFetchError(receivableError);
                setFetchLoading(false);
                return;
            }

            // Handle payables error
            if (!payable_result) {
                setFetchError('Failed to fetch payables.');
                setFetchLoading(false);
                return;
            }
            const { data: payableData, error: payableError } = payable_result;
            if (payableError) {
                setFetchError(payableError);
                setFetchLoading(false);
                return;
            }

            // Group receivables and payables by property_id
            if (receivableData || payableData) {
                const grouped = new Map<number, { property_name: string; receivables: Receivable[]; payables: Payable[] }>();

                // Process receivables
                if (receivableData) {
                    receivableData.forEach(r => {
                        if (!grouped.has(r.property_id)) {
                            grouped.set(r.property_id, {
                                property_name: propertyState.data?.get(Number(company_id))?.find(p => p.id === r.property_id)?.address || "not found",
                                receivables: [],
                                payables: [],
                            });
                        }
                        grouped.get(r.property_id)!.receivables.push(r);
                    });
                }

                // Process payables
                if (payableData) {
                    payableData.forEach(pay => {
                        if (!grouped.has(pay.property_id)) {
                            grouped.set(pay.property_id, {
                                property_name: propertyState.data?.get(Number(company_id))?.find(p => p.id === pay.property_id)?.address || "not found",
                                receivables: [],
                                payables: [],
                            });
                        }
                        grouped.get(pay.property_id)!.payables.push(pay);
                    });
                }

                newAccountingData = grouped;
            }

            setLastSave(deepCopyMap(newAccountingData));
            setAccountingData(newAccountingData);
            setFetchLoading(false);
        }
        fetchRentData();
    }, [startDate, endDate, company_id]);

    const allProperties: Property[] = propertyState.data.get(Number(company_id))?.filter(c => c.active) || []

    const [filteredProperties, setFilteredProperties] = useState<Property[]>(allProperties);

    const handleSearch = (query: string) => {
        if (!query.trim()) {
            setFilteredProperties(allProperties);
            return;
        }
        const queryLower = query.toLowerCase();
        const filtered = allProperties.filter(p =>
            p.address.toLowerCase().includes(queryLower)
        );
        setFilteredProperties(filtered);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            {fetchLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                    <Loading />
                </div>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-y-1 ">
                    {/* Title */}
                    <div className="w-full text-center flex flex-col items-center pt-4">
                        <TableTitle
                            onSearch={handleSearch}
                            month={month as string}
                            year={year as string}
                        />
                        <div className="flex flex-col items-center justify-center">
                            <p className="font-semibold text-[#585858]"> </p>
                            {/* <CudError cudError={cudError} /> */}
                        </div>
                    </div>
                    <div>
                        {fetchError && <div className="text-red-500">{fetchError}</div>}
                    </div>
                    {/* Table Component */}
                    <div className={`w-full flex items-center justify-center pb-4`}>
                        <RentTable accounting_data={accountingData} setAccountingData={setAccountingData} last_save={lastSave} setLastSave={setLastSave} filtered_property_ids={filteredProperties.map(p => p.id)} />
                    </div>
                </div>
            )}
        </div>
    );
}
