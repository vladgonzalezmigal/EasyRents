'use client';

import { useState } from 'react';
import { validateYearInput } from '../../../../utils/dateUtils';
import SearchIcon from '@/app/(private)/components/svgs/SearchIcon';
import ChevronIcon from '@/app/(private)/components/svgs/ChevronIcon';

interface YearSearchBarProps {
    onYearSelect: (year: number) => void;
    initialYear?: number;
}

export default function DocumentSearchHeader({ onYearSelect, initialYear }: YearSearchBarProps) {
    const today = new Date();
    const [yearInput, setYearInput] = useState<string>((initialYear || today.getFullYear()).toString());
    const [validYear, setValidYear] = useState<boolean>(true);

    // handle year input  
    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = validateYearInput(e.target.value);
        setYearInput(e.target.value);
        if (value) {
            setValidYear(true);
        } else {
            setValidYear(false);
        }
    };

    // handle search button 
    const searchYear = () => {
        const newYear = parseInt(yearInput);
        if (!isNaN(newYear) && newYear > 0 && validYear) {
            onYearSelect(newYear);
        } else {
            // Reset to current year if invalid
            setYearInput(today.getFullYear().toString());
            setValidYear(true);
            onYearSelect(today.getFullYear());
        }
    };

    // handle blur event
    const handleBlur = () => {
        const newYear = parseInt(yearInput);
        if (!isNaN(newYear) && newYear > 0 && validYear) {
            onYearSelect(newYear);
        } else {
            // Reset to current year if invalid
            setYearInput(today.getFullYear().toString());
            setValidYear(true);
            onYearSelect(today.getFullYear());
        }
    };

    // handle decrease year
    const decreaseYear = () => {
        const currentYear = parseInt(yearInput);
        if (!isNaN(currentYear) && currentYear > 1) {
            const newYear = currentYear - 1;
            const newYearStr = newYear.toString();
            if (validateYearInput(newYearStr)) {
                setYearInput(newYearStr);
                setValidYear(true);
                onYearSelect(newYear);
            }
        }
    };

    // handle increase year
    const increaseYear = () => {
        const currentYear = parseInt(yearInput);
        if (!isNaN(currentYear)) {
            const newYear = currentYear + 1;
            const newYearStr = newYear.toString();
            if (validateYearInput(newYearStr)) {
                setYearInput(newYearStr);
                setValidYear(true);
                onYearSelect(newYear);
            }
        }
    };

    return (
        <div className="flex  justify-between px-3 items-center gap-2  w-full">
            {/* Decrease Year */}
            <div 
                className="w-[40px] h-[40px] rounded-full flex items-center justify-center cursor-pointer "
                onClick={decreaseYear}
            >
                <ChevronIcon className="text-[#4A4A4A] w-full h-full hover:text-blue-400 " />
            </div>
            <div className="relative">
                <input
                    type="text"
                    placeholder="2025"
                    value={yearInput}
                    onChange={handleYearChange}
                    onBlur={handleBlur}
                    className={`w-[220px] h-[55px] bg-white pl-4 pr-10 rounded-lg border ${validYear ? 'border-[#B6E8E4] focus:border-[#48B4A0]' : 'border-red-500 focus:border-red-500'
                        } focus:outline-none text-[16px]`}
                />
                <button
                    onClick={searchYear}
                    className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 pb-1 "
                >
                    <SearchIcon className="text-[#4A4A4A] hover:text-blue-400 w-6 h-6" />
                </button>

            </div>
            {/* Increase Year */}
            <div 
                className=" w-[40px] h-[40px] rounded-full flex items-center justify-center cursor-pointer "
                onClick={increaseYear}
            >
                <ChevronIcon className="text-[#4A4A4A] w-full h-full transform rotate-180 hover:text-blue-400" />
            </div>
        </div>
    );
}
