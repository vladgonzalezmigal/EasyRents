import React, { useState } from "react";
import { Tenant } from "../../types/tenantTypes";
import { useStore } from "@/store";
import TrashIcon from "@/app/(private)/components/svgs/TrashIcon";
import EditIcon from "@/app/(private)/components/svgs/EditIcon";
import SaveIcon from "@/app/(private)/components/svgs/SaveIcon";

interface DisplayTenantRowsProps {
    property_id: number,
    propertyTenants: Tenant[];
}

const DisplayTenantRows: React.FC<DisplayTenantRowsProps> = ({ property_id, propertyTenants }) => {
    const { deleteTenants, updateTenants, isCudLoadingTenants } = useStore();
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [rowsToDelete, setRowsToDelete] = useState<Set<number>>(new Set());
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editedTenants, setEditedTenants] = useState<Map<number, Partial<Tenant>>>(new Map());

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

    const handleEditToggleOrSave = () => {
        if (deleteMode) { return }
        if (editMode && editedTenants.size > 0) {
            // Prepare payload for updateTenants
            const payload = Array.from(editedTenants.entries()).map(([id, data]) => ({
                id,
                property_id,
                first_name: data.first_name ?? propertyTenants.find(t => t.id === id)?.first_name ?? "",
                last_name: data.last_name ?? propertyTenants.find(t => t.id === id)?.last_name ?? "",
                rent_amount: isNaN(Number(data.rent_amount)) || Number(data.rent_amount) < 0 ? Number(propertyTenants.find(t => t.id === id)?.rent_amount) ?? 0 : Number(data.rent_amount) ?? 0,
                rent_due_date: isNaN(Number(data.rent_due_date)) || Number(data.rent_due_date) <= 0 ? Number(propertyTenants.find(t => t.id === id)?.rent_due_date) ?? 1: Number(data.rent_due_date) ?? 1,
                phone_number: data.phone_number ?? propertyTenants.find(t => t.id === id)?.phone_number ?? "",
                email: data.email ?? propertyTenants.find(t => t.id === id)?.email ?? "",
            }));
            updateTenants(payload);
            setEditedTenants(new Map());
            setEditMode(false);
            return;
        }
        setEditMode((prev) => !prev);
    };

    const handleTenantEdit = (tenantId: number, field: keyof Tenant, value: string) => {
        setEditedTenants(prev => {
            const next = new Map(prev);
            const current = next.get(tenantId);
            next.set(tenantId, { ...current, [field]: value });
            return next;
        });
    };

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
                            <button
                                onClick={handleEditToggleOrSave}
                                disabled={isCudLoadingTenants}
                                className={`disabled:opacity-50 disabled:cursor-default cursor-pointer rounded-full p-1.5 transition-colors text-[#0C3C74] hover:text-[#2A7D7B] ${editMode ? 'bg-blue-50' : 'hover:bg-gray-100'} w-[28px] h-[28px] flex items-center justify-center `}
                            >
                                {(editMode && editedTenants.size > 0) ? (
                                    <SaveIcon className="w-4 h-4" />
                                ) : (
                                    <EditIcon className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        <div className="bg-white border border-[#E4F0F6] rounded-lg overflow-hidden">
                            <table className="min-w-full">
                                <thead className="bg-[#F8F9FA] border-b border-[#E4F0F6]">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs text-[#80848A] font-semibold tracking-wider">
                                            First
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs text-[#80848A] font-semibold tracking-wider">
                                            Last
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
                                                    {editMode ? (
                                                        <input
                                                            type="text"
                                                            value={editedTenants.get(tenant.id)?.first_name ?? tenant.first_name}
                                                            onChange={e => handleTenantEdit(tenant.id, "first_name", e.target.value)}
                                                            className="w-[70px] border border-[#8ABBFD] rounded-md px-2"
                                                        />
                                                    ) : (tenant.first_name)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                    {editMode ? (
                                                        <input
                                                            type="text"
                                                            value={editedTenants.get(tenant.id)?.last_name ?? tenant.last_name}
                                                            onChange={e => handleTenantEdit(tenant.id, "last_name", e.target.value)}
                                                            className="w-[70px] border border-[#8ABBFD] rounded-md px-2"
                                                        />
                                                    ) : (tenant.last_name)}
                                            </td>
                                            
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {editMode ? (
                                                    <input
                                                        type="email"
                                                        value={editedTenants.get(tenant.id)?.email ?? tenant.email}
                                                        onChange={e => handleTenantEdit(tenant.id, "email", e.target.value)}
                                                        className="w-[100px] border border-[#8ABBFD] rounded-md px-2"
                                                    />
                                                ) : (tenant.email || '-')}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {editMode ? (
                                                    <input
                                                        type="text"
                                                        value={editedTenants.get(tenant.id)?.phone_number ?? tenant.phone_number}
                                                        onChange={e => handleTenantEdit(tenant.id, "phone_number", e.target.value)}
                                                        className="w-[100px] border border-[#8ABBFD] rounded-md px-2"
                                                    />
                                                ) : (tenant.phone_number || '-')}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {editMode ? (
                                                    <input
                                                        type="text"
                                                        value={editedTenants.get(tenant.id)?.rent_amount ?? tenant.rent_amount}
                                                        onChange={e => handleTenantEdit(tenant.id, "rent_amount", e.target.value)}
                                                        className="w-[80px] border border-[#8ABBFD] rounded-md px-2"
                                                    />
                                                ) : (`$${tenant.rent_amount}`)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {editMode ? (
                                                    <input
                                                        type="text"
                                                        value={editedTenants.get(tenant.id)?.rent_due_date ?? tenant.rent_due_date}
                                                        onChange={e => handleTenantEdit(tenant.id, "rent_due_date", e.target.value)}
                                                        className="w-[80px] border border-[#8ABBFD] rounded-md px-2"
                                                    />
                                                ) : (tenant.rent_due_date)}
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
