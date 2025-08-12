'use client';

import { Expense, SalesDisplay } from "@/app/(private)/types/formTypes";
import { FormDataRows } from "@/app/(private)/features/handleForms/components/FormDataRows";
import TableHeader from "@/app/(private)/features/handleForms/components/TableHeader";
import ActionBtns from "@/app/(private)/features/handleForms/components/ActionBtns";
import { ReactNode } from "react";

interface ValidationResult {
    isValid: boolean;
    value: string;
}

interface ExpenseTableProps {
    fetchError: string | null;
    formDataProps: {
        rowData: (Expense[] | null) | (SalesDisplay[] | null);
        deleteConfig: {
            mode: boolean;
            rows: number[];
            onRowSelect: (id: number) => void;
        };
        editConfig: {
            mode: boolean;
            editedRows: Expense[];
            onRowEdit: (id: number, key: keyof Expense, value: string | number, colNumber: number) => void;
            validationFunction: (key: keyof Expense, value: string) => ValidationResult;
            validationErrors: Record<number, Set<number>>;
        };
        addRowForm: ReactNode;
    };
    actionBtnsProps: {
        deleteBtnProps: {
            handleDelete: () => void;
            deleteMode: boolean;
            canDelete: boolean;
        };
        editBtnProps: {
            handleEdit: () => void;
            editMode: boolean;
            validationErrors: Record<number, Set<number>>;
        };
    }
    cudLoading: boolean;
    headerTitles: string[];
}

export default function ExpenseTable({
    fetchError,
    formDataProps,
    actionBtnsProps,
    cudLoading,
    headerTitles
}: ExpenseTableProps) {
    return (
        <div className="w-full flex flex-col gap-4 justify-center items-center mb-8">
            <div className="">
                {/* Table Header */}
                <TableHeader headerTitles={headerTitles} />
                {(formDataProps.rowData && !fetchError) ?
                    // Table Data Rows
                    <div>
                        <div className="relative z-10 border border-[#ECECEE] table-input-shadow border-y-2 border-t-0 bg-[#FDFDFD] rounded-bottom  relative z-0">
                            <FormDataRows
                                data={formDataProps.rowData}
                                deleteConfig={formDataProps.deleteConfig}
                                editConfig={formDataProps.editConfig}
                                colToSum={5}
                                addRowForm={formDataProps.addRowForm}
                                tableName="expenses"
                            />
                        </div>
                        {/* Action Buttons */}
                        <ActionBtns
                            deleteBtnConfig={{
                                handleDelete: actionBtnsProps.deleteBtnProps.handleDelete,
                                deleteMode: actionBtnsProps.deleteBtnProps.deleteMode,
                                canDelete: actionBtnsProps.deleteBtnProps.canDelete
                            }}
                            editBtnConfig={{
                                handleEdit: actionBtnsProps.editBtnProps.handleEdit,
                                editMode: actionBtnsProps.editBtnProps.editMode,
                                validationErrors: actionBtnsProps.editBtnProps.validationErrors
                            }}
                            cudLoading={cudLoading}
                        />
                    </div>
                    :
                    <p>No expenses found</p>}
            </div>
        </div>
    );
}
