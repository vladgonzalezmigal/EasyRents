import React, { useState } from "react";
import { Property } from "../../types/propertyTypes";
import { useStore } from "@/store";
import ChevronIcon from "@/app/(private)/components/svgs/ChevronIcon";

interface DisplayPropertyRowsProps {
    properties: Property[];
    delete_mode: boolean;
    rowsToDelete: Set<number>;
    addToDelete: (id: number) => void; 
}

const DisplayPropertyRows: React.FC<DisplayPropertyRowsProps> = ({ properties, delete_mode, rowsToDelete, addToDelete }) => {
    const { tenantState } = useStore();
    const [expandedProperties, setExpandedProperties] = useState<Set<number>>(new Set());

    const togglePropertyExpansion = (propertyId: number) => {
        setExpandedProperties(prev => {
            const newSet = new Set(prev);
            if (newSet.has(propertyId)) {
                newSet.delete(propertyId);
            } else {
                newSet.add(propertyId);
            }
            return newSet;
        });
    };

    if (!properties || properties.length === 0) {
        return (
            <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-[18px] text-[#404040] font-semibold">
                    Nothing found for this search
                </td>
            </tr>
        );
    }

    return (
        <>
            {properties.map((property) => {
                const propertyTenants = tenantState.data?.get(property.id) || [];
                const hasTenants = propertyTenants.length > 0;
                const isExpanded = expandedProperties.has(property.id);

                return (
                    <React.Fragment key={property.id}>
                        <tr className={`text-gray-700 ${delete_mode ? `cursor-pointer ${rowsToDelete.has(property.id) ? 'bg-red-300' : ''}` : 'hover:bg-gray-50'}`}>
                            {/* Carat Column */}
                            <td className="w-[50px] px-3 py-4 text-center">
                                {hasTenants && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            togglePropertyExpansion(property.id);
                                        }}
                                        className={`w-full h-full flex items-center justify-center transition-transform duration-200 ${isExpanded ? '-rotate-90' : '-rotate-180'}`}
                                    >
                                        <ChevronIcon className="w-6 h-6 text-gray-600" />
                                    </button>
                                )}
                            </td>
                            {/* Address Column */}
                            <td className="px-6 py-4 text-left font-medium ">
                                {property.address}
                            </td>
                            {/* Tenant Count Column */}
                            <td className="px-6 py-4 font-medium text-left">
                                {propertyTenants.length}
                            </td>
                        </tr>
                        
                        {/* Expandable Tenant Details */}
                        {isExpanded && hasTenants && (
                            <tr>
                                <td colSpan={3} className="p-0">
                                    <div className="bg-[#F8F9FA] border-t border-[#E4F0F6]">
                                        <div className="px-6 py-3">
                                            <h4 className="text-lg font-bold text-[#404040] mb-3">Tenants</h4>
                                            <div className="bg-white border border-[#E4F0F6] rounded-lg overflow-hidden">
                                                <table className="min-w-full">
                                                    <thead className="bg-[#F8F9FA] border-b border-[#E4F0F6]">
                                                        <tr>
                                                            <th className="px-4 py-3 text-left text-xs text-[#80848A] font-semibold tracking-wider">
                                                                Name
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs text-[#80848A] font-semibold tracking-wider">
                                                                Email
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs text-[#80848A] font-semibold tracking-wider">
                                                                Phone
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs text-[#80848A] font-semibold tracking-wider">
                                                                Rent Amount
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs text-[#80848A] font-semibold tracking-wider">
                                                                Rent Due Date
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-[#E4F0F6]">
                                                        {propertyTenants.map((tenant) => (
                                                            <tr key={tenant.id} className="hover:bg-gray-50">
                                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                                    {tenant.first_name} {tenant.last_name}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                                    {tenant.email || '-'}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                                    {tenant.phone_number || '-'}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                                    ${tenant.rent_amount}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                                    {tenant.rent_due_date}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                );
            })}
        </>
    );
};

export default DisplayPropertyRows;
