'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { months } from '../../../../utils/dateUtils';
import DocumentSearchHeader from './DocumentSearchHeader';
import { daysInMonth } from '../../../../utils/dateUtils';
// import { useStore } from '@/store';
interface DocumentSelectionProps {
    split?: boolean;
}

export default function DocumentSelection({ split = false }: DocumentSelectionProps) {
    // const { setGlobalLoading } = useStore();
    const today = new Date();
    const router = useRouter();
    const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
    const currentMonth: number = today.getMonth();
    // Split View For Payroll
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [endDates, setEndDates] = useState<number[]>([15,daysInMonth[currentMonth]]);
    // const endDates : number[] = []

    
    // Navigate to the document URL with the selected year and month
    const navigateToDocument = (year: number, month: number, docIndex?: number) => {
        // Add 1 to month since months are 0-indexed in JavaScript but we want 1-indexed in the URL
        const monthIndex = month + 1;
        if (docIndex) {
            router.push(`${window.location.pathname}/${year}/${monthIndex}/${docIndex}`);
        } else {
            router.push(`${window.location.pathname}/${year}/${monthIndex}`);
        }
    };

    // Handle click for split view items
    const handleSplitItemClick = (monthIndex: number, endDate: number) => {
        if (!split) { 
            setSelectedMonth(null);
        }
        if (endDate === 0) {
            setSelectedMonth(monthIndex);
            setEndDates([15,daysInMonth[monthIndex]]);
        } else {
            // navigate to specified document
            
            const docId = endDates.findIndex(date => date === endDate);
            navigateToDocument(selectedYear, monthIndex, (docId+1));
            // setGlobalLoading(true);
        }
        // You can use endDate if needed for specific payroll periods
        // navigateToDocument(selectedYear, monthIndex);
    };


    return (
        <div className="flex flex-col ">
            {/* Change Year Header */}
            <div className="w-[600px] h-[80px] bg-[#F5F5F5] flex items-center justify-center rounded-top border-2 border-[#DFDFDF] shadow-md">
                <DocumentSearchHeader 
                    onYearSelect={setSelectedYear}
                    initialYear={selectedYear}
                />
            </div>
            {/* Calendar Grid  */}
            <div className="flex w-[600px] justify-center bg-[#FDFDFD] rounded-bottom border-2 border-[#DFDFDF] py-6 shadow-lg">
                <div className="grid grid-cols-4 gap-4  w-[500px]">
                    {months.map((month, index) => (
                        split && index === selectedMonth ? (
                            // Split View for Payroll 
                            <div key={index} className="flex flex-col gap-2">
                                {endDates.map((endDate, i) => (
                                    <button
                                        key={`${index}-${i}`}
                                        className={`cursor-pointer border-2 border-[#B6E8E4] shadow-md py-[12px] px-[10px] rounded hover:bg-blue-100 flex items-center justify-center rounded-lg font-semibold text-[18px] ${index === currentMonth ? 'border-[#B6E8E4] bg-[#DFF4F3] text-[#202020]' : 'bg-white text-[#585858]'}`}
                                        onClick={() => handleSplitItemClick(index, endDate)}
                                    >
                                        <p>{month.substring(0, 3).charAt(0).toUpperCase() + month.substring(1, 3).toLowerCase()} {endDate}</p>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <button
                                key={index}
                                className={`cursor-pointer border-2 border-[#B6E8E4] shadow-md py-[44px] px-[52px] rounded hover:bg-blue-100 flex items-center justify-center rounded-lg font-semibold text-[18px] ${index === currentMonth ? 'border-[#B6E8E4] bg-[#DFF4F3] text-[#202020]' : 'bg-white text-[#585858]'}`}
                                onClick={() => split ? handleSplitItemClick(index, 0) : navigateToDocument(selectedYear, index)}
                            >
                                <p>{month.substring(0, 3).charAt(0).toUpperCase() + month.substring(1, 3).toLowerCase()}</p>
                            </button>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
}