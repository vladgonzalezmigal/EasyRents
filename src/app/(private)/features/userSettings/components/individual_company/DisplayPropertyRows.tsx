import React, { useState } from "react";
import { Property } from "../../types/propertyTypes";
import { useStore } from "@/store";
import ChevronIcon from "@/app/(private)/components/svgs/ChevronIcon";
import DisplayTenantRows from './DisplayTenantRows';

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
                const isExpanded = !delete_mode && expandedProperties.has(property.id);

                return (
                    <React.Fragment key={property.id}>
                        <tr className={`text-gray-700 ${delete_mode ? `cursor-pointer ${rowsToDelete.has(property.id) ? 'bg-red-200' : ''}` : 'hover:bg-gray-50'}`}
                        onClick={() => addToDelete(property.id)}>
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
                            <DisplayTenantRows propertyTenants={propertyTenants} />
                        )}
                    </React.Fragment>
                );
            })}
        </>
    );
};

export default DisplayPropertyRows;
