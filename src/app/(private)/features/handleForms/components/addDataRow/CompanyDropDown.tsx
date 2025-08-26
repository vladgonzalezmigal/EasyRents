'use client';

import { ChangeEvent, useRef, useState, useEffect } from 'react';
import { validateCompanyInput } from '@/app/(private)/features/handleForms/utils/formValidation/formValidation';

interface CompanyDropDownProps {
    companies: string[];
    onCompanySelect: (company: string) => void;
    error?: string | null;
    value?: number;
    vendorMap: Record<number, string>;
}

export default function CompanyDropDown({ companies, onCompanySelect, error, value = -1, vendorMap }: CompanyDropDownProps) {
    const [searchInput, setSearchInput] = useState(value === -1 ? "" : vendorMap[value] || "");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Update searchInput when value prop changes
    useEffect(() => {
        setSearchInput(value === -1 ? "" : vendorMap[value] || "");
    }, [value, vendorMap]);

    const handleCompanySearch = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase();
        setSearchInput(value);
        setIsDropdownOpen(true);
    };

    const handleCompanyChange = (company: string) => {
        const validation = validateCompanyInput(company);
        
        if (validation.isValid) {
            onCompanySelect(company);
            setSearchInput(validation.value);
        }
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCompanies = companies.filter(company => 
        company.toUpperCase().startsWith(searchInput)
    );

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="relative">
                <input
                    type="text"
                    id="company"
                    name="company"
                    value={searchInput}
                    onChange={handleCompanySearch}
                    onFocus={() => setIsDropdownOpen(true)}
                    className={`flex w-[100px] items-center justify-center pl-2  py-2 h-[36px] bg-[#F6F6F6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4F0F6] ${error ? "border border-red-500" : "border border-[#E4F0F6]"}`}
                    placeholder={"JETRO"}
                    autoComplete="off"
                />
            </div>
            
            {isDropdownOpen && filteredCompanies.length > 0 && (
                <div className="absolute z-50 w-[140px] mt-1 bg-white rounded-md shadow-lg border border-[#DFDFDF] max-h-60 overflow-auto">
                    {filteredCompanies.map((company) => (
                        <button
                            key={company}
                            onClick={() => handleCompanyChange(company)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-[#DFF4F3] text-[#585858]"
                        >
                            {company}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
