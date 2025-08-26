'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import CreateTenant from './CreateTenant';
import CreateBtn from '../CreateBtn';
import capitalizeStr from '../../../utils/formatStrings';


interface CreatePropertyProps {
    company_id: string | number;
}

export default function CreateProperty({ company_id: company_id, }: CreatePropertyProps
) {
    const { propertyState, createProperty, isCudLoadingProperties } = useStore();
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [stateVal, setStateVal] = useState('');
    const [zip, setZip] = useState('');
    const [tenantCount, setTenantCount] = useState(0);
    const [tenants, setTenants] = useState<Array<{
        first_name: string;
        last_name: string;
        email: string;
        phone_number: string;
        rent_amount: number;
        rent_due_date: number;
    }>>([]);

    const handleTenantChange = (index: number, field: string, value: string | number) => {
        setTenants(prev => {
            const newTenants = [...prev];
            if (!newTenants[index]) {
                newTenants[index] = {
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone_number: '',
                    rent_amount: 0,
                    rent_due_date: 1
                };
            }
            if (field === 'first_name' || field === 'last_name') {
                value = capitalizeStr(String(value))
            }
            if (field === 'rent_amount') {
                value = isNaN(Number(value)) ? 0 : Number(value) < 0 ? 0 : Number(value);
            } else if (field === 'rent_due_date') {
                value = isNaN(Number(value)) ? 1 : Number(value) < 1 ? 1 : Number(value);
            }
            newTenants[index] = { ...newTenants[index], [field]: value };
            return newTenants;
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (propertyState.error) {
            return
        }
        e.preventDefault();
        const address = (address2 != '') ? `${capitalizeStr(address1)} ${capitalizeStr(address2)}` : capitalizeStr(address1);
        const complete_address = `${address}, ${capitalizeStr(city)}, ${stateVal.toUpperCase()}, ${zip}`.trim();
        const cleaned_tenants = tenants.map(tenant => ({
            ...tenant,
            first_name: tenant.first_name.trim(),
            last_name: tenant.last_name.trim(),
        }));
        if (address1 && city && stateVal && zip) {
            createProperty(Number(company_id), complete_address, cleaned_tenants).then(() => {
                setAddress1(''); setAddress2(''); setCity(''); setStateVal(''); setZip('');
                setTenantCount(0);
                setTenants([]);
            });
        }
    };

    return (
        <div>
            <h3 className="text-xl font-semibold text-[#404040]">Create New Property</h3>
            <div className="h-[16px] text-center">
                {/* Error handling can be added here if needed */}
            </div>
            <form onSubmit={handleSubmit} className="bg-white border border-[#E4F0F6] rounded-lg shadow-sm px-4 py-6 max-w-[750px]">
                {/* Form Label */}
                <div className="flex mb-3">
                </div>
                {/* Address Inputs */}
                <div className="flex gap-2 pb-4">
                    <div className="flex flex-col ml-2">
                        <label htmlFor="address1" className="text-[16px] text-[#80848A] font-semibold text-left mb-1 ml-1">Address #1</label>
                        <input type="text" id="address1" required value={address1} onChange={e => setAddress1(e.target.value)} placeholder="12955 San Pablo Ave" className="w-[200px] h-[40px] border border-2 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B] border-[#8ABBFD]" />
                    </div>
                    <div className="flex flex-col ml-2">
                        <label htmlFor="address2" className="text-[16px] text-[#80848A] font-semibold text-left mb-1 ml-1">Address #2</label>
                        <input type="text" id="address2" value={address2} onChange={e => setAddress2(e.target.value)} placeholder="El Agave Azul" className="w-[150px] h-[40px] border border-2 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B] border-[#8ABBFD]" />
                    </div>
                    <div className="flex flex-col ml-2">
                        <label htmlFor="city" className="text-[16px] text-[#80848A] font-semibold text-left mb-1 ml-1">City</label>
                        <input type="text" id="city" required value={city} onChange={e => setCity(e.target.value)} placeholder="Richmond" className="w-[100px] h-[40px] border border-2 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B] border-[#8ABBFD]" />
                    </div>
                    <div className="flex flex-col ml-2">
                        <label htmlFor="stateVal" className="text-[16px] text-[#80848A] font-semibold text-left mb-1 ml-1">State</label>
                        <input type="text" id="stateVal" required value={stateVal} onChange={e => setStateVal(e.target.value)} placeholder="CA" className="w-[60px] h-[40px] border border-2 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B] border-[#8ABBFD]" />
                    </div>
                    <div className="flex flex-col ml-2">
                        <label htmlFor="zip" className="text-[16px] text-[#80848A] font-semibold text-left mb-1 ml-1">Zip</label>
                        <input type="text" id="zip" required value={zip} onChange={e => setZip(e.target.value)} placeholder="94805" className="w-[100px] h-[40px] border border-2 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B] border-[#8ABBFD]" />
                    </div>
                </div>
                {/* Dynamic Tenant Rows & Tenant Count Selector */}
                <CreateTenant
                    tenantCount={tenantCount}
                    setTenantCount={setTenantCount}
                    tenants={tenants}
                    handleTenantChange={handleTenantChange}
                />

                <div className='ml-2'>
                    <CreateBtn disabled={isCudLoadingProperties} />
                </div>
            </form>
        </div>
    );
}
