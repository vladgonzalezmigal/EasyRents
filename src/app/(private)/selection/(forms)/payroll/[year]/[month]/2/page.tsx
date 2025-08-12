'use client'
// this page is for the first half of the month
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loading } from "@/app/components/Loading";
import TableTitle from "@/app/(private)/features/handleForms/components/TableTitle";
import {  months } from "@/app/(private)/utils/dateUtils";
import { getRequest } from "@/app/(private)/features/handleForms/utils/actions/crudOps";
import { Payroll } from "@/app/(private)/types/formTypes";
import PayrollTable from "@/app/(private)/features/handleForms/components/payrollTable/PayrollTable";
import { getDaysInMonth } from "@/app/(private)/utils/dateUtils";
import usePayrollFormCrud from "@/app/(private)/features/handleForms/hooks/usePayrollFormCrud";
import CurEmployeeRows from "@/app/(private)/features/handleForms/components/payrollTable/CurEmployeeRows";
import { validatePayrollInput } from "@/app/(private)/features/handleForms/utils/formValidation/editRowValidation";


export default function PayrollDocumentPagePeriod2() {
    const { year, month } = useParams();
    // Set end date to be the 15th of the month
    const lastDayOfMonth = getDaysInMonth(parseInt(month as string) - 1, parseInt(year as string));
    const startDate = `${year}-${(month as string).padStart(2, '0')}-15`;
    const endDate = `${year}-${(month as string).padStart(2, '0')}-${lastDayOfMonth}`;
    // fetch logic 
    const [fetchLoading, setFetchLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [payrollData, setPayrollData] = useState<Payroll[]>([]);
    useEffect(() => {
        const fetchExpenses = async () => {
            const dataType = { id: -1, end_date: '', employee_name: '', wage_type: 'salary', wage_rate: -1, hours: 0,   minutes: 0, total_pay: 0 } as Payroll;
            const readRes = await getRequest({ tableName: 'payroll', dataType: dataType, startDate, endDate });
            if (typeof readRes !== 'string' && !readRes.data) {
                setFetchError(readRes.error);
                return;
            } else if (typeof readRes !== 'string' && readRes.data) {
                setPayrollData(readRes.data as Payroll[]);
            }
            setFetchLoading(false);
        }
        fetchExpenses();
        
    }, [startDate, endDate]);

     // create mode state 
     const [newPayrolls, setNewPayrolls] = useState<Payroll[]>([{ // omit id field
        id: 1,
        end_date: endDate, // YYYY-MM-DD
        employee_name: '',
        wage_type: 'hourly', // default wage type
        wage_rate: 0,
        hours: 0,
        minutes: 0,
        total_pay: 0
    }]);

    const newPayrollInputChange = (id: number, field: keyof Payroll, value: string | number) => {
        // value is validated & formatted by the PayrollForm component
        setNewPayrolls(prev => {
            // Create a new array by mapping through the previous array
            return prev.map(payroll => {
                // Only update the payroll entry with the matching id
                if (payroll.id === id) {
                    return { ...payroll, [field]: value };
                }
                // Return unchanged for other entries
                return payroll;
            });
        });
        return value;
    };

    // delete mode state 
    const [rowsToDelete, setRowsToDelete] = useState<number[]>([]);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);

    // Add delete row selection handler
    const handleDeleteRowSelect = (id: number) => {
        setRowsToDelete(prev => 
            prev.includes(id) 
                ? prev.filter(rowId => rowId !== id)
                : [...prev, id]
        );
    };

    // Toggle delete mode
    const handleToggleDeleteMode = () => {
        setDeleteMode(prev => !prev);
        if (deleteMode) {
            setRowsToDelete([]);
        }
    };
    // edit mode state
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editedRows, setEditedRows] = useState<Payroll[]>([]);
    const [validationErrors, setValidationErrors] = useState<Record<number, Set<number>>>({});
    const editPayrollRowValidation = (key: keyof Payroll, value: string) => {
        return validatePayrollInput(key, value);
    }
    const canEdit = (editedRows.length > 0) && (Object.keys(validationErrors).length === 0);

    const handleEdit = () => {
        if (editMode && canEdit) {
            handleSubmitEdit(editedRows, validationErrors);
        } else if (editMode && (Object.keys(validationErrors).length > 0)) { // clear case 
            setEditMode(prevMode => !prevMode);
            setValidationErrors({});
            setEditedRows([]);
        } else {
            setEditMode(prevMode => !prevMode);
        }
    };

    const newRowToEditInputChange = (id: number, key: keyof Payroll, value: string | number, colNumber: number) => {
        // need to add form validation 
        const validationResult = editPayrollRowValidation(key as keyof Payroll, value as string);
        if (!validationResult.isValid) {
            // Add to validation errors map if validation fails
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                // Create a new Set if it doesn't exist for this id
                if (!newErrors[id]) {
                    newErrors[id] = new Set<number>();
                }
                // Add the column number to the Set
                newErrors[id].add(colNumber);
                return newErrors;
            });
            return;
        }

        // if validation passes, remove from errors map if it exists
        if (validationErrors[id] && validationErrors[id].has(colNumber)) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                if (newErrors[id]) {
                    // Remove the column number from the Set
                    newErrors[id].delete(colNumber);
                    // If Set is empty, remove the id entry
                    if (newErrors[id].size === 0) {
                        delete newErrors[id];
                    }
                }
                return newErrors;
            });
        }

        // if validation passes add to edited rows
        const updatedValue = validationResult.value !== undefined ? validationResult.value : value;

        setEditedRows(prev => {
            const existing = prev.find(row => row.id === id);
            if (existing) {
                return prev.map(row =>
                    row.id === id ? { ...row, [key]: updatedValue } : row
                );
            } else {
                const original = payrollData?.find(row => row.id === id);
                if (original) {
                    return [...prev, { ...original, [key]: updatedValue }];
                } else {
                    return prev;
                }
            }
        });
    }


    // hooks
    const { handleSubmitCreate, handleSubmitDelete, handleSubmitEdit, cudLoading, cudError } = usePayrollFormCrud({
        setPayrollData,
        setNewPayrolls,
        setRowsToDelete,
        setDeleteMode,
        setEditMode,
        setEditedRows,
        setValidationErrors,
        endDate,
        tableName: 'payroll'
    });

    // Create delete config object
    const deleteConfig = {
        mode: deleteMode,
        rows: rowsToDelete,
        onRowSelect: handleDeleteRowSelect
    };

    // Handle delete submission
    const handleDelete = () => {
        if (deleteMode && rowsToDelete.length > 0) {
            handleSubmitDelete(rowsToDelete);
        } else {
            handleToggleDeleteMode();
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            {fetchLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                    <Loading />
                </div>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-y-1">
                    {/* Title */}
                    <div className="w-full text-center w-full flex flex-col items-center">
                        <TableTitle
                            title={`Period Ending ${months[parseInt(month as string) - 1]} ${lastDayOfMonth}`}
                            month={month as string}
                            year={year as string}
                            type="payroll"
                        />
                        <div className="flex flex-col items-center justify-center">
                            <p className="font-semibold text-[#585858]">  </p>
                            {/* <CudError cudError={cudError} /> */}
                        </div>
                    </div>
                    <div>
                        {fetchError && <div className="text-red-500">{fetchError}</div>}
                    </div>

                    {/* Table Component */}
                    {payrollData.length === 0 ? (
                        <div className="w-full mb-8">
                            <CurEmployeeRows
                                newPayrolls={newPayrolls}
                                setNewPayrolls={setNewPayrolls}
                                endDate={endDate}
                                onSubmitCreate={(e) => handleSubmitCreate(e, newPayrolls)}
                                cudLoading={cudLoading}
                            />
                        </div>
                    ) : (
                        <div className="w-full">
                            <PayrollTable
                                data={payrollData}
                                onCreate={newPayrollInputChange}
                                onSubmitCreate={(e) => handleSubmitCreate(e, newPayrolls)}
                                cudLoading={cudLoading}
                                cudError={cudError}
                                deleteConfig={deleteConfig}
                                handleDelete={handleDelete}
                                deleteMode={deleteMode}
                                onEdit={handleEdit}
                                editConfig={{
                                    mode: editMode,
                                    editedRows: editedRows,
                                    validationErrors: validationErrors,
                                    validationFunction: editPayrollRowValidation,
                                    onRowEdit: newRowToEditInputChange,
                                }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}