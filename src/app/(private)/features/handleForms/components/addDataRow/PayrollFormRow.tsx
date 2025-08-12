'use client';

import { ChangeEvent, useRef, useState } from 'react';
import { Payroll } from '@/app/(private)/types/formTypes';
import { validateEmployeeName, checkExistingEmployeeName, validateMinutes } from '../../utils/formValidation/payrollFormValidation';
import PlusIcon from '@/app/(private)/components/svgs/PlusIcon';
import { validateAmountInput } from '../../utils/formValidation/formValidation';

interface PayrollFormRowProps {
    onInputChange: (id: number, name: keyof Payroll, value: string | number) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    data: Payroll[];
    cudLoading: boolean;
}

const WAGE_TYPES = ['hourly', 'salary'] as const;

export default function PayrollFormRow({ onInputChange, onSubmit, data, cudLoading }: PayrollFormRowProps) {
    // Create array of existing employee names
    const existingEmployeeNames = data.map(row => row.employee_name);

    // State for each field
    const [employeeName, setEmployeeName] = useState('');
    const [wageType, setWageType] = useState<typeof WAGE_TYPES[number]>('hourly');
    const [wageRate, setWageRate] = useState('');
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');
    const [totalPay, setTotalPay] = useState('');

    // calculate total pay
    const calculateTotalPay = (hours: string, minutes: string, wageRate: string, wageType: string) => {
        if (wageType === 'hourly') {
            const hoursNum = parseFloat(hours) || 0;
            const minutesNum = parseFloat(minutes) || 0;
            const wageRateNum = parseFloat(wageRate) || 0;
            const totalPay = (hoursNum * wageRateNum) + (minutesNum * (wageRateNum / 60));
            return totalPay.toFixed(2);
        } else if (wageType === 'salary') {
            const wageRateNum = parseFloat(wageRate) || 0;
            const totalPay = wageRateNum;
            return totalPay.toFixed(2);
        }
        return '0.00';
    };

    // Validation states
    const [employeeNameError, setEmployeeNameError] = useState<string | null>(null);
    const [wageRateError, setWageRateError] = useState<string | null>(null);
    const [hoursError, setHoursError] = useState<string | null>(null);
    const [minutesError, setMinutesError] = useState<string | null>(null);
    const [totalPayError, setTotalPayError] = useState<string | null>(null);

    const handleEmployeeNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase();
        const existingCheck = checkExistingEmployeeName(value, existingEmployeeNames);
        
        if (existingCheck.isValid) {
            setEmployeeName(value);
            onInputChange(1, 'employee_name', value);
            setEmployeeNameError(null);
        } else {
            setEmployeeName(value);
            setEmployeeNameError(existingCheck.error || null);
        }
    };

    const handleEmployeeNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const validationResult = validateEmployeeName(e.target.value);
        const existingCheck = checkExistingEmployeeName(validationResult.value, existingEmployeeNames);
        
        if (validationResult.isValid && existingCheck.isValid) {
            const value = validationResult.value.toUpperCase();
            setEmployeeName(value);
            onInputChange(1, 'employee_name', value);
            setEmployeeNameError(null);
        } else {
            setEmployeeNameError(existingCheck.error || validationResult.error || null);
        }
    };

    const handleWageTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as typeof WAGE_TYPES[number];
        setWageType(value);
        onInputChange(1, 'wage_type', value);
        
        // Reset hours and minutes if salary is selected
        if (value === 'salary') {
            setHours('0');
            setMinutes('0');
            onInputChange(1, 'hours', 0);
            onInputChange(1, 'minutes', 0);
        }
        
        // Calculate total pay when wage type changes
        const calculatedTotal = calculateTotalPay(
            value === 'salary' ? '0' : hours, 
            value === 'salary' ? '0' : minutes, 
            wageRate, 
            value
        );
        setTotalPay(calculatedTotal);
        onInputChange(1, 'total_pay', calculatedTotal ? parseFloat(calculatedTotal) : 0);
    };

    const handleWageRateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const validation = validateAmountInput(value);

        if (validation.isValid) {
            setWageRateError(null);
            setWageRate(validation.value);
            onInputChange(1, 'wage_rate', validation.value ? parseFloat(validation.value) : 0);
            
            // Calculate total pay when wage rate changes and is valid
            const calculatedTotal = calculateTotalPay(hours, minutes, validation.value, wageType);
            setTotalPay(calculatedTotal);
            onInputChange(1, 'total_pay', calculatedTotal ? parseFloat(calculatedTotal) : 0);
        } else {
            setWageRate(validation.value);
            setWageRateError(validation.error || null);
        }
    };

    const handleHoursChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Only allow whole numbers
        if (/^\d*$/.test(value)) {
            setHours(value);
            onInputChange(1, 'hours', value ? parseInt(value) : 0);
            setHoursError(null);
            
            // Calculate total pay when hours change and are valid
            const calculatedTotal = calculateTotalPay(value, minutes, wageRate, wageType);
            setTotalPay(calculatedTotal);
            onInputChange(1, 'total_pay', calculatedTotal ? parseFloat(calculatedTotal) : 0);
        }
    };

    const handleMinutesChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Only allow numbers
        if (/^\d*$/.test(value)) {
            const validationResult = validateMinutes(value);
            setMinutes(value);
            onInputChange(1, 'minutes', value ? parseInt(value) : 0);
            setMinutesError(validationResult.isValid ? null : validationResult.error || null);
            
            // Calculate total pay when minutes change and are valid
            if (validationResult.isValid) {
                const calculatedTotal = calculateTotalPay(hours, value, wageRate, wageType);
                setTotalPay(calculatedTotal);
                onInputChange(1, 'total_pay', calculatedTotal ? parseFloat(calculatedTotal) : 0);
            }
        }
    };

    const handleTotalPayChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const validation = validateAmountInput(value);
        
        setTotalPay(validation.value);
        if (validation.isValid) {
            setTotalPayError(null);
            onInputChange(1, 'total_pay', validation.value ? parseFloat(validation.value) : 0);
        } else {
            setTotalPay(validation.value);
            setTotalPayError(validation.error || null);
        }
    };

    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Basic validation
        let hasError = false;
        if (!employeeName) {
            setEmployeeNameError('Employee name is required');
            hasError = true;
        }
        if (!wageRate) {
            setWageRateError('Wage rate is required');
            hasError = true;
        }
        if (!hours && wageType === 'hourly') {
            setHoursError('Hours are required for hourly employees');
            hasError = true;
        }
        if (!minutes && wageType === 'hourly') {
            setMinutesError('Minutes are required for hourly employees');
            hasError = true;
        }

        if (!hasError) {
            onSubmit(e);
            // Reset form
            // Reset the form after a small delay to ensure state updates are complete
            setTimeout(() => {
                if (formRef.current) {
                    formRef.current.reset();
                }
            }, 0);
            setEmployeeName('');
            setWageType('hourly');
            setWageRate('');
            setHours('');
            setMinutes('');
            setTotalPay('');
        }
    };

    // Add form error check
    const formError = (employeeNameError || wageRateError || hoursError || minutesError || totalPayError) ? true : false;

    return (
        <div className="table-row-style mx-auto relative">
            <form onSubmit={handleSubmit} className="flex w-full">
                <div className="h-[60px] flex flex-col items-center justify-center">
                    <div className='h-[40px] w-[200px] flex items-center pl-3'>
                        <input
                            type="text"
                            value={employeeName}
                            onChange={handleEmployeeNameChange}
                            onBlur={handleEmployeeNameBlur}
                            className={` ${employeeNameError ? 'payroll-input-field-error text-red-500' : 'payroll-input-field'}`}
                            placeholder="Jose Beundia"
                        />
                    </div>
                </div>
                <div className="h-[60px] flex flex-col items-center justify-center  pl-7">
                    <div className='h-[40px] w-[100px] flex items-center '>
                        <select
                            value={wageType}
                            onChange={handleWageTypeChange}
                            className="payroll-input-field"
                        >
                            {WAGE_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="h-[60px] flex flex-col items-center justify-center pl-2">
                    <div className='h-[40px] w-[100px] flex items-center pl-3'>
                        <input
                            type="text"
                            value={wageRate}
                            onChange={handleWageRateChange}
                            className={`payroll-input-field ${wageRateError ? 'payroll-input-field-error' : ''}`}
                            placeholder="0.00"
                        />
                    </div>
                </div>
                <div className="h-[60px] flex flex-col items-center justify-center pl-4">
                    <div className='h-[40px] w-[60px] flex items-center pl-3'>
                        <input
                            type="text"
                            value={hours}
                            onChange={handleHoursChange}
                            className={`payroll-input-field ${hoursError ? 'payroll-input-field-error' : ''}`}
                            placeholder="0"
                            disabled={wageType === 'salary'}
                        />
                    </div>
                </div>
                <div className="h-[60px] flex flex-col items-center justify-center pl-4">
                    <div className='h-[40px] w-[60px] flex items-center pl-3'>
                        <input
                            type="text"
                            value={minutes}
                            onChange={handleMinutesChange}
                            className={`payroll-input-field ${minutesError ? 'payroll-input-field-error' : ''}`}
                            placeholder="0"
                            disabled={wageType === 'salary'}
                        />
                    </div>
                </div>
                <div className="h-[60px] flex flex-col items-center justify-center">
                    <div className='h-[40px] w-[100px] flex items-center pl-3'>
                        <input
                            type="text"
                            value={totalPay}
                            onChange={handleTotalPayChange}
                            className={`payroll-input-field ${totalPayError ? 'payroll-input-field-error' : ''}`}
                            placeholder="0.00"
                        />
                    </div>
                </div>
                
                <button
                    type="submit"
                    disabled={formError || cudLoading}
                    className='cursor-pointer disabled:cursor-not-allowed absolute right-[10px] top-1/2 transform -translate-y-1/2'
                >
                    <div className={`flex text-lg justify-center items-center rounded-full ml-[3.5px] ${
                        cudLoading ? 'bg-gray-400' :
                        formError ? 'bg-red-500 cursor-not-allowed' : 'bg-[#DFF4F3] cursor-pointer border border-[#8ABBFD]'
                    } text-white w-7 h-7`}>
                        <div>
                            {cudLoading ? (
                                <span className="text-white">...</span>
                            ) : formError ? 'x' : (
                                <div className='h-4 w-4 flex items-center justify-center'>
                                    <PlusIcon className='text-[#0C3C74]' />
                                </div>
                            )}
                        </div>
                    </div>
                </button>
            </form>
        </div>
    );
}
