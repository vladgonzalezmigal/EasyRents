"use client";

import React, { useState } from "react";
import { useStore } from "@/store";
import { Company } from "@/app/(private)/features/userSettings/types/CompanyTypes";
import LineBreak from "@/app/(private)/features/userSettings/components/LineBreak";
import LargeSearchBar from "@/app/(private)/features/rents/components/LargeSearchBar";
import PropertySelector from "./PropertySelector";

interface CompanySelectProps {
    selectedCompanies: string[];
    onCompanySelect: (storeId: string) => void;
    selectedPropertiesByCompany: Map<number, Map<number, boolean>>;
    setSelectedPropertiesByCompany: React.Dispatch<
        React.SetStateAction<Map<number, Map<number, boolean>>>
    >;
}

export default function CompanySelect({
    selectedCompanies,
    onCompanySelect,
    selectedPropertiesByCompany,
    setSelectedPropertiesByCompany,
}: CompanySelectProps) {
    const { companyState } = useStore();

    const activeCompanies: Company[] | null =
        companyState.data?.filter((company) => company.active) || null;

    // track search query per company
    const [searchQueries, setSearchQueries] = useState<Map<number, string>>(new Map());

    const selectAll = (company_id: number, checked: boolean) => {
        setSelectedPropertiesByCompany((prev) => {
            const newMap = new Map(prev);
            const newCompanyMap = newMap.get(company_id);
            for (const prop_id of newCompanyMap.keys()) {
                newCompanyMap.set(prop_id, checked);
            }
            newMap.set(company_id, newCompanyMap);
            return newMap;
        });
    };

    return (
        <div className="flex flex-col gap-y-4">
            {activeCompanies ? (
                activeCompanies.map((company, index) => {
                    const isAllSelected =
                        selectedPropertiesByCompany.get(company.id)?.size > 0 &&
                        Array.from(
                            selectedPropertiesByCompany.get(company.id)?.values() || []
                        ).every((value) => value);

                    return (
                        <div className="flex flex-col gap-y-8" key={index}>
                            <div className="flex gap-x-3">
                                {/* Company box */}
                                <div
                                    onClick={() => onCompanySelect(company.id.toString())}
                                    className={`p-4 border rounded-2xl shadow-md cursor-pointer w-[270px] flex items-center justify-center ${
                                        selectedCompanies.includes(company.id.toString())
                                            ? "bg-[#F2FBFA] border-[#DFDFDF]"
                                            : "bg-white border-[#DFDFDF]"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedCompanies.includes(company.id.toString())}
                                            onChange={() =>
                                                onCompanySelect(company.id.toString())
                                            }
                                            className="w-4 h-4 rounded border-[#8ABBFD] text-[#8ABBFD] focus:ring-[#8ABBFD]"
                                        />
                                        <p
                                            className={`text-sm ${
                                                selectedCompanies.includes(company.id.toString())
                                                    ? "text-[#2A7D7B] font-bold"
                                                    : "text-gray-500 font-semibold"
                                            }`}
                                        >
                                            {company.company_name}
                                        </p>
                                    </div>
                                </div>

                                {/* Search bar */}
                                {selectedCompanies.includes(company.id.toString()) && (
                                    <LargeSearchBar
                                        placeholder="Enter Address"
                                        onSearch={(query: string) =>
                                            setSearchQueries((prev) => {
                                                const newMap = new Map(prev);
                                                newMap.set(company.id, query);
                                                return newMap;
                                            })
                                        }
                                    />
                                )}

                                {/* Select all */}
                                {selectedCompanies.includes(company.id.toString()) && (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={(e) =>
                                                selectAll(company.id, e.target.checked)
                                            }
                                            className="h-6 w-6 text-[#2A7D7B] border-[#E4F0F6] rounded focus:ring-[#2A7D7B]"
                                            aria-label={`Select all properties for ${company.company_name}`}
                                        />
                                        <label className="text-lg text-[#404040] font-semibold">
                                            Select All
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Property list */}
                            {selectedCompanies.includes(company.id.toString()) && (
                                <PropertySelector
                                    company_id={company.id}
                                    selected_properties={
                                        selectedPropertiesByCompany.get(company.id) || new Map()
                                    }
                                    setSelectedProperties={setSelectedPropertiesByCompany}
                                    searchQuery={searchQueries.get(company.id) || ""}
                                />
                            )}
                            <LineBreak />
                        </div>
                    );
                })
            ) : (
                <p className="text-[13px] text-[#6B7280]">Please refresh the page</p>
            )}
        </div>
    );
}
