'use client';

import React from 'react';
import { Vendor } from '../../types/vendorTypes';
import SettingsEditInput from '../edits/SettingsEditInput';
import SettingsEditActive from '../edits/SettingsEditActive';
import SaveIcon from '@/app/(private)/components/svgs/SaveIcon';
import EditIcon from '@/app/(private)/components/svgs/EditIcon';
import { useStore } from '@/store';

interface DisplayVendorRowsProps {
    filteredVendors: Vendor[];
    editingRows: Set<number>;
    getVendorData: (vendorId: number) => Vendor | undefined;
    handleVendorNameChange: (vendorId: number, newName: string) => void;
    handleStatusToggle: (vendorId: number) => void;
    handleEditClick: (vendorId: number) => void;
    isValidName: (vendorId: number) => boolean;
}

export default function DisplayVendorRows({
    filteredVendors,
    editingRows,
    getVendorData,
    handleVendorNameChange,
    handleStatusToggle,
    handleEditClick,
    isValidName
}: DisplayVendorRowsProps) {
    const { isCudVendorLoading } = useStore();

    if (filteredVendors.length === 0) {
        return (
            <tr>
                <td colSpan={3} className="text-center text-gray-500 py-4">
                    No vendors found
                </td>
            </tr>
        );
    }

    return (
        <>
            {filteredVendors.map((vendor) => {
                const isEditing = editingRows.has(vendor.id);
                const vendorData = getVendorData(vendor.id);
                return (
                    <tr key={vendor.id} className="hover:bg-gray-50">
                        <SettingsEditInput
                            value={vendorData?.vendor_name || ''}
                            onChange={(newName) => handleVendorNameChange(vendor.id, newName)}
                            isEditing={isEditing}
                            disabled={isEditing && isValidName(vendor.id)}
                        />
                        <SettingsEditActive
                            isActive={vendorData?.active || false}
                            isEditing={isEditing}
                            onToggle={() => handleStatusToggle(vendor.id)}
                        />
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                                onClick={() => handleEditClick(vendor.id)}
                                disabled={isEditing && isValidName(vendor.id) || isCudVendorLoading}
                                className={`mr-4 p-2 rounded-full ${
                                    isEditing && isValidName(vendor.id) || isCudVendorLoading
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-[#0C3C74] hover:text-[#2A7D7B] hover:bg-gray-100'
                                }`}
                            >
                                {isEditing ? (
                                    <SaveIcon className="w-5 h-5" />
                                ) : (
                                    <EditIcon className="w-5 h-5" />
                                )}
                            </button>
                        </td>
                    </tr>
                );
            })}
        </>
    );
} 