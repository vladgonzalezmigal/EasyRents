import React, { useState } from "react";
import { Tenant } from "../../types/tenantTypes";
import { useStore } from "@/store";
import TrashIcon from "@/app/(private)/components/svgs/TrashIcon";

interface DisplayTenantRowsProps {
    property_id: number,
    propertyTenants: Tenant[];
}

const DisplayTenantRows: React.FC<DisplayTenantRowsProps> = ({ property_id, propertyTenants }) => {
    const { deleteTenants } = useStore()
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [rowsToDelete, setRowsToDelete] = useState<Set<number>>(new Set());

    const addToDelete = (id: number) => {
        if (rowsToDelete.has(id)) {
            setRowsToDelete((prevSet) => {
                const newSet = new Set(prevSet);
                newSet.delete(id);
                return newSet;
            });
        } else {
            setRowsToDelete((prevSet) => new Set(prevSet).add(id));
        }
    };

    const handleDeleteClick = async () => {
        if (rowsToDelete.size > 0) {
            await deleteTenants(property_id, Array.from(rowsToDelete));
            setRowsToDelete(new Set());
            setDeleteMode(false);
        }
    };

    if (!propertyTenants || propertyTenants.length === 0) {
        return null;
    }

    return (
        <tr>
            <td className="w-[25px] px-1 py-0"></td>
            <td colSpan={3} className="p-0">
                <div className="bg-[#FFFFFF] border-t border-[#E4F0F6]">
                    <div className="px-6 py-3">
                        <div className="flex items-center gap-x-1.5 mb-3">
                            <h4 className="text-lg font-bold text-[#404040]">Tenants</h4>
                            <button
                                onClick={() => {
                                    if (rowsToDelete.size) {
                                        handleDeleteClick();
                                    } else {
                                        setDeleteMode((prev) => !prev);
                                    }
                                }}
                                className={`cursor-pointer p-1.5 rounded-full transition-colors ${deleteMode
                                    ? `text-red-700 hover:text-red-800 ${rowsToDelete.size ? 'bg-red-100' : 'bg-red-50'}`
                                    : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                                    }`}
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
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
                                        <tr 
                                            key={tenant.id} 
                                            className={`${deleteMode ? `cursor-pointer ${rowsToDelete.has(tenant.id) ? 'bg-red-200' : ''}` : 'hover:bg-gray-50'}`}
                                            onClick={() => { if (deleteMode) addToDelete(tenant.id); }}
                                        >
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
    );
};

export default DisplayTenantRows;
