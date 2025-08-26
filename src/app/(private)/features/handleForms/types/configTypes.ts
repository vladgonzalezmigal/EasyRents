import { FormData } from "@/app/(private)/types/formTypes";
import { ValidationResult } from "../utils/formValidation/formValidation";

/**
 * Configuration for handling row deletion in form data tables
 */
export type DeleteConfig = {
    /** Whether delete mode is active */
    mode: boolean;
    /** Array of row IDs that are selected for deletion */
    rows: number[];
    /** Callback function when a row is selected/deselected for deletion */
    onRowSelect: (id: number) => void;
};

/**
 * Configuration for handling row editing in form data tables
 */
export type EditConfig = {
    /** Whether edit mode is active */
    mode: boolean;
    /** Record of validation errors by row ID and column index */
    validationErrors: Record<number, Set<number>>;
    /** Function to validate form field input */
    validationFunction: (key: keyof FormData, value: string) => ValidationResult;
    /** Callback function when a row field is edited */
    onRowEdit: (id: number, key: keyof FormData, value: string | number, colNumber: number) => void;
    /** Array of rows that have been edited */
    editedRows: FormData[];
};