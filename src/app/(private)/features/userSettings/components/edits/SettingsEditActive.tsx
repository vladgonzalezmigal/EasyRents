'use client';

import React from 'react';

interface SettingsEditActiveProps {
    isActive: boolean;
    isEditing: boolean;
    onToggle: () => void;
}

export default function SettingsEditActive({ 
    isActive,
    isEditing,
    onToggle
}: SettingsEditActiveProps) {
    return (
        <td className="w-[100px] min-w-[100px] max-w-[100px] px-10 py-4 whitespace-nowrap text-sm font-medium">
            {isEditing ? (
                <button
                    onClick={onToggle}
                    className={` px-2.5 py-1 flex items-center rounded-full transition-colors ${
                        isActive 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200 w-[80px]' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200 w-[90px]'
                    }`}
                >
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                        isActive ? 'bg-green-800' : 'bg-red-800'
                    }`}></div>
                    <span className="text-[14px] font-medium">
                        {isActive ? 'Active' : 'Inactive'}
                    </span>
                </button>
            ) : (
                // Container for the active/inactive text
                <div className={` px-2.5 py-1 flex items-center rounded-full ${
                    isActive ? 'w-[80px] bg-green-100 text-green-800' : 'w-[90px] bg-red-100 text-red-800'
                }`}>
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                        isActive ? 'bg-green-800' : 'bg-red-800'
                    }`}></div>
                    <span className="text-[14px] font-medium">
                        {isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
            )}
        </td>
    );
}
