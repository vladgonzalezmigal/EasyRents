"use client";

import React, { useState } from "react";
import { useStore } from "@/store";
import { Company } from "@/app/(private)/features/userSettings/types/CompanyTypes";
import LineBreak from "@/app/(private)/features/userSettings/components/LineBreak";
import LargeSearchBar from "@/app/(private)/features/rents/components/LargeSearchBar";
import PropertySelector from "./PropertySelector";
import { Property } from "@/app/(private)/features/userSettings/types/propertyTypes";


interface CompanySelectProps {
  selectedCompanies: string[];
  onCompanySelect: (storeId: string) => void;
}

export default function CompanySelect({ selectedCompanies, onCompanySelect }: CompanySelectProps) {
  const { companyState, propertyState } = useStore();
  const activeCompanies: Company[] | null = companyState.data?.filter(company => company.active) || null;

  // State to track selected properties per company
  const [selectedPropertiesByCompany, setSelectedPropertiesByCompany] = useState<Map<number, Map<number, boolean>>>(
    () => {
        const newMap = new Map<number, Map<number, boolean>>();
        if (activeCompanies && propertyState) {
            activeCompanies.forEach(company => {
              // Filter properties for this company
              const allProperties: Property[] = propertyState.data.get(Number(company.id))?.filter(p => p.company_id === company.id) || []
              const companyProperties = allProperties.map((property) => [property.id, true] as [number, boolean]);
              newMap.set(company.id, new Map(companyProperties));
            });
          }
        return newMap
    }
  );

//   Initialize selectedPropertiesByCompany based on activeCompanies and propertyState
//   useEffect(() => {
//     if (activeCompanies && propertyState) {
//       const newMap = new Map<string, Map<number, boolean>>();
//       activeCompanies.forEach(company => {
//         // Filter properties for this company
//         const companyProperties = Array.from(propertyState.data.entries())
//           .filter(([company_id, property]) => company_id === company.id)
//           .map(([propertyId]) => [propertyId, true] as [number, boolean]);
//         newMap.set(company.id.toString(), new Map(companyProperties));
//       });
//       setSelectedPropertiesByCompany(newMap);
//     }
//   }, [activeCompanies, propertyState]);

  // Create a setter for a specific company's properties
//   const createSetSelectedProperties = (companyId: string) => {
//     return (updater: Map<number, boolean> | ((prev: Map<number, boolean>) => Map<number, boolean>)) => {
//       setSelectedPropertiesByCompany(prev => {
//         const newMap = new Map(prev);
//         const currentProperties = prev.get(companyId) || new Map();
//         const updatedProperties = typeof updater === "function" ? updater(currentProperties) : updater;
//         newMap.set(companyId, updatedProperties);
//         return newMap;
//       });
//     };
//   };

  return (
    <div className="flex flex-col gap-y-4">
      {activeCompanies ? (
        activeCompanies.map((company, index) => (
          <div className="flex flex-col gap-y-8" key={index}>
            <div className="flex gap-x-3">
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
                    onChange={() => onCompanySelect(company.id.toString())}
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
              {selectedCompanies.includes(company.id.toString()) && (
                <LargeSearchBar onSearch={() => {}} placeholder="Enter Address" />
              )}
            </div>
            {/* Property Select */}
            {selectedCompanies.includes(company.id.toString()) && (
              <PropertySelector
                company_id={company.id}
                selected_properties={selectedPropertiesByCompany.get(company.id) || new Map()}
                setSelectedProperties={setSelectedPropertiesByCompany}
              />
            )}
            <LineBreak />
          </div>
        ))
      ) : (
        <p className="text-[13px] text-[#6B7280]">Please refresh the page</p>
      )}
    </div>
  );
}