'use client';

import { ChangeEvent, useRef, useState } from 'react';
import { Expense } from '@/app/(private)/types/formTypes';
import { useParams } from 'next/navigation';
import { validateDateInput, validateAmountInput } from '@/app/(private)/features/handleForms/utils/formValidation/formValidation';
import { formatDate } from '@/app/(private)/utils/dateUtils';
import PlusIcon from '@/app/(private)/components/svgs/PlusIcon';
import { useStore } from '@/store';
import CompanyDropDown from './CompanyDropDown';

interface ExpenseFormProps {
    onInputChange: (name: keyof Expense, value: string | number) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const PAYMENT_TYPES = ['CHECK', 'CASH', 'CARD'] as const;
const today = new Date();
const DAY = today.getDate();

export default function ExpenseForm({ onInputChange, onSubmit }: ExpenseFormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const { year, month } = useParams();
    const { vendorState } = useStore();
    const COMPANIES = vendorState.vendors?.map((vendor) => vendor.vendor_name) || [];
    const vendorMap = vendorState.vendors?.reduce((map, vendor) => {
        map[vendor.id] = vendor.vendor_name;
        return map;
    }, {} as Record<number, string>) || {};
    const reverseVendorMap = vendorState.vendors?.reduce((map, vendor) => {
        map[vendor.vendor_name] = vendor.id;
        return map;
    }, {} as Record<string, number>) || {};

    // form validation errors
    const [dateError, setDateError] = useState<string | null>(null);
    const [companyError, setCompanyError] = useState<string | null>(null);
    const [amountError, setAmountError] = useState<string | null>(null);
    const [companySelected, setCompanySelected] = useState<number>(-1);

    const formError: boolean = (dateError || companyError || amountError) ? true : false;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onInputChange(name as keyof Expense, value);
    };

    const handleCompanySelect = (company: string) => {
        // Find the vendor ID by name
        const vendorId = reverseVendorMap[company];
        if (!vendorId) {
            setCompanyError("Invalid company selected");
            return;
        }

        setCompanySelected(vendorId);
        onInputChange('company', vendorId);
        setCompanyError(null);
    };

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        const validation = validateDateInput(
            value,
            parseInt(month as string),
            parseInt(year as string)
        );

        e.target.value = validation.value;

        if (validation.isValid) {
            if (dateError) {
                setDateError(null);
            }
            const postValue = formatDate(validation.value, month as string, year as string);
            onInputChange(name as keyof Expense, postValue);
        } else {
            setDateError(validation.error || null);
        }
    };

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const validation = validateAmountInput(value);

        e.target.value = validation.value;

        if (validation.isValid) {
            if (amountError) {
                setAmountError(null);
            }
            let postValue = validation.value;
            if (validation.isValid && !postValue.includes('.')) {
                postValue = `${postValue}.00`;
            }
            onInputChange(name as keyof Expense, postValue);
        } else {
            setAmountError(validation.error || null);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (companySelected === -1) {
            setCompanyError("Please select a company");
            return;
        }
        onSubmit(e);
        // Reset the form after a small delay to ensure state updates are complete
        setTimeout(() => {
            if (formRef.current) {
                formRef.current.reset();
                // Force the date input to be empty
                const dateInput = formRef.current.querySelector('input[name="date"]') as HTMLInputElement;
                if (dateInput) {
                    dateInput.value = '';
                }
            }
        }, 0);
        setCompanySelected(-1);
    };

    return (
        <div className="border border-[#DFF4F3] bg-white table-input-shadow w-[772px] rounded-full">
            <form ref={formRef} onSubmit={handleSubmit} className='flex flex-row items-center rounded-full h-[60px] pl-10 text-gray-800'>
                <div className="">
                    <input
                        type="text"
                        id="date"
                        name="date"
                        required={true}
                        onChange={handleDateChange}
                        className={`flex items-center justify-center ${dateError ? "input-field-error " : "input-field"}`}
                        placeholder={DAY.toString()}
                        defaultValue=""
                    />
                </div>

                <div className='pl-12'>
                    <select
                        id="payment_type"
                        name="payment_type"
                        onChange={handleChange}
                        className="input-field text-[#585858]"
                    >
                        {PAYMENT_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='pl-12'>
                    <input
                        type="text"
                        id="detail"
                        name="detail"
                        onChange={handleChange}
                        className="input-field"
                        placeholder='#'
                    />
                </div>

                <div className='pl-12'>
                    <CompanyDropDown
                        companies={COMPANIES}
                        onCompanySelect={handleCompanySelect}
                        error={companyError}
                        value={companySelected}
                        vendorMap={vendorMap}
                    />
                </div>

                <div className='pl-12'>
                    <input
                        type="text"
                        id="amount"
                        name="amount"
                        required={true}
                        onChange={handleAmountChange}
                        className={`flex items-center justify-center ${amountError ? "input-field-error " : "input-field"}`}
                        placeholder="0.00"
                    />
                </div>
                <button
                    type="submit"
                    disabled={formError}
                    className='cursor-pointer disabled:cursor-not-allowed'
                >
                    <div className={`flex text-lg justify-center items-center rounded-full ml-[3.5px] ${formError ? 'bg-red-500 cursor-not-allowed' : 'bg-[#DFF4F3] cursor-pointer border border-[#8ABBFD]'} text-white w-7 h-7`}>
                        <div>{formError ? 'x' :
                            <div className='h-4 w-4 flex items-center justify-center'>
                                <PlusIcon className='text-[#0C3C74]' />
                            </div>
                        }</div>
                    </div>
                </button>
            </form>
        </div>
    );
}
