'use client';

import React, { useState, useEffect } from 'react';
import { Vendor } from '../../types/vendorTypes';
import { filterByIncludes } from '../../../utils/searchUtils';
import SearchBar from '../SearchBar';
import MaximizeIcon from '@/app/(private)/components/svgs/MaximizeIcon';
import MinimizeIcon from '@/app/(private)/components/svgs/MinimizeIcon';
import DisplayVendorRows from './DisplayVendorRows';
import { vendorFormValidation } from '@/app/(private)/features/userSettings/utils/formValidation/formValidationUtil';
import { useStore } from '@/store';

export default function DisplayVendors() {
    const { updateVendorRow, vendorState } = useStore();
    let vendors: Vendor[] = [];
    if (vendorState.vendors) {
        vendors = vendorState.vendors;
    }
    const [filteredVendors, setFilteredVendors] = useState(
        [...vendors].sort((a, b) => a.vendor_name.localeCompare(b.vendor_name))
    );
    const [isMaximized, setIsMaximized] = useState(false);
    const [editingRows, setEditingRows] = useState<Set<number>>(new Set());
    const [editedVendors, setEditedVendors] = useState<Vendor[]>([]);
    const vendorNames = vendors.map(vendor => vendor.vendor_name);

    useEffect(() => {
        if (vendorState.vendors) {
            setFilteredVendors([...vendorState.vendors].sort((a, b) => a.vendor_name.localeCompare(b.vendor_name)));
        }
    }, [vendorState.vendors]);

    const handleSearch = (query: string) => {
       
        const filteredVendorNames = filterByIncludes(vendorNames, query);
        const matchedVendors = filteredVendorNames.map(name => 
            vendors.find(vendor => vendor.vendor_name === name)
        ).filter((vendor): vendor is Vendor => vendor !== undefined);
        setFilteredVendors(matchedVendors);
    };

    const toggleMaximize = () => {
        setIsMaximized(!isMaximized);
    };

    const handleEditClick = (vendorId: number) => {
        if (editingRows.has(vendorId)) {
            // Trim leading and trailing spaces from vendor_name before saving
            const vendorToUpdate = editedVendors.find(v => v.id === vendorId);
            if (vendorToUpdate && vendorToUpdate.vendor_name) {
                vendorToUpdate.vendor_name = vendorToUpdate.vendor_name.trim();
                setEditedVendors(editedVendors.map(vendor => 
                    vendor.id === vendorId ? { ...vendor, vendor_name: vendorToUpdate.vendor_name } : vendor
                ));
                updateVendorRow(vendorToUpdate);
            }
            
            const newEditingRows = new Set(editingRows);
            newEditingRows.delete(vendorId);
            setEditingRows(newEditingRows);
        } else {
            // Start editing
            const newEditingRows = new Set(editingRows);
            newEditingRows.add(vendorId);
            setEditingRows(newEditingRows);
            const vendorToEdit = filteredVendors.find(v => v.id === vendorId);
            if (vendorToEdit) {
                setEditedVendors([...editedVendors, { ...vendorToEdit }]);
            }
        }
    };

    const handleVendorNameChange = (vendorId: number, newName: string) => {
        setEditedVendors(editedVendors.map(vendor => 
            vendor.id === vendorId ? { ...vendor, vendor_name: newName } : vendor
        ));
    };

    const handleStatusToggle = (vendorId: number) => {
        setEditedVendors(editedVendors.map(vendor => 
            vendor.id === vendorId ? { ...vendor, active: !vendor.active } : vendor
        ));
    };

    const getVendorData = (vendorId: number) => {
        return editedVendors.find(v => v.id === vendorId) || 
               filteredVendors.find(v => v.id === vendorId);
    };

    const isValidName = (vendorId: number) => {
        const vendorData = getVendorData(vendorId);
        const originalVendorName = vendors.find(v => v.id === vendorId)?.vendor_name || '';
        return !vendorFormValidation.validateVendorForm(vendorData, vendorNames, originalVendorName).isValid;
    };


    return (
        <div className="max-w-[600px] ">
            <h3 className="text-xl text-left font-semibold text-[#404040] mb-4">My Vendors</h3>
            {/* Begin Table Container  */}
            <div className="bg-white border border-[#E4F0F6] rounded-lg shadow-sm pb-4">


                {vendors.length === 0 ? (
                    <p className="text-blue-600 text-center text-xl py-4">Please refresh the page</p>
                ) : (
                    <div className="">
                        {/* Begin Table Container  */}
                        <div className={` ${isMaximized ? "" : " min-h-[360px] max-h-[360px] overflow-y-auto "}`}>
                            {/* Begin Table Header */}
                            <div className="flex items-center justify-center border-b border-b-[#E4F0F6] py-4 relative">
                                {/* Search Bar */}
                                <div>
                                    <SearchBar onSearch={handleSearch} />
                                </div>
                                <button
                                    onClick={toggleMaximize}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    {isMaximized ? (
                                        <MinimizeIcon className="w-5 h-5 text-[#80848A]" />
                                    ) : (
                                        <MaximizeIcon className="w-5 h-5 text-[#80848A]" />
                                    )}
                                </button>
                            </div>
                            {/* Begin Table Data  */}
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className={`${isMaximized ? '' : 'sticky top-0'} z-10 text-[16px] bg-white after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[1.5px] after:bg-[#E4F0F6]`}>
                                    <tr>
                                        <th scope="col" className="w-[300px] min-w-[300px] max-w-[300px] mx-auto overflow-hidden px-6 py-3 text-left text-xs text-[#80848A] text-[16px] tracking-wider">
                                            Vendor Name
                                        </th>
                                        <th scope="col" className="w-[100px] min-w-[100px] max-w-[100px] px-10 py-3 text-left text-xs text-[#80848A] text-[16px] tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs text-[#80848A] text-[16px] tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-[#E4F0F6] divide-y-[2px] border-b border-[#E4F0F6]">
                                    <DisplayVendorRows
                                        filteredVendors={filteredVendors}
                                        editingRows={editingRows}
                                        getVendorData={getVendorData}
                                        handleVendorNameChange={handleVendorNameChange}
                                        handleStatusToggle={handleStatusToggle}
                                        handleEditClick={handleEditClick}
                                        isValidName={isValidName}
                                    />
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
