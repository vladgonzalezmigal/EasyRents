'use client';

import React, { useEffect, useState } from 'react';
import TableTitle from './TableTitle';
import { Loading } from '@/app/components/Loading';
import { useParams } from 'next/navigation';
import { getMonthDateRange } from '../../../utils/dateUtils';
import RentTable from './RentTable';
import { AccountingData, deepCopyMap } from '../types/rentTypes';
import { useStore } from '@/store';
import { Property } from '../../userSettings/types/propertyTypes';
import { fetchRents } from '../utils';

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
            const propertyData = propertyState.data 
            let newAccountingData: AccountingData = new Map();
            newAccountingData = await fetchRents({propertyData: propertyData, company_id: Number(company_id), startDate: startDate, endDate: endDate, setFetchError: setFetchError, setFetchLoading: setFetchLoading})
            console.log("accounting Data",newAccountingData )
            setLastSave(deepCopyMap(newAccountingData));
            setAccountingData(newAccountingData);
            setFetchLoading(false);
        }
        fetchRentData();
    }, [startDate, endDate, company_id, propertyState.data]);

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
                        <RentTable accounting_data={accountingData} setAccountingData={setAccountingData} last_save={lastSave} setLastSave={setLastSave} filtered_property_ids={filteredProperties.map(p => p.id)}  setFetchLoading={setFetchLoading}
                         setFetchError={setFetchError} />
                    </div>
                </div>
            )}
        </div>
    );
}
