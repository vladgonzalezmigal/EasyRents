'use client';

import { useState } from 'react';
import CreateBtn from '../CreateBtn';
import { useStore } from '@/store';
import capitalizeStr from '../../../utils/formatStrings';


interface CreatePropertyProps {
    company_id: string | number;
}

export default function CreateProperty({ company_id: company_id }: CreatePropertyProps
) {
    const { createProperty, isCudLoadingProperties } = useStore();
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [stateVal, setStateVal] = useState('');
    const [zip, setZip] = useState('');
    const [tenantName, setTenantName] = useState('');
    const [tenantEmail, setTenantEmail] = useState('');
    const [tenantPhone, setTenantPhone] = useState('');
    const [rentAmount, setRentAmount] = useState('');
    const [rentDueDate, setRentDueDate] = useState('');

    const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: fix small comma bug when 
        const address = `${capitalizeStr(address1)} ${capitalizeStr(address2)}, ${capitalizeStr(city)}, ${stateVal.toUpperCase()}, ${zip}`.trim();
        if (address1 && city && stateVal && zip && tenantName  && rentAmount && rentDueDate) {
            createProperty(Number(company_id), address, capitalizeStr(tenantName), Number(rentAmount), Number(rentDueDate), tenantEmail, tenantPhone,).then(() => {
                setAddress1(''); setAddress2(''); setCity(''); setStateVal(''); setZip('');
                setTenantName(''); setTenantEmail(''); setTenantPhone(''); setRentAmount(''); setRentDueDate('');
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
                {/* Tenant & Rent Inputs */}
                <div className="flex gap-4 pb-4">
                    <div className="flex flex-col ml-2">
                        <label htmlFor="tenantName" className="text-[16px] text-[#80848A] font-semibold text-left mb-1 ml-1">Tenant Name</label>
                        <input type="text" id="tenantName" required value={tenantName} onChange={e => setTenantName(e.target.value)} placeholder="Joaquin Rodriguez" className="w-[200px] h-[40px] border border-2 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B] border-[#8ABBFD]" />
                    </div>
                    <div className="flex flex-col ml-2">
                        <label htmlFor="tenantEmail" className="text-[16px] text-[#80848A] font-semibold text-left mb-1 ml-1">Tenant Email</label>
                        <input type="email" id="tenantEmail" value={tenantEmail} onChange={e => setTenantEmail(e.target.value)} placeholder="rodriguez-joaquin@comcast.net" className="w-[200px] h-[40px] border border-2 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B] border-[#8ABBFD]" />
                    </div>
                    <div className="flex flex-col ml-2">
                        <label htmlFor="tenantPhone" className="text-[16px] text-[#80848A] font-semibold text-left mb-1 ml-1">Tenant Phone</label>
                        <input type="text" id="tenantPhone" value={tenantPhone} onChange={e => setTenantPhone(e.target.value)} placeholder="5104851584" className="w-[120px] h-[40px] border border-2 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B] border-[#8ABBFD]" />
                    </div>
                </div>
                <div className="flex gap-4 pb-4">
                    <div className="flex flex-col ml-2">
                        <label htmlFor="rentAmount" className="text-[16px] text-[#80848A] font-semibold text-left mb-1 ml-1">Rent Amount</label>
                        <input type="number" id="rentAmount" required value={rentAmount} onChange={e => setRentAmount(e.target.value)} placeholder="$1500" className="w-[120px] h-[40px] border border-2 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B] border-[#8ABBFD]" />
                    </div>
                    <div className="flex flex-col ml-2">
                        <label htmlFor="rentDueDate" className="text-[16px] text-[#80848A] font-semibold text-left mb-1 ml-1">Rent Due Date (day)</label>
                        <input type="number" id="rentDueDate" required value={rentDueDate} onChange={e => setRentDueDate(e.target.value)} placeholder="1" className="w-[160px] h-[40px] border border-2 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B] border-[#8ABBFD]" />
                    </div>
                </div>
                <div className='ml-2'>
                    <CreateBtn disabled={isCudLoadingProperties} />
                </div>
            </form>
        </div>
    );
}
