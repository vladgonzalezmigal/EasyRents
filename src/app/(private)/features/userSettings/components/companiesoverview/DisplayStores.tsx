'use client';

import React, { useState, useEffect } from 'react';
import { Company } from '../../types/CompanyTypes';
import { filterByIncludes } from '../../../utils/searchUtils';
import SearchBar from '../SearchBar';
import MaximizeIcon from '@/app/(private)/components/svgs/MaximizeIcon';
import MinimizeIcon from '@/app/(private)/components/svgs/MinimizeIcon';
import DisplayCompanyRows from './DisplayStoreRows';
import { storeFormValidation } from '@/app/(private)/features/userSettings/utils/formValidation/formValidationUtil';
import { useStore } from '@/store';

export default function DisplayCompanies() {
    const { updateCompany: updateStore, companyState: companyState } = useStore();
    let companies: Company[] = [];
    if (companyState.data) {
        companies = companyState.data;
    }
    const [filteredStores, setFilteredStores] = useState(
        [...companies].sort((a, b) => a.company_name.localeCompare(b.company_name))
    );
    const [isMaximized, setIsMaximized] = useState(false);
    const [editingRows, setEditingRows] = useState<Set<number>>(new Set());
    const [editedStores, setEditedStores] = useState<Company[]>([]);
    const storeNames = companies.map(store => store.company_name);

    useEffect(() => {
        if (companyState.data) {
            setFilteredStores([...companyState.data].sort((a, b) => a.company_name.localeCompare(b.company_name)));
        }
    }, [companyState.data]);

    const handleSearch = (query: string) => {
        const filteredStoreNames = filterByIncludes(storeNames, query);
        const matchedStores = filteredStoreNames.map(name => 
            companies.find(store => store.company_name === name)
        ).filter((store): store is Company => store !== undefined);
        setFilteredStores(matchedStores);
    };

    const toggleMaximize = () => {
        setIsMaximized(!isMaximized);
    };

    const handleEditClick = (companyId: number) => {
        if (editingRows.has(companyId)) {
            // Trim leading and trailing spaces from company name before saving
            const companyToUpdate = editedStores.find(s => s.id === companyId);
            if (companyToUpdate && companyToUpdate.company_name) {
                companyToUpdate.company_name = companyToUpdate.company_name.trim();
                setEditedStores(editedStores.map(company => 
                    company.id === companyId ? { ...company, company_name: companyToUpdate.company_name } : company
                ));
                updateStore(companyToUpdate);
            }
            
            const newEditingRows = new Set(editingRows);
            newEditingRows.delete(companyId);
            setEditingRows(newEditingRows);
        } else {
            // Start editing
            const newEditingRows = new Set(editingRows);
            newEditingRows.add(companyId);
            setEditingRows(newEditingRows);
            const storeToEdit = filteredStores.find(s => s.id === companyId);
            if (storeToEdit) {
                setEditedStores([...editedStores, { ...storeToEdit }]);
            }
        }
    };

    const handleStoreNameChange = (storeId: number, newName: string) => {
        setEditedStores(editedStores.map(company => 
            company.id === storeId ? { ...company, company_name: newName } : company
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
        const originalStoreName = companies.find(s => s.id === storeId)?.company_name || '';
        return !storeFormValidation.validateStoreForm(storeData, storeNames, originalStoreName).isValid;
    };

    return (
        <div className="max-w-[600px] ">
            <h3 className="text-xl text-left font-semibold text-[#404040] mb-4">My Companies</h3>
            {/* Begin Table Container  */}
            <div className="bg-white border border-[#E4F0F6] rounded-lg shadow-sm pb-4">
                {companies.length === 0 ? (
                    <p className="text-blue-600 text-center text-xl py-4">Please refresh the page</p>
                ) : (
                    <div className="">
                        {/* Begin Table Container  */}
                        <div className={` ${isMaximized ? "" : " min-h-[360px] max-h-[360px] overflow-y-auto "}`}>
                            {/* Begin Table Header */}
                            <div className="flex items-center justify-center border-b border-b-[#E4F0F6] py-4 relative">
                                {/* Search Bar */}
                                <div>
                                    <SearchBar onSearch={handleSearch} placeholder="JR REAL.." />
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
                                            Company Name
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
                                    <DisplayCompanyRows
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
