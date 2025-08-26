import React from "react";
import { useState } from "react";
import CreateTenant from "./CreateTenant";
import CreateBtn from "../CreateBtn";
import { useStore } from "@/store";
import { Property } from "../../types/propertyTypes";
import capitilizeStr from "../../../utils/formatStrings";

interface CreateTenantsPopUpProps {
    property: Property;
    onClose: () => void;
}

export default function CreateTenantsPopUp({ property, onClose }: CreateTenantsPopUpProps) {
    const { createTenants, isCudLoadingProperties } = useStore()
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
                value = capitilizeStr(String(value)) 
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
        e.preventDefault();
        const tenantsWithPropertyId = tenants.map(tenant => ({
            ...tenant,
            first_name: tenant.first_name.trim(),
            last_name: tenant.last_name.trim(),
            property_id: property.id
        }));
        createTenants(tenantsWithPropertyId).then(() => setTenantCount(0)).then(() => setTenants([])).then(() => onClose());
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-10">
            <div className="bg-white rounded-lg shadow-lg p-8 min-w-[750px] relative overflow-y-auto max-h-[95vh]">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700 text-xl font-bold"
                    aria-label="Close"
                >
                    &times;
                </button>
                <h2 className="text-xl font-semibold mb-4 text-[#2A7D7B]">Add Tenants to Property {property.address}</h2>
                <form onSubmit={handleSubmit}>
                    {/* Render CreateTenant here, pass required props */}
                    <CreateTenant
                        tenantCount={tenantCount}
                        setTenantCount={setTenantCount}
                        tenants={tenants}
                        handleTenantChange={handleTenantChange}
                    />
                    <div className=''>
                        <CreateBtn disabled={isCudLoadingProperties} />
                    </div>
                </form>
            </div>
        </div>
    );
}