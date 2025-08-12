'use client';

import { useState, useRef, useEffect } from 'react';
import { months } from '@/app/(private)/utils/dateUtils';
import SearchIcon from '@/app/(private)/components/svgs/SearchIcon';

interface MailSearchProps {
    onMonthChange: (month: number) => void;
    onYearChange: (year: number) => void;
    currentMonth: number;
    currentYear: number;
}

export default function MailSearch({ 
    onMonthChange, 
    onYearChange, 
    currentMonth,
    currentYear
}: MailSearchProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [yearInput, setYearInput] = useState<string>(currentYear.toString());
    const [validYear, setValidYear] = useState<boolean>(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Update yearInput when currentYear changes
    useEffect(() => {
        setYearInput(currentYear.toString());
    }, [currentYear]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Validate year input
    const validateYearInput = (value: string) => {
        const year = parseInt(value);
        return !isNaN(year) && year > 0;
    };

    // Handle year input change
    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setYearInput(value);
        setValidYear(validateYearInput(value));
    };

    // Handle year search
    const searchYear = () => {
        const newYear = parseInt(yearInput);
        if (!isNaN(newYear) && newYear > 0 && validYear) {
            onYearChange(newYear);
        } else {
            // Reset to current year if invalid
            setYearInput(currentYear.toString());
            setValidYear(true);
            onYearChange(currentYear);
        }
    };

    // Handle year input blur
    const handleBlur = () => {
        searchYear();
    };

    // Handle month change
    const handleMonthChange = (monthIndex: number) => {
        onMonthChange(monthIndex);
        setIsOpen(false);
    };

    return (
        <div className="flex flex-row items-center gap-4">
            {/* Month Toggle Button */}
            <div className="relative flex flex-row items-center" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-[120px] px-4 py-2 bg-white border-2 border-[#5CB8B1] rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2A7D7B] text-[#585858] text-[18px] font-semibold"
                >
                    {months[currentMonth]}
                </button>
                
                {isOpen && (
                    <div className="absolute z-50 top-full left-0 mt-1 w-[120px] bg-white rounded-md shadow-lg border border-[#DFDFDF]">
                        <div className="py-1 max-h-60 overflow-auto">
                            {months.map((month, index) => (
                                <button
                                    key={month}
                                    onClick={() => handleMonthChange(index)}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-[#DFF4F3] ${
                                        index === currentMonth ? 'bg-[#DFF4F3] text-[#2A7D7B]' : 'text-[#585858]'
                                    }`}
                                >
                                    {month}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Year Search Bar */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="2025"
                    value={yearInput}
                    onChange={handleYearChange}
                    onBlur={handleBlur}
                    className={`w-[220px] h-[55px] bg-white pl-4 pr-10 rounded-lg border ${
                        validYear ? 'border-[#B6E8E4] focus:border-[#48B4A0]' : 'border-red-500 focus:border-red-500'
                    } focus:outline-none text-[16px]`}
                />
                <button
                    onClick={searchYear}
                    className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 pb-1"
                >
                    <SearchIcon className="text-[#4A4A4A] hover:text-blue-400 w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
