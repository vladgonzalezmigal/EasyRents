import React from "react";
import { Tenant } from "../../types/tenantTypes";

interface DisplayTenantRowsProps {
    propertyTenants: Tenant[];
}

const DisplayTenantRows: React.FC<DisplayTenantRowsProps> = ({ propertyTenants }) => {
    if (!propertyTenants || propertyTenants.length === 0) {
        return null;
    }

    return (
        <tr>
            <td colSpan={3} className="p-0">
                <div className="bg-[#FFFFFF] border-t border-[#E4F0F6]">
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
                                            <td className="px-4 py-3 text-sm text-sm text-gray-700">
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
    );
};

export default DisplayTenantRows;
