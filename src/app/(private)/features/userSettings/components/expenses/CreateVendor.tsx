'use client';

import { useState } from 'react';
import CreateBtn from '../CreateBtn';
import { vendorFormValidation } from '../../utils/formValidation/formValidationUtil';
import { Vendor } from '../../types/vendorTypes';
import { useStore } from '@/store';

export default function CreateVendor() {
    const { vendorState, createVendor, isCudVendorLoading } = useStore();
    const [vendorName, setVendorName] = useState('');
    const [validInput, setValidInput] = useState(true);
    const [hasEdited, setHasEdited] = useState(false);

    const handleVendorNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.toUpperCase();
        setVendorName(newValue);
        setHasEdited(true);

        const vendor: Vendor = { id: 0, vendor_name: newValue, active: true };
        const existingVendors = vendorState.vendors?.map(v => v.vendor_name) || [];
        const validation = vendorFormValidation.validateVendorForm(vendor, existingVendors, "");
        setValidInput(validation.isValid);
    };

    const handleSubmit = () => {
        if (validInput && vendorName.trim()) {
            createVendor(vendorName).then(() => {
                setVendorName('');
                setHasEdited(false);
            });
        }
    };

    return (
        <div>
            <h3 className="text-xl font-semibold text-[#404040]">Create Vendor</h3>
            <div className="h-[16px] text-center"> 
            {vendorState.error && (
                 <p className="text-sm font-semibold text-red-500">  Something went wrong!</p>
            )}
             
            </div>
           
            <div className="bg-white border border-[#E4F0F6] rounded-lg shadow-sm px-4 py-6 max-w-[600px]">
                {/* Form Label */}
                <div className="flex mb-3">
                    <label htmlFor="vendorName" className="text-[16px] text-[#80848A] font-semibold">Vendor Name</label>
                </div>
                {/* Form Inputs & Button */}
                <div className="flex gap-4 pb-4">
                    <div className="flex flex-col">
                        <input
                            type="text"
                            id="vendorName"
                            value={vendorName}
                            onChange={handleVendorNameChange}
                            className={`w-[240px] h-[40px] border border-2 rounded-md px-3 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B] ${
                                hasEdited && !validInput ? 'border-red-500' : 'border-[#8ABBFD]'
                            }`}
                            placeholder="AMADO VERDURA"
                        />
                    </div>
                    <CreateBtn onSubmit={handleSubmit} disabled={hasEdited && !validInput || isCudVendorLoading} />
                </div>
            </div>
        </div>
    );
}
