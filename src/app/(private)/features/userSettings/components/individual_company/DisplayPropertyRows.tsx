import React, { useState, useEffect } from "react";
import { Property } from "../../types/propertyTypes";
import { useStore } from "@/store";
import ChevronIcon from "@/app/(private)/components/svgs/ChevronIcon";
import DisplayTenantRows from './DisplayTenantRows';

interface DisplayPropertyRowsProps {
    properties: Property[];
    delete_mode: boolean;
    rowsToDelete: Set<number>;
    addToDelete: (id: number) => void; 
    edit_mode: boolean;
    editedAddresses: Map<number, string>;
    onEditAddressChange: (propertyId: number, address: string) => void;
    matchingPropertyIds: Set<number>;
    onPropertyRowClick?: (property: Property) => void;
}

const DisplayPropertyRows: React.FC<DisplayPropertyRowsProps> = ({ properties, delete_mode, rowsToDelete, addToDelete, edit_mode, editedAddresses, onEditAddressChange, matchingPropertyIds, 
    onPropertyRowClick
 }) => {
    const { tenantState } = useStore()
    const [expandedProperties, setExpandedProperties] = useState<Set<number>>(new Set());

    // Auto-expand properties that contain matching tenants
    useEffect(() => {
        if (matchingPropertyIds.size > 0) {
            setExpandedProperties(matchingPropertyIds);
        } else {
            setExpandedProperties(new Set())
        }
    }, [matchingPropertyIds]);

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
                const isExpanded = !delete_mode && !edit_mode && expandedProperties.has(property.id);

                return (
                    <React.Fragment key={property.id}>
                        <tr className={`text-gray-700 ${(delete_mode) ? `cursor-pointer ${rowsToDelete.has(property.id) ? 'bg-red-200' : ''}` : 'hover:bg-gray-50'}`}
                        onClick={() => {
                            if (delete_mode) {
                                addToDelete(property.id);
                            } else if (!edit_mode && onPropertyRowClick) {
                                onPropertyRowClick(property);
                            }
                        }}>
                            {/* Carat Column */}
                            <td className="w-[25px] px-1 py-4 text-center">
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
                                {edit_mode ? (
                                    <input
                                        type="text"
                                        value={editedAddresses.get(property.id) ?? property.address}
                                        onChange={(e) => onEditAddressChange(property.id, e.target.value)}
                                        className="w-full h-[36px] border border-[#E4F0F6] rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B]"
                                    />
                                ) : (
                                    property.address
                                )}
                            </td>
                            {/* Rent Amount Column */}
                            <td className="px-6 py-4 font-medium text-left">
                                ${propertyTenants.reduce((sum, tenant) => sum + Number(tenant.rent_amount), 0).toLocaleString('en-US')}
                            </td>
                            {/* Tenant Count Column */}
                            <td className="px-6 py-4 font-medium text-left">
                                {propertyTenants.length}
                            </td>
                            
                        </tr>
                        {/* Expandable Tenant Details */}
                        {isExpanded && hasTenants && (
                            <DisplayTenantRows property_id={property.id} propertyTenants={propertyTenants} />
                        )}
                    </React.Fragment>
                );
            })}
            
        </>
    );
};

export default DisplayPropertyRows;
