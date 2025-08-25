'use client';

import React, { useEffect, useState } from 'react';
import TableTitle from '../handleForms/components/TableTitle';
import { Loading } from '@/app/components/Loading';
import { useParams } from 'next/navigation';
import { ReceivablesService } from './ReceivableService';
import { getMonthDateRange } from '../../utils/dateUtils';
import RentTable from './RentTable';
import { AccountingData, Payable, Receivable } from './rentTypes';
import { useStore } from '@/store';

export default function RentPage() {

    const {propertyState} = useStore()
    const {company_id, year, month } = useParams();
    const [accountingData, setAccountingData] = useState<AccountingData>(new Map());
    const [lastSave, setLastSave] = useState<AccountingData>(new Map())
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [fetchLoading, setFetchLoading] = useState<boolean>(true);
    const {startDate, endDate}= getMonthDateRange(String(year), String(month));

    useEffect(() => {
        const fetchRentData = async () => {
            let newAccountingData: AccountingData = new Map();
            const property_ids : Number[] = propertyState.data.get(Number(company_id))?.filter(c => c.active).map(p => p.id) || []
            console.log("preopty_ids", property_ids)
            const result = await ReceivablesService.fetchReceivables({ startDate, endDate, property_ids});
            if (!result) {
                setFetchError('Failed to fetch receivables.');
                setFetchLoading(false);
                return;
            }
            const { data, error } = result;
            if (error) {
                setFetchError(error);
                setFetchLoading(false);
                return;
            }
            // Group receivables by property_id
            if (data) { 
                const grouped = new Map<number, { property_name: string; receivables: Receivable[]; payables: Payable[] }>();
                data.forEach(r => {
                    if (!grouped.has(r.property_id)) {
                        grouped.set(r.property_id, {
                            property_name: propertyState.data?.get(Number(company_id))?.find(p => p.id === r.property_id)?.address || "not found",
                            receivables: [],
                            payables: [],
                        });
                    }
                    grouped.get(r.property_id)!.receivables.push(r);
                });
                newAccountingData = grouped;
            }
            setLastSave(newAccountingData)
            setAccountingData(newAccountingData);
            setFetchLoading(false);
        }
        fetchRentData();
    }, [startDate, endDate, company_id]);

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
                            month={month as string}
                            year={year as string}
                        />
                        <div className="flex flex-col items-center justify-center">
                            <p className="font-semibold text-[#585858]"> </p>
                            {/* <CudError cudError={cudError} /> */}
                        </div>
                    </div>
                    {/* <div>
                        {fetchError && <div className="text-red-500">{fetchError}</div>}
                    </div> */}

                    {/* Table Component */}
                     <div className={`w-full flex items-center justify-center pb-4`}> 
                        <RentTable accounting_data={accountingData} setAccountingData={setAccountingData} last_save={lastSave} />
                    </div>
                </div>
            )}
        </div>
    );
}
