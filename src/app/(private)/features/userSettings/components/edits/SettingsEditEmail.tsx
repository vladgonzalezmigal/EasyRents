'use client';

import React from 'react';

interface SettingsEditEmailProps {
    value: string;
    onChange: (value: string) => void;
    isEditing: boolean;
    disabled: boolean;
}

export default function SettingsEditEmail({ 
    value,
    onChange,
    isEditing,
    disabled
}: SettingsEditEmailProps) {
    return (
        <td className="w-[300px] min-w-[300px] max-w-[300px] px-6 py-4 text-[16px] font-medium text-[#585858]">
            {isEditing ? (
                <input
                    type="email"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
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
