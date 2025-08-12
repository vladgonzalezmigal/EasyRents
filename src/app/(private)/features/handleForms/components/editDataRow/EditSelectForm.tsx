'use client';

import { ChangeEvent } from 'react';
import { fieldConfig } from '../../utils/formValidation/formValidation';

/**
 * EditSelectForm Component
 * 
 * A reusable select form component for editing data rows. Handles dropdown selection with
 * validation state visualization and dynamic options based on field configuration.
 * 
 * @param {Object} props - Component props
 * @param {string} props.name - Field name
 * @param {string} props.value - Current field value
 * @param {(e: ChangeEvent<HTMLSelectElement>) => void} props.onChange - Change event handler
 * @param {boolean} [props.hasError] - Whether the field has validation errors
 * @param {boolean} [props.active] - Whether the field is being edited
 * 
 * @returns {JSX.Element} Select form element
 */
export const EditSelectForm = ({
    name,
    value,
    onChange,
    hasError,
    active,
}: {
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    hasError?: boolean;
    active?: boolean;
}) => {
    return (
        <select
            name={name}
            value={value}
            onChange={onChange}
            className={`w-[100px] h-[40px] text-[#A0A0A0] border-2 ${hasError ? 'border-red-500' : active ? 'border-blue-200' : 'border-transparent'}`}
        >
            <option value={value}>{value}</option>
            {fieldConfig[name]?.options?.filter(type => type !== value).map((type) => (
                <option key={type} value={type}>
                    {type}
                </option>
            ))}
        </select>
    );
};
