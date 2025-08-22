'use client';

import { getPagesLink, getActiveForm } from "../../utils/nav";
import BackButton from "./BackButton"
import SignOutBtn from './SignOutBtn';
import HomeButton from "./HomeButton";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Company } from "../../features/userSettings/types/CompanyTypes";
import { useStore } from "@/store";
import ChevronNav from "./ChevronNav";
import MailIcon from "../svgs/MailIcon";
import GearIcon from "../svgs/GearIcon";
import CalculatorIcon from "../svgs/CalculatorIcon";
import BuildingIcon from "../svgs/BuildingIcon";

interface NavbarProps {
    backURL?: string;
}

export default function Navbar({ backURL }: NavbarProps) {
    const pathname = usePathname();
    const activePage: string | undefined = getActiveForm(pathname);
    const { companyState: companyState, setGlobalLoading } = useStore();

    const companies : Company[] | null  = companyState.data?.filter(company => company.active) || [];
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
                        <p className="font-semibold text-[#6B7280] text-[14px] tracking-wide">Companies</p>
                    </div>
                    {/* Company Links */}
                    <div className="flex flex-col gap-y-2.5 w-full">
                        {companies.map((page) => (
                            <div key={page.id} className="w-full flex flex-col">
                                <div className="w-full">
                                    <Link
                                        key={page.id}
                                        onNavigate={() => {
                                            // Only executes during SPA navigation
                                            setGlobalLoading(true);
                                          }

                                        }
                                        href={getPagesLink(pathname, (page.id.toString()))}
                                        className={`w-full flex justify-between h-[52px] hover:bg-[#B6E8E4] text-gray-500 hover:text-[#2A7D7B] rounded-lg pl-3 flex items-center transition-colors duration-200 ${page.company_name.includes(activePage) ? 'bg-[#DFF4F3] shadow-sm' : ''}`}
                                    >
                                        <div className="flex"> 
                                        {/* Icon */}
                                        <div className={`w-6 h-6 mr-2 flex items-center justify-center`}>
                                            {<BuildingIcon className={page.company_name.includes(activePage) ? 'text-[#2A7D7B]' : ' '} />}
                                        </div>
                                        <p className={`text-[16px] capitalize ${page.company_name.includes(activePage) ? 'text-[#2A7D7B] font-semibold' : ''}`}>{(page.company_name)}</p>
                                        </div>
                                        <div className={`pb-0.5 ${page.company_name.includes(activePage) ? 'text-[#2A7D7B]' : ''}`}>
                                            <ChevronNav isActive={page.company_name.includes(activePage)} />
                                        </div>
                                       
                                    </Link>
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