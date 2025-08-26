'use client';

import { ChangeEvent } from 'react';
import { getDateString } from '@/app/(private)/utils/dateUtils';

/**
 * EditInputForm Component
 * 
 * A reusable input form component for editing data rows. Handles text input with validation
 * state visualization and custom placeholder formatting for date fields.
 * 
 * @param {Object} props - Component props
 * @param {string} props.name - Field name
 * @param {string | number} [props.value] - Current field value
 * @param {(e: ChangeEvent<HTMLInputElement>) => void} props.onChange - Change event handler
 * @param {boolean} [props.hasError] - Whether the field has validation errors
 * @param {string} [props.placeholder] - Placeholder text
 * @param {boolean} [props.active] - Whether the field is being edited
 * 
 * @returns {JSX.Element} Input form element
 */
export const EditInputForm = ({
    name,
    value,
    onChange,
    hasError,
    placeholder,
    active
}: {
    name: string;
    value?: string | number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    hasError?: boolean;
    placeholder?: string;
    active?: boolean;
}) => {
    return (
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className={`w-[100px] pl-2 h-[40px] text-gray-600 border-2 rounded-full ${hasError ? 'border-red-500' : active ? 'border-[#8ABBFD]' : 'border-transparent'}`}
            placeholder={(name === 'date') ? getDateString(placeholder as string) : placeholder || ''}
        />
    );
};
