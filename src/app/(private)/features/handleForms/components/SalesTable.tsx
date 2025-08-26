'use client';

import { Sales, SalesDisplay } from "@/app/(private)/types/formTypes";
import { FormDataRows } from "@/app/(private)/features/handleForms/components/FormDataRows";
import TableHeader from "@/app/(private)/features/handleForms/components/TableHeader";
import ActionBtns from "@/app/(private)/features/handleForms/components/ActionBtns";
import { ReactNode } from "react";

interface ValidationResult {
    isValid: boolean;
    value: string;
}

interface SalesTableProps {
    fetchError: string | null;
    formDataProps: {
        rowData: SalesDisplay[] | null;
        editConfig: {
            mode: boolean;
            editedRows: Sales[];
            onRowEdit: (id: number, key: keyof Sales, value: string | number, colNumber: number) => void;
            validationFunction: (key: keyof Sales, value: string) => ValidationResult;
            validationErrors: Record<number, Set<number>>;
        };
        addRowForm: ReactNode;
    };
    actionBtnsProps: {
        editBtnProps: {
            handleEdit: () => void;
            editMode: boolean;
            validationErrors: Record<number, Set<number>>;
        };
    };
    cudLoading: boolean;
    headerTitles: string[];
}

export default function SalesTable({
    fetchError,
    formDataProps,
    actionBtnsProps,
    cudLoading,
    headerTitles
}: SalesTableProps) {
    return (
        <div className="w-full flex flex-col gap-4 justify-center items-center mb-8">
            <div className="">
                {/* Table Header */}
                <TableHeader headerTitles={headerTitles} />
                {
                    (formDataProps.rowData && !fetchError) ?
                        // Table Data Rows
                        <div>
                            <div className="relative z-10 border border-[#ECECEE] table-input-shadow border-y-2 border-t-0 bg-[#FDFDFD] rounded-bottom  relative z-0">
                                {formDataProps.rowData &&
                                    <>
                                        <div className="relative z-10 border border-[#ECECEE] table-input-shadow border-y-2 border-t-0 bg-[#FDFDFD] rounded-bottom  relative z-0">
                                            <FormDataRows
                                                data={formDataProps.rowData}
                                                editConfig={formDataProps.editConfig}
                                                colToSum={5}
                                                addRowForm={formDataProps.addRowForm}
                                                tableName="sales"
                                            />
                                        </div>
                                        <ActionBtns
                                            editBtnConfig={{
                                                handleEdit: actionBtnsProps.editBtnProps.handleEdit,
                                                editMode: actionBtnsProps.editBtnProps.editMode,
                                                validationErrors: actionBtnsProps.editBtnProps.validationErrors
                                            }}
                                            cudLoading={cudLoading}
                                        />
                                    </>}
                            </div>
                        </div>
                        :
                        <p>No sales found</p>
                }
            </div>
        </div>
    );
}
