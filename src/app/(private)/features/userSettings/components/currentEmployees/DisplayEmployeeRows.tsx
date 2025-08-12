'use client';

import React, { useState } from 'react';
import { CurrentEmployee } from '../../types/employeeTypes';
import SettingsEditInput from '../edits/SettingsEditInput';
import SettingsEditActive from '../edits/SettingsEditActive';
import SettingsEditSelect from '../edits/SettingsEditSelect';
import SettingsEditNumeric from '../edits/SettingsEditNumeric';
import SaveIcon from '@/app/(private)/components/svgs/SaveIcon';
import EditIcon from '@/app/(private)/components/svgs/EditIcon';
import TrashIcon from '@/app/(private)/components/svgs/TrashIcon';

interface DisplayEmployeeRowsProps {
    filteredEmployees: CurrentEmployee[];
    editingRows: Set<number>;
    getEmployeeData: (employeeId: number) => CurrentEmployee | undefined;
    handleNameChange: (employeeId: number, newName: string) => void;
    handleStatusToggle: (employeeId: number) => void;
    handleEditClick: (employeeId: number) => void;
    handleWageTypeChange: (employeeId: number, newWageType: string) => void;
    handleWageRateChange: (employeeId: number, newWageRate: number) => void;
    handleDeleteClick: (employeeId: number) => void;
    isValidName: (employeeId: number) => boolean;
}

export default function DisplayEmployeeRows({
    filteredEmployees,
    editingRows,
    getEmployeeData,
    handleNameChange,
    handleStatusToggle,
    handleEditClick,
    handleWageTypeChange,
    handleWageRateChange,
    handleDeleteClick,
    isValidName
}: DisplayEmployeeRowsProps) {
    const [deleteMode, setDeleteMode] = useState<number | null>(null);

    return (
        <>
            {filteredEmployees.map((employee) => {
                const employeeData = getEmployeeData(employee.id);
                const isEditing = editingRows.has(employee.id);
                const isValid = isValidName(employee.id);
                const isDeleting = deleteMode === employee.id;

                return (
                    <tr key={employee.id}>
                        {isEditing ? (
                            <SettingsEditInput
                                value={employeeData?.employee_name || ''}
                                onChange={(value) => handleNameChange(employee.id, value)}
                                isEditing={isEditing}
                                disabled={!isValid}
                            />
                        ) : (
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-[16px] text-[#585858]">
                                    {employeeData?.employee_name}
                                </div>
                            </td>
                        )}
                        {isEditing ? (
                            <SettingsEditSelect
                                value={employeeData?.wage_type || ''}
                                onChange={(value) => handleWageTypeChange(employee.id, value)}
                                isEditing={isEditing}
                                options={['hourly', 'salary']}
                            />
                        ) : (
                            <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#585858]">
                                {employeeData?.wage_type}
                            </td>
                        )}
                        {isEditing ? (
                            <SettingsEditNumeric
                                value={employeeData?.wage_rate || 0}
                                onChange={(value) => handleWageRateChange(employee.id, value)}
                                isEditing={isEditing}
                            />
                        ) : (
                            <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#585858]">
                                ${employeeData?.wage_rate?.toFixed(2)}
                            </td>
                        )}
                        <SettingsEditActive
                            isActive={employeeData?.active || false}
                            isEditing={isEditing}
                            onToggle={() => handleStatusToggle(employee.id)}
                        />
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <div className="flex justify-end items-center">
                                <button
                                    onClick={() => handleEditClick(employee.id)}
                                    className={`mr-3 p-2 rounded-full ${
                                        isEditing && !isValid
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
                                <button
                                    onClick={() => {
                                        if (isDeleting) {
                                            handleDeleteClick(employee.id);
                                            setDeleteMode(null);
                                        } else {
                                            setDeleteMode(employee.id);
                                        }
                                    }}
                                    className={`p-2 rounded-full transition-colors ${
                                        isDeleting
                                            ? 'text-red-700 hover:text-red-800 hover:bg-red-100'
                                            : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                                    }`}
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </td>
                    </tr>
                );
            })}
        </>
    );
}
