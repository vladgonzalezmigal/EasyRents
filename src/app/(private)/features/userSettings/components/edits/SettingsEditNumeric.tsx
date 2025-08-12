'use client';

import React from 'react';

interface SettingsEditNumericProps {
    value: number;
    onChange: (value: number) => void;
    isEditing: boolean;
    disabled?: boolean;
}

export default function SettingsEditNumeric({ 
    value,
    onChange,
    isEditing,
    disabled = false
}: SettingsEditNumericProps) {
    const handleValueChange = (inputValue: string) => {
        // Parse the input value and default to 0 if invalid
        const parsed = parseFloat(inputValue) || 0;
        // Round to 2 decimal places to handle JS floating point issues
        // Multiply by 100, round to integer, then divide by 100
        return Math.round(parsed * 100) / 100;
    };
    
    return (
        <td className="w-[120px] min-w-[120px] max-w-[120px] px-4 py-2 text-[16px] font-medium text-[#585858]">
            {isEditing ? (
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(handleValueChange(e.target.value))}
                    className={`w-full border rounded-md py-2 pl-1 ${disabled ? 'border-red-500' : 'border-[#8ABBFD]'} focus:outline-none bg-transparent`}
                    disabled={disabled}
                    step="0.01"
                    min="0"
                />
            ) : (
                <div className="overflow-x-auto whitespace-nowrap">
                    ${value.toFixed(2)}
                </div>
            )}
        </td>
    );
}
