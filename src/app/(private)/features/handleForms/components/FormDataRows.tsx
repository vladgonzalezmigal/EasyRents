'use client';
import React, { ChangeEvent, ReactNode, useState } from 'react';
import { FormData } from '@/app/(private)/types/formTypes';
import { sumColumn } from '../../utils/analytics';
import { getFieldConfig, isFieldEdited } from '../utils/formValidation/formValidation';
import { EditInputForm } from './editDataRow/EditInputForm';
import { EditSelectForm } from './editDataRow/EditSelectForm';
import { formatDisplayValue } from '../utils/formDataDisplay/formDataDisplay';
import { DeleteConfig, EditConfig } from '../types/configTypes';
import CompanyDropDown from './addDataRow/CompanyDropDown';
import { useStore } from '@/store';
import TrashIcon from '@/app/(private)/components/svgs/TrashIcon';

type FormDataRowsProps = {
    data: FormData[];
    colToSum: number;
    addRowForm?: ReactNode;
    deleteConfig?: DeleteConfig;
    editConfig: EditConfig;
    tableName: string;
};

export function FormDataRows({ data, colToSum, addRowForm, deleteConfig, editConfig, tableName }: FormDataRowsProps) {
    const { vendorState } = useStore();
    const vendors_names = vendorState.vendors?.map(vendor => vendor.vendor_name) || [];
    const vendorMap = vendorState.vendors?.reduce((map, vendor) => {
        map[vendor.id] = vendor.vendor_name;
        return map;
    }, {} as Record<number, string>) || {};
    
    // Change to a map of row IDs to selected company IDs
    const [selectedCompanies, setSelectedCompanies] = useState<Record<number, number>>({});

    const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, id: number, colNumber: number) => {
        const { name, value } = e.target;
        const validationResult = editConfig.validationFunction(name as keyof FormData, value as string);

        if (validationResult.value) {
            e.target.value = validationResult.value;
        }
        editConfig.onRowEdit(id, name as keyof FormData, value, colNumber);
    };

    const reverseVendorMap = vendorState.vendors?.reduce((map, vendor) => {
        map[vendor.vendor_name] = vendor.id;
        return map;
    }, {} as Record<string, number>) || {};

    const handleCompanySelect = (company: string, id: number, colNumber: number, displayKey: keyof FormData) => {
        const vendorId = reverseVendorMap[company];

        if (!vendorId) {
            editConfig.validationErrors[id]?.add(colNumber);
            return;
        }
        
        // Update only the specific row's selected company
        setSelectedCompanies(prev => ({
            ...prev,
            [id]: vendorId
        }));
        
        editConfig.onRowEdit(id, displayKey, vendorId, colNumber);
    };

    const fieldConfig = getFieldConfig(tableName);
    

    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex flex-col gap-y-3 h-[304px] lg:px-4 overflow-y-auto">
                {addRowForm &&
                    <div className={`pt-3 ${(data.length === 0) ? 'h-full w-full flex items-center justify-center' : ''}  `}>
                        {addRowForm}
                    </div>
                }
                {data.map((item) => {
                    // Extract id and only keep the last 5 properties for display
                    const { id, ...rest } = item as { id: number } & Record<string, string | number>;
                    const lastFiveKeys =  Object.keys(rest).slice(-5) as (keyof typeof data[0])[];;
                    const displayData = lastFiveKeys.reduce((obj, key) => {
                        obj[key] = rest[key];
                        return obj;
                    }, {} as Record<string, string | number>);

                    return (
                        <div
                            key={id}
                            className="table-row-style "
                        >
                            {lastFiveKeys.map((displayKey, index) => {
                                return (
                                    <div key={displayKey} className={`h-[60px] flex flex-col items-center justify-center`}>
                                        <div className='h-[40px] w-[100px] flex items-center pl-3'>
                                            {editConfig.mode ? (
                                                fieldConfig[displayKey]?.type === 'null' ? (
                                                    <p className='table-row-text'>
                                                        {formatDisplayValue(displayData[displayKey])}
                                                    </p>
                                                ) : fieldConfig[displayKey]?.type === 'select' ? (
                                                    <EditSelectForm
                                                        name={displayKey as string}
                                                        value={
                                                            editConfig.editedRows.find(row => row.id === id)?.[displayKey] as unknown as string || 
                                                            displayData[displayKey] as string
                                                        }
                                                        onChange={(e) => handleEditChange(e, id, index)}
                                                        hasError={editConfig.validationErrors[id]?.has(index)}
                                                        active={isFieldEdited(editConfig.editedRows.find(row => row.id === id), displayData, displayKey as keyof FormData)}
                                                    />
                                                ) : fieldConfig[displayKey]?.type === 'search' ? (
                                                    <CompanyDropDown
                                                        companies={vendors_names}
                                                        onCompanySelect={(company) => handleCompanySelect(company, id, index, displayKey)}
                                                        error={editConfig.validationErrors[id]?.has(index) ? "Invalid selection" : null}
                                                        vendorMap={vendorMap}
                                                        value={selectedCompanies[id] || -1}
                                                    />
                                                ) : (
                                                    <EditInputForm
                                                        name={displayKey as string}
                                                        placeholder={formatDisplayValue(displayData[displayKey])}
                                                        onChange={(e) => handleEditChange(e, id, index)}
                                                        hasError={editConfig.validationErrors[id]?.has(index)}
                                                        active={isFieldEdited(editConfig.editedRows.find(row => row.id === id), displayData, displayKey as keyof FormData)}
                                                    />
                                                )
                                            ) : (
                                                <p className='table-row-text'>
                                                    {((displayKey as string) === "company") ? vendorMap[displayData[displayKey] as number] : formatDisplayValue(displayData[displayKey])} 
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {deleteConfig?.mode && deleteConfig && (
                                <div 
                                    onClick={() => deleteConfig.onRowSelect(id)}
                                    className={`absolute top-1/2 right-[5px] transform -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full ${
                                        deleteConfig.rows.includes(id) 
                                            ? 'bg-red-100 border border-red-300' 
                                            : 'bg-[#F6F6F6] border border-[#DFDFDF]'
                                    }`}
                                >
                                    <TrashIcon className={`w-4 h-4 ${
                                        deleteConfig.rows.includes(id) 
                                            ? 'text-red-500' 
                                            : 'text-[#585858]'
                                    }`} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div>
                {/* Sum Row  */}
                <div className="rounded-full bg-[#DFDFDF] w-[772px] h-[4px]"></div>
                <div className='flex justify-between pl-14 pr-10 text-[24px] py-4 text-[#4A4A4A] font-semibold'>
                    <p>Total</p>
                    <p>${sumColumn(data, (colToSum + 1)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            </div>
        </div>
    );
}