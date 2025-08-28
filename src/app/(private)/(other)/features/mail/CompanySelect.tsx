'use client';

import { useStore } from "@/store";
import { Company } from "@/app/(private)/features/userSettings/types/CompanyTypes";

interface CompanySelectProps {
    selectedCompanies: string[];
    onCompanySelect: (storeId: string) => void;
}

export default function CompanySelect({ selectedCompanies, onCompanySelect }: CompanySelectProps) {
    const { companyState } = useStore();
    const activeCompanies: Company[] | null = companyState.data?.filter(company => company.active) || null;

    return (
        <div className="flex flex-wrap gap-4 ">
            {activeCompanies ? (
                activeCompanies.map((company, index) => (
                    <div
                        key={index}
                        onClick={() => onCompanySelect(company.id.toString())}
                        className={`p-4 border rounded-2xl shadow-md cursor-pointer w-[270px] flex items-center justify-center ${
                            selectedCompanies.includes(company.id.toString())
                                ? 'bg-[#F2FBFA] border-[#DFDFDF]'
                                : 'bg-white border-[#DFDFDF]'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={selectedCompanies.includes(company.id.toString())}
                                onChange={() => {}}
                                className="w-4 h-4 rounded border-[#8ABBFD] text-[#8ABBFD] focus:ring-[#8ABBFD]"
                            />
                            <p className={`text-sm ${
                                selectedCompanies.includes(company.id.toString())
                                    ? 'text-[#2A7D7B] font-bold'
                                    : 'text-gray-500 font-semibold'
                            }`}>
                                {company.company_name}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-[13px] text-[#6B7280]">Please refresh the page</p>
            )}
        </div>
    );
}
