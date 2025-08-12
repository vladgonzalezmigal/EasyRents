'use client';

import React from 'react';

interface SettingsEditSelectProps {
    value: string;
    onChange: (value: string) => void;
    isEditing: boolean;
    options: string[];
    disabled?: boolean;
}

export default function SettingsEditSelect({ 
    value,
    onChange,
    isEditing,
    options,
    disabled = false
}: SettingsEditSelectProps) {
    return (
        <td className="w-[150px] min-w-[150px] max-w-[150px] px-6 py-4 text-[16px] font-medium text-[#585858]">
            {isEditing ? (
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full border rounded-md py-2 pl-1 ${disabled ? 'border-red-500' : 'border-[#8ABBFD]'} focus:outline-none bg-transparent`}
                    disabled={disabled}
                >
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            ) : (
                <div className="overflow-x-auto whitespace-nowrap">
                    {value}
                </div>
            )}
        </td>
    );
}
