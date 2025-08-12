'use client';

import { getPagesLink, getActiveForm } from "../../utils/nav";
import BackButton from "./BackButton"
import SignOutBtn from './SignOutBtn';
import HomeButton from "./HomeButton";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SalesIcon from "../svgs/SalesIcon";
import ExpensesIcon from "../svgs/ExpensesIcon";
import PayrollIcon from "../svgs/PayrollIcon";
import StoreLinks from "./StoreLinks";
import { Store } from "../../features/userSettings/types/storeTypes";
import { useStore } from "@/store";
import ChevronNav from "./ChevronNav";
import SettingsSubLinks from "./SettingsSubLinks";
import MailIcon from "../svgs/MailIcon";
import GearIcon from "../svgs/GearIcon";
import CalculatorIcon from "../svgs/CalculatorIcon";

interface NavbarProps {
    backURL?: string;
}

type SettingsType = 'expenses' | 'payroll';


export default function Navbar({ backURL }: NavbarProps) {
    const pathname = usePathname();
    const activePage: string | undefined = getActiveForm(pathname);
    const { storeState, setGlobalLoading } = useStore();
    const storeSubpages : Store[] | null  = storeState.stores?.filter(store => store.active) || null;
    // if null need to ask user to refresh page
    const formPages: string[] = ["sales", "expenses", "payroll"];
    formPages[0] = formPages[0] + (storeSubpages? `/${storeSubpages[0].id}` : '');
    const otherPages: string[] = ["mail","settings", "analytics"];

    const getOtherPageLink = (page: string) => {
        switch (page) {
            case "mail":
                return "/mail";
            case "settings":
                return "/settings";
            case "analytics":
                return "/analytics";
            default:
                return "/";
        }
    };

    return (
        <div className="flex"> 
        <div className="h-full min-h-screen bg-white w-[172px] lg:w-[344px] px-4 lg:px-6 py-8 
         border-r border-r-2 border-[#E5E7EB] flex flex-col justify-between shadow-sm">
            {/* Main Navigation */}
            <div>
                <div className="flex w-full justify-between items-center mb-12">
                    <HomeButton />
                    {backURL && <BackButton url={backURL} />}
                </div>
                <div className="flex flex-col space-y-6">
                    <div>
                        <p className="font-semibold text-[#6B7280] text-[14px] tracking-wide">Forms</p>
                    </div>
                    {/* Links */}
                    <div className="flex flex-col gap-y-2.5 w-full">
                        {formPages.map((page) => (
                            <div key={page} className="w-full flex flex-col">
                                <div className="w-full">
                                    <Link
                                        key={page}
                                        onNavigate={() => {
                                            // Only executes during SPA navigation
                                            setGlobalLoading(true);
                                          }

                                        }
                                        href={getPagesLink(pathname, (page))}
                                        className={`w-full flex justify-between h-[52px] hover:bg-[#B6E8E4] text-gray-500 hover:text-[#2A7D7B] rounded-lg pl-3 flex items-center transition-colors duration-200 ${page.includes(activePage) ? 'bg-[#DFF4F3] shadow-sm' : ''}`}
                                    >
                                        <div className="flex"> 
                                        {/* Icon */}
                                        <div className={`w-6 h-6 mr-2 flex items-center justify-center ${page.includes('sales') ? 'pb-1' : ''}`}>
                                            {page === formPages[0] && <SalesIcon className={page.includes(activePage) ? 'text-[#2A7D7B]' : ' '} />}
                                            {page === "expenses" && <ExpensesIcon className={page.includes(activePage) ? 'text-[#2A7D7B]' : ''} />}
                                            {page === "payroll" && <PayrollIcon className={page.includes(activePage) ? 'text-[#2A7D7B]' : ''} />}
                                        </div>
                                        <p className={`text-[16px] capitalize ${page.includes(activePage) ? 'text-[#2A7D7B] font-semibold' : ''}`}>{(page === formPages[0] ? "sales" : page)}</p>
                                        </div>
                                        <div className={page.includes(activePage) ? 'text-[#2A7D7B]' : ''}>
                                            <ChevronNav isActive={page.includes(activePage)} />
                                        </div>
                                       
                                    </Link>
                                    {/* Sublinks */}
                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${(page.includes(activePage)) ? 'max-h-96 opacity-100 bg-[#F2FBFA] rounded-b-xl' : 'max-h-0 opacity-0'}`}>
                                        {page === formPages[0] && <StoreLinks />}
                                        {page !== formPages[0] && <SettingsSubLinks type={page as SettingsType} />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Other links */}
                    <div className="flex flex-col space-y-6">
                        <p className="font-semibold text-[#6B7280] text-[14px] tracking-wide">Other</p>
                        {/* Other links */}
                        <div className="flex flex-col gap-y-2.5 w-full">
                        {otherPages.map((page) => (
                            <div key={page} className="w-full flex">
                                <div className="w-full ">
                                    <Link
                                        key={page}
                                        href={getOtherPageLink(page)}
                                        className={`w-full flex justify-between h-[52px] hover:bg-[#B6E8E4] text-gray-500 hover:text-[#2A7D7B] rounded-lg pl-3 flex items-center transition-colors duration-200 ${page.includes(activePage) ? 'bg-[#DFF4F3] shadow-sm' : ''}`}
                                    >
                                        <div className="flex"> 
                                        {/* Icon */}
                                        <div className={` mr-3 flex items-center justify-center ${page.includes('analytics') ? ' w-5 h-5' : 'w-6 h-6'}`}>
                                            {page === "mail" && <MailIcon className={page.includes(activePage) ? 'text-[#2A7D7B]' : ' '} />}
                                            {page === "settings" && <GearIcon className={page.includes(activePage) ? 'text-[#2A7D7B]' : ''} />}
                                            {page === "analytics" && <CalculatorIcon className={page.includes(activePage) ? 'text-[#2A7D7B]' : ''} />}
                                        </div>
                                        <p className={`text-[16px] capitalize ${page === activePage ? 'text-[#2A7D7B]  font-semibold' : ''}`}>{page}</p>
                                        </div>
                                        <div>
                                            
                                        </div>
                                    </Link>

                                </div>
                            </div>
                        ))}
                    </div>
                    </div>
                </div>
            </div>
            <div className="pt-6 border-t border-[#E5E7EB]">
                <SignOutBtn />
            </div>
        </div>
       
        </div>
    );
} 