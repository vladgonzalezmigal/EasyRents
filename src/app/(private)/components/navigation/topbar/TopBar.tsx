'use client';

import { useEffect } from 'react';
import HouseUserIcon from '../../svgs/HouseUserIcon';
import SalesIcon from '../../svgs/SalesIcon';
import ExpensesIcon from '../../svgs/ExpensesIcon';
import PayrollIcon from '../../svgs/PayrollIcon';
import MailIcon from '../../svgs/MailIcon';
import GearIcon from '../../svgs/GearIcon';
import CalculatorIcon from '../../svgs/CalculatorIcon';
import { useStore } from '@/store';

interface TopBarProps {
    activePage: string;
}

export default function TopBar({ activePage }: TopBarProps) {
    const { userEmail, isLoadingEmail, error, fetchUserEmail } = useStore();

    useEffect(() => {
        if (!userEmail) {
            fetchUserEmail();
        }
    }, [fetchUserEmail, userEmail]);

    const getIcon = () => {
        switch (activePage) {
            case 'selection':
                return <HouseUserIcon className="w-6 h-6 text-[#2A7D7B]" />;
            case 'sales':
                return <SalesIcon className="w-6 h-6 text-[#2A7D7B]" />;
            case 'expenses':
                return <ExpensesIcon className="w-6 h-6 text-[#2A7D7B]" />;
            case 'payroll':
                return <PayrollIcon className="w-6 h-6 text-[#2A7D7B]" />;
            case 'mail':
                return <MailIcon className="w-6 h-6 text-[#2A7D7B]" />;
            case 'settings':
                return <GearIcon className="w-6 h-6 text-[#2A7D7B]" />;
            case 'analytics':
                return <CalculatorIcon className="w-6 h-6 text-[#2A7D7B]" />;
            default:
                return null;
        }
    };

    const formatPageTitle = (page: string) => {
        return page.charAt(0).toUpperCase() + page.slice(1);
    };

    return (
        <div className="flex items-center justify-between px-16 bg-[#B6E8E4] shadow-sm py-4 w-full border-b border-b-[#DADADA]">
            <div className="flex items-center">
                <div className="w-12 h-12 bg-[#DFF4F3] rounded-full flex items-center justify-center">
                    {getIcon()}
                </div>
                <h1 className="text-[24px] font-bold text-[#2F2F2F] pl-4">{formatPageTitle(activePage)}</h1>
            </div>
            <div className="text-[16px] font-medium text-[#585858] ">
                {isLoadingEmail ? (
                    <p className="text-gray-500">Loading...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    userEmail || 'No email found'
                )}
            </div>
        </div>
    );
}
