'use client';

import React from 'react';
import { Store } from '../../types/storeTypes';
import SettingsEditInput from '../edits/SettingsEditInput';
import SettingsEditActive from '../edits/SettingsEditActive';
import SaveIcon from '@/app/(private)/components/svgs/SaveIcon';
import EditIcon from '@/app/(private)/components/svgs/EditIcon';
import { useStore } from '@/store';

interface DisplayStoreRowsProps {
    filteredStores: Store[];
    editingRows: Set<number>;
    getStoreData: (storeId: number) => Store | undefined;
    handleStoreNameChange: (storeId: number, newName: string) => void;
    handleStatusToggle: (storeId: number) => void;
    handleEditClick: (storeId: number) => void;
    isValidName: (storeId: number) => boolean;
}

export default function DisplayStoreRows({
    filteredStores,
    editingRows,
    getStoreData,
    handleStoreNameChange,
    handleStatusToggle,
    handleEditClick,
    isValidName
}: DisplayStoreRowsProps) {
    const { isCudStoreLoading } = useStore();

    if (filteredStores.length === 0) {
        return (
            <tr>
                <td colSpan={3} className="text-center text-gray-500 py-4">
                    No stores found
                </td>
            </tr>
        );
    }

    return (
        <>
            {filteredStores.map((store) => {
                const isEditing = editingRows.has(store.id);
                const storeData = getStoreData(store.id);
                return (
                    <tr key={store.id} className="hover:bg-gray-50">
                        <SettingsEditInput
                            value={storeData?.store_name || ''}
                            onChange={(newName) => handleStoreNameChange(store.id, newName)}
                            isEditing={isEditing}
                            disabled={isEditing && isValidName(store.id)}
                        />
                        <SettingsEditActive
                            isActive={storeData?.active || false}
                            isEditing={isEditing}
                            onToggle={() => handleStatusToggle(store.id)}
                        />
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                                onClick={() => handleEditClick(store.id)}
                                disabled={isEditing && isValidName(store.id) || isCudStoreLoading}
                                className={`mr-4 p-2 rounded-full ${
                                    isEditing && isValidName(store.id) || isCudStoreLoading
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
