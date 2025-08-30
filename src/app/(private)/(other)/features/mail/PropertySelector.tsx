"use client";

import React from "react";
import { useStore } from "@/store";
import { Property } from "@/app/(private)/features/userSettings/types/propertyTypes";
import { filterByIncludes } from "@/app/(private)/features/utils/searchUtils";

interface PropertySelectorProps {
    company_id: number;
    selected_properties: Map<number, boolean>;
    setSelectedProperties: React.Dispatch<
        React.SetStateAction<Map<number, Map<number, boolean>>>
    >;
    searchQuery: string;
}

export default function PropertySelector({
    company_id,
    selected_properties,
    setSelectedProperties,
    searchQuery,
}: PropertySelectorProps) {
    const { propertyState } = useStore();

    const allProperties: Property[] =
        propertyState.data.get(Number(company_id))?.filter((c) => c.active) || [];

    // Filter by search query
    const filteredProperties =
        searchQuery.trim().length > 0
            ? allProperties.filter((p) =>
                  filterByIncludes([p.address], searchQuery).length > 0
              )
            : allProperties;

    const handleCheckboxChange = (propertyId: number) => {
        setSelectedProperties((prev) => {
            const newMap = new Map(prev);
            const companyMap = newMap.get(company_id);
            companyMap.set(propertyId, !companyMap.get(propertyId));
            newMap.set(company_id, companyMap);
            return newMap;
        });
    };

    return (
        <div className="w-[600px] max-h-[500px] overflow-y-auto bg-white rounded-lg shadow-lg border border-[#E4F0F6]">
            <table className="min-w-full">
                <thead className="bg-[#F8F9FA] border-b border-[#E4F0F6] sticky top-0 z-10 h-12">
                    <tr>
                        <th className="w-12 px-2 text-left text-[#80848A] font-semibold tracking-wider">
                            Select
                        </th>
                        <th className="px-2 text-left text-[#80848A] font-semibold tracking-wider">
                            Address
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProperties.map((p) => (
                        <tr
                            key={p.id}
                            className="border-b border-[#E4F0F6] hover:bg-gray-100 transition-colors duration-150"
                        >
                            <td className="w-12 px-2 py-3 text-center">
                                <input
                                    type="checkbox"
                                    checked={selected_properties.get(p.id) || false}
                                    onChange={() => handleCheckboxChange(p.id)}
                                    className="h-4 w-4 text-[#2A7D7B] border-[#E4F0F6] rounded focus:ring-[#2A7D7B]"
                                />
                            </td>
                            <td className="px-2 py-3 text-[#404040] overflow-x-auto">
                                {p.address}
                            </td>
                        </tr>
                    ))}
                    {filteredProperties.length === 0 && (
                        <tr>
                            <td
                                colSpan={2}
                                className="px-2 py-4 text-center text-[#404040]"
                            >
                                No properties match your search
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
