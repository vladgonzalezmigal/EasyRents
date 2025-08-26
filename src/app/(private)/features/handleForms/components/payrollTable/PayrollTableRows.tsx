'use client';

import { Payroll } from '@/app/(private)/types/formTypes';
import PayrollFormRow from '../addDataRow/PayrollFormRow';
import TrashIcon from '@/app/(private)/components/svgs/TrashIcon';
import { ValidationResult } from '../../utils/formValidation/formValidation';
import { ChangeEvent } from 'react';

interface DeleteConfig {
    mode: boolean;
    rows: number[];
    onRowSelect: (id: number) => void;
}

interface EditConfig {
    mode: boolean;
    editedRows: Payroll[];
    validationErrors: Record<number, Set<number>>;
    validationFunction: (key: keyof Payroll, value: string) => ValidationResult;
    onRowEdit: (id: number, field: keyof Payroll, value: string | number, colNumber: number) => void;
}

interface PayrollTableRowsProps {
    data: Payroll[];
    showCreateRow: boolean;
    onCreate?: (id: number, field: keyof Payroll, value: string | number) => void;
    onSubmitCreate: (e: React.FormEvent<HTMLFormElement>) => void;
    cudLoading: boolean;
    deleteConfig?: DeleteConfig;
    editConfig: EditConfig;
}

export default function PayrollTableRows({ 
    data, 
    showCreateRow, 
    onCreate, 
    onSubmitCreate, 
    cudLoading,
    deleteConfig,
    editConfig
}: PayrollTableRowsProps) {
    // Calculate total pay
    const calculateTotalPay = (hours: string | number, minutes: string | number, wageRate: number, wageType: string) => {
        if (wageType === 'hourly') {
            const hoursNum = typeof hours === 'string' ? parseFloat(hours) || 0 : hours;
            const minutesNum = typeof minutes === 'string' ? parseFloat(minutes) || 0 : minutes;
            const totalPay = (hoursNum * wageRate) + (minutesNum * (wageRate / 60));
            return totalPay.toFixed(2);
        } else if (wageType === 'salary') {
            return wageRate.toFixed(2);
        } 
        return '0.00';
    };

    const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, id: number, colNumber: number) => {
        const { name, value } = e.target;
        
        // Convert value to string for validation
        const validationResult = editConfig.validationFunction(name as keyof Payroll, value as string);

        if (validationResult.value) {
            e.target.value = validationResult.value;
        }
        console.log("currentValue", e.target.value);
        // Get the current row
        const currentRow = data.find(row => row.id === id);
        if (!currentRow) return;
        console.log("currentValue after row validation", e.target.value);
        // Update the edited value
        editConfig.onRowEdit(id, name as keyof Payroll, value, colNumber);

        // If hours or minutes are changed, recalculate total pay
        if (name === 'hours' || name === 'minutes') {
            const editedRow = editConfig.editedRows.find(r => r.id === id) || currentRow;
            const newHours = name === 'hours' ? value : editedRow.hours;
            const newMinutes = name === 'minutes' ? value : editedRow.minutes;
            
            const calculatedTotal = calculateTotalPay(
                newHours,
                newMinutes,
                editedRow.wage_rate,
                editedRow.wage_type
            );
            
             // Update total pay
            editConfig.onRowEdit(id, 'total_pay', (parseFloat(calculatedTotal)).toString(), 5);
        }
    };
    
    const totalPay = data.reduce((sum, row) => sum + row.total_pay, 0);
    const alphaData = [...data].sort((a, b) => a.employee_name.localeCompare(b.employee_name));

    return (
        <div className="relative z-10 border border-[#ECECEE] table-input-shadow border-y-2 border-t-0 bg-[#FDFDFD] rounded-bottom relative z-0 py-4">
            <div className="flex flex-col gap-y-3 h-[304px] overflow-y-auto">
                {/* Empty row for future create functionality */}
                {showCreateRow && onCreate && (
                    <PayrollFormRow 
                        onInputChange={onCreate}
                        onSubmit={onSubmitCreate}
                        data={data}
                        cudLoading={cudLoading}
                    />
                )}
                {alphaData.map((row) => {
                    const editedRow = editConfig.editedRows.find(r => r.id === row.id) || row;
                    const rowErrors = editConfig.validationErrors[row.id] || new Set();
                    
                    return (
                        <div key={row.id} className="table-row-style mx-auto relative">
                            <div className="h-[60px] flex flex-col items-center justify-center">
                                <div className='h-[40px] w-[200px] flex items-center pl-3'>
                                    <p className='table-row-text'>{row.employee_name}</p>
                                </div>
                            </div>
                            <div className="h-[60px] flex flex-col items-center justify-center">
                                <div className='h-[40px] w-[100px] flex items-center pl-3'>
                                    <p className='table-row-text'>{row.wage_type}</p>
                                </div>
                            </div>
                            <div className="h-[60px] flex flex-col items-center justify-center">
                                <div className='h-[40px] w-[100px] flex items-center pl-3'>
                                    <p className='table-row-text'>${row.wage_rate.toFixed(2)}</p>
                                </div>
                            </div>
                            {/* Hours & Minutes */}
                            <div className="h-[60px] flex flex-col items-center justify-center">
                                <div className='h-[40px] w-[50px] flex items-center pl-3'>
                                    {editConfig.mode ? (
                                        <input
                                            type="text"
                                            name="hours"
                                            value={editedRow.hours}
                                            onChange={(e) => handleEditChange(e, row.id, 3)}
                                            className={`w-full h-full px-1 border rounded ${
                                                rowErrors.has(3) ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                            }`}
                                            disabled={editedRow.wage_type === 'salary'}
                                        />
                                    ) : (
                                        <p className='table-row-text'>{row.hours}</p>
                                    )}
                                </div>
                            </div>
                            <div className="h-[60px] flex flex-col items-center justify-center">
                                <div className='h-[40px] w-[50px] flex items-center pl-3'>
                                    {/* Minutes */}
                                    {editConfig.mode ? (
                                        <input
                                            type="text"
                                            name="minutes"
                                            value={editedRow.minutes}
                                            onChange={(e) => handleEditChange(e, row.id, 4)}
                                            className={`w-full h-full px-1 border rounded ${
                                                rowErrors.has(4) ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                            }`}
                                            disabled={editedRow.wage_type === 'salary'}
                                        />
                                    ) : (
                                        <p className='table-row-text'>{row.minutes}</p>
                                    )}
                                </div>
                            </div>
                            <div className="h-[60px] flex flex-col items-center justify-center">
                                <div className='h-[40px] w-[100px] flex items-center pl-3'>
                                    {editConfig.mode ? (
                                        <input
                                            type="text"
                                            name="total_pay"
                                            value={editedRow.total_pay}
                                            onChange={(e) => handleEditChange(e, row.id, 5)}
                                            className={`w-full h-full px-1 border rounded ${
                                                rowErrors.has(5) ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                            }`}
                                        />
                                    ) : (
                                        <p className='table-row-text'>${row.total_pay.toFixed(2)}</p>
                                    )}
                                </div>
                            </div>
                            {deleteConfig?.mode && deleteConfig && (
                                <div 
                                    onClick={() => deleteConfig.onRowSelect(row.id)}
                                    className={`cursor-pointer absolute top-1/2 right-[5px] transform -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full ${
                                        deleteConfig.rows.includes(row.id) 
                                            ? 'bg-red-100 border border-red-300' 
                                            : 'bg-[#F6F6F6] border border-[#DFDFDF]'
                                    }`}
                                >
                                    <TrashIcon className={`w-4 h-4 ${
                                        deleteConfig.rows.includes(row.id) 
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
                <div className="rounded-full bg-[#DFDFDF] w-[772px] h-[4px] mx-auto"></div>
                <div className='flex justify-between pl-14 pr-10 text-[24px] py-4 text-[#4A4A4A] font-semibold'>
                    <p>Total</p>
                    <p>${totalPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            </div>
        </div>
    );
}
