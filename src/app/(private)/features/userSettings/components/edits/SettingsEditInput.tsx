'use client';

import React from 'react';

interface SettingsEditInputProps {
    value: string;
    onChange: (value: string) => void;
    isEditing: boolean;
    disabled: boolean;
}

export default function SettingsEditInput({ 
    value,
    onChange,
    isEditing,
    disabled
}: SettingsEditInputProps) {
    const processInput = (input: string): string => {
        return input.toUpperCase();
    };
    
    return (
        <td className="w-[250px] min-w-[250px] max-w-[250px] px-6 py-4 text-[16px] font-medium text-[#585858]">
            {isEditing ? (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(processInput(e.target.value))}
                    className={`w-full border-b-2 ${disabled ? 'border-red-500' : 'border-[#8ABBFD]'} focus:outline-none`}
                />
            ) : (
                <div className="overflow-x-auto whitespace-nowrap">
                    {value}
                </div>
            )}
        </td>
    );
}
