'use client';

import React, { useState, useEffect } from 'react';
import { Store } from '../../types/storeTypes';
import { filterByIncludes } from '../../../utils/searchUtils';
import SearchBar from '../SearchBar';
import MaximizeIcon from '@/app/(private)/components/svgs/MaximizeIcon';
import MinimizeIcon from '@/app/(private)/components/svgs/MinimizeIcon';
import DisplayStoreRows from './DisplayStoreRows';
import { storeFormValidation } from '@/app/(private)/features/userSettings/utils/formValidation/formValidationUtil';
import { useStore } from '@/store';

export default function DisplayStores() {
    const { updateStore, storeState } = useStore();
    let stores: Store[] = [];
    if (storeState.stores) {
        stores = storeState.stores;
    }
    const [filteredStores, setFilteredStores] = useState(
        [...stores].sort((a, b) => a.store_name.localeCompare(b.store_name))
    );
    const [isMaximized, setIsMaximized] = useState(false);
    const [editingRows, setEditingRows] = useState<Set<number>>(new Set());
    const [editedStores, setEditedStores] = useState<Store[]>([]);
    const storeNames = stores.map(store => store.store_name);

    useEffect(() => {
        if (storeState.stores) {
            setFilteredStores([...storeState.stores].sort((a, b) => a.store_name.localeCompare(b.store_name)));
        }
    }, [storeState.stores]);

    const handleSearch = (query: string) => {
        const filteredStoreNames = filterByIncludes(storeNames, query);
        const matchedStores = filteredStoreNames.map(name => 
            stores.find(store => store.store_name === name)
        ).filter((store): store is Store => store !== undefined);
        setFilteredStores(matchedStores);
    };

    const toggleMaximize = () => {
        setIsMaximized(!isMaximized);
    };

    const handleEditClick = (storeId: number) => {
        if (editingRows.has(storeId)) {
            // Trim leading and trailing spaces from store_name before saving
            const storeToUpdate = editedStores.find(s => s.id === storeId);
            if (storeToUpdate && storeToUpdate.store_name) {
                storeToUpdate.store_name = storeToUpdate.store_name.trim();
                setEditedStores(editedStores.map(store => 
                    store.id === storeId ? { ...store, store_name: storeToUpdate.store_name } : store
                ));
                updateStore(storeToUpdate);
            }
            
            const newEditingRows = new Set(editingRows);
            newEditingRows.delete(storeId);
            setEditingRows(newEditingRows);
        } else {
            // Start editing
            const newEditingRows = new Set(editingRows);
            newEditingRows.add(storeId);
            setEditingRows(newEditingRows);
            const storeToEdit = filteredStores.find(s => s.id === storeId);
            if (storeToEdit) {
                setEditedStores([...editedStores, { ...storeToEdit }]);
            }
        }
    };

    const handleStoreNameChange = (storeId: number, newName: string) => {
        setEditedStores(editedStores.map(store => 
            store.id === storeId ? { ...store, store_name: newName } : store
        ));
    };

    const handleStatusToggle = (storeId: number) => {
        setEditedStores(editedStores.map(store => 
            store.id === storeId ? { ...store, active: !store.active } : store
        ));
    };

    const getStoreData = (storeId: number) => {
        return editedStores.find(s => s.id === storeId) || 
               filteredStores.find(s => s.id === storeId);
    };

    const isValidName = (storeId: number) => {
        const storeData = getStoreData(storeId);
        const originalStoreName = stores.find(s => s.id === storeId)?.store_name || '';
        return !storeFormValidation.validateStoreForm(storeData, storeNames, originalStoreName).isValid;
    };

    return (
        <div className="max-w-[600px] ">
            <h3 className="text-xl text-left font-semibold text-[#404040] mb-4">My Stores</h3>
            {/* Begin Table Container  */}
            <div className="bg-white border border-[#E4F0F6] rounded-lg shadow-sm pb-4">
                {stores.length === 0 ? (
                    <p className="text-blue-600 text-center text-xl py-4">Please refresh the page</p>
                ) : (
                    <div className="">
                        {/* Begin Table Container  */}
                        <div className={` ${isMaximized ? "" : " min-h-[360px] max-h-[360px] overflow-y-auto "}`}>
                            {/* Begin Table Header */}
                            <div className="flex items-center justify-center border-b border-b-[#E4F0F6] py-4 relative">
                                {/* Search Bar */}
                                <div>
                                    <SearchBar onSearch={handleSearch} placeholder="LA 21" />
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
                                            Store Name
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
                                    <DisplayStoreRows
                                        filteredStores={filteredStores}
                                        editingRows={editingRows}
                                        getStoreData={getStoreData}
                                        handleStoreNameChange={handleStoreNameChange}
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
