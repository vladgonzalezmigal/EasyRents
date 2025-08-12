'use client';

import { Payroll } from '@/app/(private)/types/formTypes';
import PayrollTableRows from './PayrollTableRows';
import PayrollBtns from './PayrollBtns';
import { useState } from 'react';
import { ValidationResult } from '../../utils/formValidation/formValidation';

interface DeleteConfig {
    mode: boolean;
    rows: number[];
    onRowSelect: (id: number) => void;
}

interface EditConfig {
    mode: boolean;
    editedRows: Payroll[];
    validationErrors: Record<number, Set<number>>;
    validationFunction: (key: keyof Payroll, value: string) => ValidationResult;
    onRowEdit: (id: number, field: keyof Payroll, value: string | number, colNumber: number) => void;
}



interface PayrollTableProps {
    data: Payroll[];
    onEdit: () => void;
    onCreate?: (id: number, field: keyof Payroll, value: string | number) => void;
    onSubmitCreate: (e: React.FormEvent<HTMLFormElement>) => void;
    cudLoading: boolean;
    cudError: string | null;
    deleteConfig?: DeleteConfig;
    handleDelete?: () => void;
    deleteMode: boolean;
    editConfig: EditConfig;
}

export default function PayrollTable({
    data,
    onCreate,
    onSubmitCreate,
    cudLoading,
    cudError,
    deleteConfig,
    handleDelete,
    deleteMode,
    editConfig,
    onEdit,
}: PayrollTableProps) {
    // create mode state 
    const [createRow, setCreateRow] = useState(false);

    const handleCreateToggle = () => {
        setCreateRow(prev => !prev);
    };

    const canDelete = deleteConfig ? deleteConfig.rows.length > 0 : false;

    return (
        <div className="w-full flex flex-col items-center">
            <div className="h-[20px]">
                {cudError &&
                    <div className="text-red-500">
                        {cudError}
                    </div>}
            </div>
            <div className="w-[800px] ">
                {/* Header */}
                <div className="px-4 bg-[#F5F5F5] z-30 border border-b-0 border-t-2 border-x-2 border-[#ECECEE] h-[60px] rounded-top header-shadow flex items-center relative z-10">
                    <div className="flex flex-row justify-between bg-[#F5F5F5] w-full px-10">
                        <div className="w-[200px] pl-4">
                            <p className="text-[16px] text-[#80848A]">Employee Name</p>
                        </div>
                        <div className="w-[100px] pl-4">
                            <p className="text-[16px] text-[#80848A]">Wage Type</p>
                        </div>
                        <div className="w-[100px] pl-4">
                            <p className="text-[16px] text-[#80848A]">Wage Rate</p>
                        </div>
                        <div className="w-[50px] pl-4">
                            <p className="text-[16px] text-[#80848A]">Hours</p>
                        </div>
                        <div className="w-[50px] pl-4">
                            <p className="text-[16px] text-[#80848A]">Minutes</p>
                        </div>
                        <div className="w-[100px] pl-4">
                            <p className="text-[16px] text-[#80848A]">Total Pay</p>
                        </div>
                    </div>
                </div>
                {/* Body */}
                <PayrollTableRows
                    data={data}
                    showCreateRow={createRow}
                    onCreate={onCreate}
                    onSubmitCreate={onSubmitCreate}
                    cudLoading={cudLoading}
                    deleteConfig={deleteConfig}
                    editConfig={editConfig}
                />
            </div>

            {/* Action Button */}
            <div className="w-[800px]">
                <PayrollBtns
                    deleteMode={deleteMode}
                    editConfig={editConfig}
                    cudLoading={cudLoading}
                    onCreateToggle={handleCreateToggle}
                    handleDelete={handleDelete}
                    canDelete={canDelete}
                    onEdit={onEdit}
                />
            </div>
        </div>
    );
}
