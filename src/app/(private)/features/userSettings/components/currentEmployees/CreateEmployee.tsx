'use client';

import { useState } from 'react';
import CreateBtn from '../CreateBtn';
import {  WageType } from '../../types/employeeTypes';
import { useStore } from '@/store';

export default function CreateEmployee() {
    const { currentEmployeeState, createCurrentEmployee, isCudLoadingCurrentEmployees } = useStore();
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [wageType, setWageType] = useState<WageType>('hourly');
    const [wageRate, setWageRate] = useState<number>(0);
    const [validInput, setValidInput] = useState(true);
    const [hasEdited, setHasEdited] = useState(false);

    const fullName = `${firstName} ${middleName} ${lastName}`.trim().replace(/\s+/g, ' ').toUpperCase();

    const validateInput = (newFirstName: string, newMiddleName: string, newLastName: string) => {
        const newFullName = `${newFirstName} ${newMiddleName} ${newLastName}`.trim().replace(/\s+/g, ' ').toUpperCase();
        if (!newFullName.trim()) return false;
        
        const existingNames = currentEmployeeState.currentEmployees?.map(e => e.employee_name) || [];
        return !existingNames.includes(newFullName);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'firstName' | 'middleName' | 'lastName') => {
        const newValue = e.target.value.toUpperCase();
        const newFirstName = field === 'firstName' ? newValue : firstName;
        const newMiddleName = field === 'middleName' ? newValue : middleName;
        const newLastName = field === 'lastName' ? newValue : lastName;

        switch (field) {
            case 'firstName':
                setFirstName(newValue);
                break;
            case 'middleName':
                setMiddleName(newValue);
                break;
            case 'lastName':
                setLastName(newValue);
                break;
        }
        setValidInput(validateInput(newFirstName, newMiddleName, newLastName));
        setHasEdited(true);
    };

    const handleWageTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setWageType(e.target.value as WageType);
        setHasEdited(true);
    };

    const handleWageRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0;
        setWageRate(Math.round(value * 100) / 100);
        setHasEdited(true);
    };

    const handleSubmit = () => {
        if (validInput && fullName.trim() && wageRate > 0) {
            createCurrentEmployee(fullName, wageType, wageRate).then(() => {
                setFirstName('');
                setMiddleName('');
                setLastName('');
                setWageType('hourly');
                setWageRate(0);
                setHasEdited(false);
            });
        }
    };

    return (
        <div className="max-w-[830px]">
            <h3 className="text-xl font-semibold text-[#404040] mb-4">Create Employee</h3>
            <div className="h-[16px] text-center"> 
                {currentEmployeeState.error && (
                    <p className="text-sm font-semibold text-red-500">Something went wrong!</p>
                )}
            </div>
           
            <div className="bg-white border border-[#E4F0F6] rounded-lg shadow-sm px-4 py-6">
                <div className="flex flex-col gap-4">
                    {/* Name Fields */}
                    <div className="flex gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="firstName" className="text-[16px] text-[#80848A] font-semibold mb-2">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => handleNameChange(e, 'firstName')}
                                className={`w-[200px] h-[40px] border border-2 rounded-md px-3 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B] ${
                                    hasEdited && !validInput ? 'border-red-500' : 'border-[#8ABBFD]'
                                }`}
                                placeholder="Nemesio"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="middleName" className="text-[16px] text-[#80848A] font-semibold mb-2">Middle Name</label>
                            <input
                                type="text"
                                id="middleName"
                                value={middleName}
                                onChange={(e) => handleNameChange(e, 'middleName')}
                                className={`w-[200px] h-[40px] border border-2 rounded-md px-3 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B] ${
                                    hasEdited && !validInput ? 'border-red-500' : 'border-[#8ABBFD]'
                                }`}
                                placeholder="Oseguera"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="lastName" className="text-[16px] text-[#80848A] font-semibold mb-2">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => handleNameChange(e, 'lastName')}
                                className={`w-[200px] h-[40px] border border-2 rounded-md px-3 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B] ${
                                    hasEdited && !validInput ? 'border-red-500' : 'border-[#8ABBFD]'
                                }`}
                                placeholder="Cervantes"
                            />
                        </div>
                    </div>

                    {/* Wage Type and Rate */}
                    <div className="flex gap-4 ">
                        <div className="flex flex-col">
                            <label htmlFor="wageType" className="text-[16px] text-[#80848A] font-semibold mb-2">Wage Type</label>
                            <select
                                id="wageType"
                                value={wageType}
                                onChange={handleWageTypeChange}
                                className="w-[200px] h-[40px] border border-2 border-[#8ABBFD] rounded-md px-3 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B]"
                            >
                                <option value="hourly">Hourly</option>
                                <option value="salary">Salary</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="wageRate" className="text-[16px] text-[#80848A] font-semibold mb-2">Wage Rate</label>
                            <input
                                type="number"
                                id="wageRate"
                                value={wageRate}
                                onChange={handleWageRateChange}
                                className="w-[200px] h-[40px] border border-2 border-[#8ABBFD] rounded-md px-3 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B]"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="flex items-end pb-1">
                            <CreateBtn onSubmit={handleSubmit} disabled={hasEdited && !validInput || isCudLoadingCurrentEmployees || wageRate === 0} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
