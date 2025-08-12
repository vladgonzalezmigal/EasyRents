'use client';

import React, { useState, useEffect } from 'react';
import { CurrentEmployee } from '../../types/employeeTypes';
import { filterByIncludes } from '../../../utils/searchUtils';
import SearchBar from '../SearchBar';
import MaximizeIcon from '@/app/(private)/components/svgs/MaximizeIcon';
import MinimizeIcon from '@/app/(private)/components/svgs/MinimizeIcon';
import DisplayEmployeeRows from './DisplayEmployeeRows';
import { useStore } from '@/store';

export default function DisplayEmployees() {
    const { updateCurrentEmployees, currentEmployeeState, deleteCurrentEmployee } = useStore();
    let employees: CurrentEmployee[] = [];
    if (currentEmployeeState.currentEmployees) {
        employees = currentEmployeeState.currentEmployees;
    }
    const [filteredEmployees, setFilteredEmployees] = useState(
        [...employees].sort((a, b) => a.employee_name.localeCompare(b.employee_name))
    );
    const [isMaximized, setIsMaximized] = useState(false);
    const [editingRows, setEditingRows] = useState<Set<number>>(new Set());
    const [editedEmployees, setEditedEmployees] = useState<CurrentEmployee[]>([]);
    const employeeNames = employees.map(employee => employee.employee_name);

    useEffect(() => {
        if (currentEmployeeState.currentEmployees) {
            setFilteredEmployees([...currentEmployeeState.currentEmployees].sort((a, b) => a.employee_name.localeCompare(b.employee_name)));
        }
    }, [currentEmployeeState.currentEmployees]);

    const handleSearch = (query: string) => {
        const filteredEmployeeNames = filterByIncludes(employeeNames, query);
        const matchedEmployees = filteredEmployeeNames.map(name => 
            employees.find(employee => employee.employee_name === name)
        ).filter((employee): employee is CurrentEmployee => employee !== undefined);
        setFilteredEmployees(matchedEmployees);
    };

    const toggleMaximize = () => {
        setIsMaximized(!isMaximized);
    };

    const handleEditClick = (employeeId: number) => {
        if (editingRows.has(employeeId)) {
            // Trim leading and trailing spaces from name before saving
            const employeeToUpdate = editedEmployees.find(e => e.id === employeeId);
            if (employeeToUpdate && employeeToUpdate.employee_name) {
                employeeToUpdate.employee_name = employeeToUpdate.employee_name.trim();
                setEditedEmployees(editedEmployees.map(employee => 
                    employee.id === employeeId ? { ...employee, employee_name: employeeToUpdate.employee_name } : employee
                ));
                updateCurrentEmployees(employeeToUpdate);
            }
            
            const newEditingRows = new Set(editingRows);
            newEditingRows.delete(employeeId);
            setEditingRows(newEditingRows);
        } else {
            // Start editing
            const newEditingRows = new Set(editingRows);
            newEditingRows.add(employeeId);
            setEditingRows(newEditingRows);
            const employeeToEdit = filteredEmployees.find(e => e.id === employeeId);
            if (employeeToEdit) {
                setEditedEmployees([...editedEmployees, { ...employeeToEdit }]);
            }
        }
    };

    const handleNameChange = (employeeId: number, newName: string) => {
        setEditedEmployees(editedEmployees.map(employee => 
            employee.id === employeeId ? { ...employee, employee_name: newName } : employee
        ));
    };

    const handleStatusToggle = (employeeId: number) => {
        setEditedEmployees(editedEmployees.map(employee => 
            employee.id === employeeId ? { ...employee, active: !employee.active } : employee
        ));
    };

    const handleWageTypeChange = (employeeId: number, newWageType: string) => {
        setEditedEmployees(editedEmployees.map(employee => 
            employee.id === employeeId ? { ...employee, wage_type: newWageType as 'hourly' | 'salary' } : employee
        ));
    };

    const handleWageRateChange = (employeeId: number, newWageRate: number) => {
        setEditedEmployees(editedEmployees.map(employee => 
            employee.id === employeeId ? { ...employee, wage_rate: newWageRate } : employee
        ));
    };

    const handleDeleteClick = async (employeeId: number) => {
        try {
            await deleteCurrentEmployee(employeeId);
            // Remove the deleted employee from the local state
            setFilteredEmployees(prev => prev.filter(emp => emp.id !== employeeId));
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    const getEmployeeData = (employeeId: number) => {
        return editedEmployees.find(e => e.id === employeeId) || 
               filteredEmployees.find(e => e.id === employeeId);
    };

    const isValidName = (employeeId: number) => {
        const employeeData = getEmployeeData(employeeId);
        const originalEmployeeName = employees.find(e => e.id === employeeId)?.employee_name || '';
        return employeeData?.employee_name.trim() !== '' && 
               !employeeNames.some(name => name === employeeData?.employee_name && name !== originalEmployeeName);
    };

    return (
        <div className="max-w-[830px] ">
            <h3 className="text-xl text-left font-semibold text-[#404040] mb-4">Current Employees</h3>
            {/* Begin Table Container  */}
            <div className="bg-white border border-[#E4F0F6] rounded-lg shadow-sm pb-4">
                {employees.length === 0 ? (
                    <p className="text-blue-600 text-center text-xl py-4">Please refresh the page</p>
                ) : (
                    <div className="">
                        {/* Begin Table Container  */}
                        <div className={` ${isMaximized ? "" : " min-h-[360px] max-h-[360px] overflow-y-auto "}`}>
                            {/* Begin Table Header */}
                            <div className="flex items-center justify-center border-b border-b-[#E4F0F6] py-4 relative">
                                {/* Search Bar */}
                                <div>
                                    <SearchBar onSearch={handleSearch} placeholder="Michel" />
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
                                        <th scope="col" className="w-[250px] min-w-[250px] max-w-[250px] mx-auto overflow-hidden px-6 py-3 text-left text-xs text-[#80848A] text-[16px] tracking-wider">
                                            Name
                                        </th>
                                        <th scope="col" className="w-[150px] min-w-[150px] max-w-[150px] px-5 py-3 text-left text-xs text-[#80848A] text-[16px] tracking-wider">
                                            Wage Type
                                        </th>
                                        <th scope="col" className="w-[120px] min-w-[120px] max-w-[120px] px-6 py-3 text-left text-xs text-[#80848A] text-[16px] tracking-wider">
                                            Wage
                                        </th>
                                        <th scope="col" className="w-[100px] min-w-[100px] max-w-[100px] px-11 py-3 text-left text-xs text-[#80848A] text-[16px] tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-9 py-3 text-right text-xs text-[#80848A] text-[16px] tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-[#E4F0F6] divide-y-[2px] border-b border-[#E4F0F6]">
                                    <DisplayEmployeeRows
                                        filteredEmployees={filteredEmployees}
                                        editingRows={editingRows}
                                        getEmployeeData={getEmployeeData}
                                        handleNameChange={handleNameChange}
                                        handleStatusToggle={handleStatusToggle}
                                        handleEditClick={handleEditClick}
                                        handleWageTypeChange={handleWageTypeChange}
                                        handleWageRateChange={handleWageRateChange}
                                        handleDeleteClick={handleDeleteClick}
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
