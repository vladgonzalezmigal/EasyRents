'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Expense } from "@/app/(private)/types/formTypes";
import { Loading } from "@/app/components/Loading";
import { getMonthDateRange, formatDate } from "@/app/(private)/utils/dateUtils";
import { validateExpenseInput } from "@/app/(private)/features/handleForms/utils/formValidation/editRowValidation";
import useExpenseFormCrud from "@/app/(private)/features/handleForms/hooks/useExpenseFormCrud";
import ExpenseTable from "@/app/(private)/features/handleForms/components/ExpenseTable";
import ExpenseForm from "@/app/(private)/features/handleForms/components/addDataRow/ExpenseForm";
import { getRequest } from "@/app/(private)/features/handleForms/utils/actions/crudOps";
import { CudError } from "@/app/(private)/features/handleForms/components/formErrors/CudError";
import TableTitle from "@/app/(private)/features/handleForms/components/TableTitle";

export default function ExpensesPage() {
    const { year, month } = useParams();
    // fetch state, 
    const { startDate, endDate } = getMonthDateRange(year as string, month as string); // End Date is exclusive 
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [expenses, setExpenses] = useState<Expense[] | null>(null);
    const [fetchLoading, setFetchLoading] = useState(true);
    // create mode state 
    const [newExpense, setNewExpense] = useState<Expense>({
        id: -1,
        date: '',
        payment_type: 'CHECK',
        detail: '',
        company: -1,
        amount: 0
    });
    // update mode state 
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editedRows, setEditedRows] = useState<Expense[]>([]);
    const [validationErrors, setValidationErrors] = useState<Record<number, Set<number>>>({});
    // delete mode state 
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [rowsToDelete, setRowsToDelete] = useState<number[]>([]);

    // use the useExpenseFormCrud hook to handle the cud operations
    const { handleSubmitDelete, handleSubmitCreate, handleSubmitEdit, cudLoading, cudError } = useExpenseFormCrud({ setExpenses, setNewExpense, setValidationErrors, setEditedRows, setEditMode, setRowsToDelete, setDeleteMode, tableName: 'expenses' })

    const newExpenseInputChange = (field: keyof Expense, value: string | number) => {
        // value is validated & formatted by the ExpenseForm component
        setNewExpense(prev => ({ ...prev, [field]: value }));
        return value;
    };

    const editExpenseRowValidation = (key: keyof Expense, value: string) => {
        return validateExpenseInput(key, value, parseInt(month as string), parseInt(year as string));
    }

    const newRowToEditInputChange = (id: number, key: keyof Expense, value: string | number, colNumber: number) => {
        // need to add form validation 
        const validationResult = editExpenseRowValidation(key as keyof Expense, value as string);

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
        let updatedValue = validationResult.value !== undefined ? validationResult.value : value;
        if (key === 'date') {
            updatedValue = formatDate(updatedValue as string, month as string, year as string);
        }
        setEditedRows(prev => {
            const existing = prev.find(row => row.id === id);
            if (existing) {
                return prev.map(row =>
                    row.id === id ? { ...row, [key]: updatedValue } : row
                );
            } else {
                const original = expenses?.find(row => row.id === id);
                if (original) {
                    return [...prev, { ...original, [key]: updatedValue }];
                } else {
                    return prev;
                }
            }
        });
    };

    const newRowToDelete = (id: number) => {
        setRowsToDelete((prevRows) => {
            return prevRows.includes(id)
                ? prevRows.filter(rowId => rowId !== id) // Remove the id if it's already in the array
                : [...prevRows, id]; // Add the id if it's not in the array
        });
    }

    const canDelete: boolean = (rowsToDelete.length > 0);
    const canEdit: boolean = (editedRows.length > 0) && (Object.keys(validationErrors).length === 0);

    const handleDelete = () => {
        if (canDelete && !editMode) { // can only make api call if there are rows to delete
            handleSubmitDelete(rowsToDelete);
        } else if (!editMode) {
            setDeleteMode(prevMode => !prevMode);
        }
    };

    const handleEdit = () => {
        if (editMode && !deleteMode && canEdit) { // can only make api call if there are rows to edit
            handleSubmitEdit(editedRows, validationErrors);
        } else if (editMode && !deleteMode && (Object.keys(validationErrors).length > 0)) { // cancel by resetting edit mode
            setEditMode(prevMode => !prevMode);
            setValidationErrors({});
            setEditedRows([]);
        } else if (!deleteMode) {
            setEditMode(prevMode => !prevMode);
        }
    };

    useEffect(() => {
        const fetchExpenses = async () => {
            const dataType = { id: -1, date: '', payment_type: 'CHECK', detail: '', company: -1, amount: 0 } as Expense;
            const readRes = await getRequest({ tableName: 'expenses', dataType: dataType, startDate, endDate });
            if (typeof readRes !== 'string' && !readRes.data) {
                setFetchError(readRes.error);
                return;
            } else if (typeof readRes !== 'string' && readRes.data) {
                setExpenses(readRes.data as Expense[]);
            }
            setFetchLoading(false);
        }
        fetchExpenses();
    }, [startDate, endDate]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            {fetchLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                    <Loading />
                </div>
            ) : (
                <>
                    {/* Title & Error Message */}
                    <div className="w-full text-center w-full flex flex-col items-center">
                        <TableTitle title="Expenses" month={month as string} year={year as string} type="expenses" />
                        <div className="flex flex-col items-center justify-center">
                            <p className="font-semibold text-[#585858]">  </p>
                            <CudError cudError={cudError} />
                        </div>
                    </div>

                    {/* Table Component */}
                    <ExpenseTable
                        fetchError={fetchError}
                        formDataProps={{
                            rowData: expenses,
                            deleteConfig: {
                                mode: deleteMode,
                                rows: rowsToDelete,
                                onRowSelect: newRowToDelete
                            },
                            editConfig: {
                                mode: editMode,
                                editedRows: editedRows,
                                onRowEdit: newRowToEditInputChange,
                                validationFunction: editExpenseRowValidation,
                                validationErrors: validationErrors
                            },
                            addRowForm: (
                                <ExpenseForm
                                    onInputChange={newExpenseInputChange}
                                    onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmitCreate(e, newExpense)}
                                />
                            )
                        }}
                        actionBtnsProps={{
                            deleteBtnProps: {
                                handleDelete,
                                deleteMode,
                                canDelete
                            },
                            editBtnProps: {
                                handleEdit,
                                editMode,
                                validationErrors
                            }
                        }}
                        cudLoading={cudLoading}
                        headerTitles={["Date", "Type", "Detail", "Company", "Amount"]}
                    />
                </>
            )}
        </div>
    )
}