'use client';

import { useState } from 'react';
import { Payroll } from '@/app/(private)/types/formTypes';
import { useStore } from '@/store';
import CurEmployeeBtns from './CurEmployeeBtns';
import PlusIcon from '@/app/(private)/components/svgs/PlusIcon';
import TrashIcon from '@/app/(private)/components/svgs/TrashIcon';

interface CurEmployeeRowsProps {
    newPayrolls: Payroll[];
    setNewPayrolls: React.Dispatch<React.SetStateAction<Payroll[]>>;
    endDate: string;
    onSubmitCreate: (e: React.FormEvent<HTMLFormElement>) => void;
    cudLoading?: boolean;
}

export default function CurEmployeeRows({
    newPayrolls,
    setNewPayrolls,
    endDate,
    onSubmitCreate,
    cudLoading,
}: CurEmployeeRowsProps) {
    const [showCurrentEmployees, setShowCurrentEmployees] = useState(false);
    const { currentEmployeeState } = useStore();

    // Add state for delete mode and rows to delete
    const [deleteMode, setDeleteMode] = useState(false);
    const [rowsToDelete, setRowsToDelete] = useState<number[]>([]);

    const handleUseCurrentEmployees = () => {
        // Get active employees from the store
        const activeEmployees = currentEmployeeState.currentEmployees?.filter(employee => employee.active) || [];

        // Create payroll entries from active employees
        const payrollEntries = activeEmployees.map((employee, index) => ({
            id: index + 1, // Temporary ID for the form
            end_date: endDate,
            employee_name: employee.employee_name,
            wage_type: employee.wage_type,
            wage_rate: employee.wage_rate,
            hours: 0,
            minutes: 0,
            total_pay: employee.wage_type === 'salary' ? employee.wage_rate : 0
        } as Payroll));

        // Update state
        setNewPayrolls(payrollEntries);
        setShowCurrentEmployees(true);
    };

    const handleInputChange = (id: number, field: keyof Payroll, value: string | number) => {
        setNewPayrolls(prev => {
            return prev.map(payroll => {
                if (payroll.id === id) {
                    const updatedPayroll = { ...payroll, [field]: value };

                    // Recalculate total_pay if hours, minutes, or wage_rate changes
                    if (field === 'hours' || field === 'minutes' || field === 'wage_rate') {
                        if (updatedPayroll.wage_type === 'hourly') {
                            const hours = Number(updatedPayroll.hours) || 0;
                            const minutes = Number(updatedPayroll.minutes) || 0;
                            const wageRate = Number(updatedPayroll.wage_rate) || 0;


                            updatedPayroll.total_pay = Number(((hours * wageRate) + (minutes * (wageRate / 60))).toFixed(2));
                            console.log("updatedPayroll.total_pay", updatedPayroll.total_pay);
                        } else if (field === 'wage_rate') {
                            // For salary, total_pay equals wage_rate
                            updatedPayroll.total_pay = typeof value === 'number' ? value : 0;
                        }
                    }

                    return updatedPayroll;
                }
                return payroll;
            });
        });
    };

    const handleSubmit = () => {
        const fakeEvent = new Event('submit') as unknown as React.FormEvent<HTMLFormElement>;
        onSubmitCreate(fakeEvent);
    };

    // Handle delete row selection
    const handleDeleteRowSelect = (id: number) => {
        setRowsToDelete(prev =>
            prev.includes(id)
                ? prev.filter(rowId => rowId !== id)
                : [...prev, id]
        );
    };

    // Toggle delete mode
    const handleToggleDelete = () => {
        setDeleteMode(prev => !prev);
        if (deleteMode) {
            setRowsToDelete([]);
        }
    };

    // Handle delete execution
    const handleDelete = () => {
        if (deleteMode && rowsToDelete.length > 0) {
            // Filter out the rows to delete
            setNewPayrolls(prev => prev.filter(payroll => !rowsToDelete.includes(payroll.id)));
            // Clear delete mode and selection
            setRowsToDelete([]);
            setDeleteMode(false);
        } else {
            // Toggle delete mode
            handleToggleDelete();
        }
    };

    // Calculate total pay
    const totalPay = newPayrolls.reduce((sum, row) => sum + row.total_pay, 0);
    // Sort by alphabetical order
    const sortedNewPayrolls = newPayrolls.sort((a, b) => a.employee_name.localeCompare(b.employee_name));

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-[800px]">
                {/* Header - same as PayrollTable */}
                <div className="px-4 bg-[#F5F5F5] z-30 border border-b-0 border-t-2 border-x-2 border-[#ECECEE] h-[60px] rounded-top header-shadow flex items-center relative z-10">
                    <div className="flex flex-row justify-between bg-[#F5F5F5] w-full px-10">
                        <div className="w-[200px] pl-4">
                            <p className="text-[16px] text-[#80848A]">Employee Name</p>
                        </div>
                        <div className="w-[100px] pl-4">
                            <p className="text-[16px] text-[#80848A]">Wage Type</p>
                        </div>
                        <div className="w-[100px] pl-4">
                            <p className="text-[16px] text-[#80848A]">Wage Rate</p>
                        </div>
                        <div className="w-[50px] pl-4">
                            <p className="text-[16px] text-[#80848A]">Hours</p>
                        </div>
                        <div className="w-[50px] pl-4">
                            <p className="text-[16px] text-[#80848A]">Minutes</p>
                        </div>
                        <div className="w-[100px] pl-4">
                            <p className="text-[16px] text-[#80848A]">Total Pay</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 border border-[#ECECEE] table-input-shadow border-y-2 border-t-0 bg-[#FDFDFD] rounded-bottom relative z-0 py-4">
                    <div className="flex flex-col gap-y-3 h-[304px] overflow-y-auto">
                        {!showCurrentEmployees ? (
                            <div className="h-full flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={handleUseCurrentEmployees}
                                    className="bg-[#DFF4F3] border border-[#8ABBFD] text-[#0C3C74] px-6 py-3 rounded-lg font-semibold hover:bg-[#c1e8e6] transition-colors"
                                >
                                    <PlusIcon className="inline-block mr-2 text-[#8ABBFD] w-5 h-5 pb-1" />
                                    Use Current Employees
                                </button>
                            </div>
                        ) : (
                            sortedNewPayrolls.map((employee) => (
                                <div key={employee.id} className="table-row-style mx-auto relative">
                                    {/* Employee Name (non-editable) */}
                                    <div className="h-[60px] flex flex-col items-center justify-center">
                                        <div className='h-[40px] w-[200px] flex items-center pl-3'>
                                            <p className='table-row-text'>{employee.employee_name}</p>
                                        </div>
                                    </div>

                                    {/* Wage Type (non-editable) */}
                                    <div className="h-[60px] flex flex-col items-center justify-center">
                                        <div className='h-[40px] w-[100px] flex items-center pl-3'>
                                            <p className='table-row-text'>{employee.wage_type}</p>
                                        </div>
                                    </div>

                                    {/* Wage Rate (non-editable) */}
                                    <div className="h-[60px] flex flex-col items-center justify-center">
                                        <div className='h-[40px] w-[100px] flex items-center pl-3'>
                                            <p className='table-row-text'>${employee.wage_rate.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    {/* Hours (editable) */}
                                    <div className="h-[60px] flex flex-col items-center justify-center">
                                        <div className='h-[40px] w-[70px] flex items-center pl-4'>
                                            <input
                                                type="text"
                                                value={employee.hours}
                                                onChange={(e) => {
                                                    // Allow only numbers or empty string
                                                    if (/^\d*$/.test(e.target.value)) {
                                                        handleInputChange(
                                                            employee.id,
                                                            'hours',
                                                            e.target.value ? parseInt(e.target.value) : ''
                                                        );
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    // Set to 0 if empty on blur
                                                    if (!e.target.value) {
                                                        handleInputChange(
                                                            employee.id,
                                                            'hours',
                                                            0
                                                        );
                                                    }
                                                }}
                                                className="payroll-input-field"
                                                placeholder="0"
                                                disabled={employee.wage_type === 'salary' || deleteMode}
                                            />
                                        </div>
                                    </div>

                                    {/* Minutes (editable) */}
                                    <div className="h-[60px] flex flex-col items-center justify-center">
                                        <div className='h-[40px] w-[50px] flex items-center pl-3'>
                                            <input
                                                type="text"
                                                value={employee.minutes}
                                                onChange={(e) => {
                                                    // Allow only numbers 0-59 or empty string
                                                    if (/^\d*$/.test(e.target.value) && (!e.target.value || parseInt(e.target.value) <= 59)) {
                                                        handleInputChange(
                                                            employee.id,
                                                            'minutes',
                                                            e.target.value
                                                        );
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    // Set to 0 if empty on blur
                                                    if (!e.target.value) {
                                                        handleInputChange(
                                                            employee.id,
                                                            'minutes',
                                                            0
                                                        );
                                                    }
                                                }}
                                                className="payroll-input-field"
                                                placeholder="0"
                                                disabled={employee.wage_type === 'salary' || deleteMode}
                                            />
                                        </div>
                                    </div>

                                    {/* Total Pay (editable for advanced cases) */}
                                    <div className="h-[60px] flex flex-col items-center justify-center">
                                        <div className='h-[40px] w-[100px] flex items-center pl-3'>
                                            <input
                                                type="text"
                                                value={employee.total_pay}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    // Allow decimal numbers
                                                    if (/^\d*\.?\d*$/.test(value)) {
                                                        handleInputChange(
                                                            employee.id,
                                                            'total_pay',
                                                            value ? parseFloat(value) : 0
                                                        );
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    if (!e.target.value) {
                                                        handleInputChange(
                                                            employee.id,
                                                            'total_pay',
                                                            0
                                                        );
                                                    } else {
                                                        handleInputChange(
                                                            employee.id,
                                                            'total_pay',
                                                            parseFloat(employee.total_pay.toFixed(2))
                                                        )
                                                    }
                                                }}
                                                className="payroll-input-field"
                                                placeholder="0.00"
                                                disabled={deleteMode}
                                            />
                                        </div>
                                    </div>

                                    {/* Delete Selection Circle */}
                                    {deleteMode && (
                                        <div
                                            onClick={() => handleDeleteRowSelect(employee.id)}
                                            className={`cursor-pointer absolute top-1/2 right-[5px] transform -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full ${rowsToDelete.includes(employee.id)
                                                    ? 'bg-red-100 border border-red-300'
                                                    : 'bg-[#F6F6F6] border border-[#DFDFDF]'
                                                }`}
                                        >
                                            <TrashIcon className={`w-4 h-4 ${rowsToDelete.includes(employee.id)
                                                    ? 'text-red-500'
                                                    : 'text-[#585858]'
                                                }`} />
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Sum Row - always visible */}
                    <div>
                        <div className="rounded-full bg-[#DFDFDF] w-[772px] h-[4px] mx-auto"></div>
                        <div className='flex justify-between pl-14 pr-10 text-[24px] py-4 text-[#4A4A4A] font-semibold'>
                            <p>Total</p>
                            <p>${totalPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                    </div>
                </div>

                {/* Using the updated CurEmployeeBtns component with delete functionality */}
                <CurEmployeeBtns
                    showCurrentEmployees={showCurrentEmployees}
                    onSubmit={handleSubmit}
                    onDelete={handleDelete}
                    cudLoading={cudLoading}
                    deleteMode={deleteMode}
                    canDelete={rowsToDelete.length > 0}
                />
            </div>
        </div>
    );
}
