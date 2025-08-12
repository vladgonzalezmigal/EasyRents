'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { months } from '@/app/(private)/utils/dateUtils';

interface ToggleMonthsBtnProps {
    type: 'sales' | 'payroll' | 'expenses';
    currentMonth: number;
    currentYear: number;
}

export default function ToggleMonthsBtn({ type, currentMonth, currentYear }: ToggleMonthsBtnProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const handleNavigate = (monthIndex: number) => {
        const month = monthIndex + 1; // Convert to 1-based month
        const pathSegments = pathname.split('/');
        
        // Replace the month segment
        if (type === 'payroll') {
            pathSegments[pathSegments.length - 2] = month.toString();
        } else {
            pathSegments[pathSegments.length - 1] = month.toString();
        }
        
        router.push(pathSegments.join('/'));
        setIsOpen(false);
    };

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

    return (
        <div className="relative flex flex-row items-center" ref={dropdownRef}>
            
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-[120px] px-4 py-2 bg-white border-2 border-[#5CB8B1] rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2A7D7B] text-[#585858] text-[18px] font-semibold"
            >
                {months[currentMonth]}
            </button>
            <div className="pl-4 text-3xl font-semibold text-[#585858] ">
                {currentYear}
            </div>
            
            {isOpen && (
                <div className="absolute z-50 top-full left-0 mt-1 w-[120px] bg-white rounded-md shadow-lg border border-[#DFDFDF]">
                    <div className="py-1 max-h-60 overflow-auto">
                        {months.map((month, index) => (
                            <button
                                key={month}
                                onClick={() => handleNavigate(index)}
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
    );
}
