"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/store";
import { getMonthDateRange, getDaysInMonth, formatDate } from "@/app/(private)/utils/dateUtils";
import { useEffect, useState } from "react";
import { Sales, SalesDisplay } from "@/app/(private)/types/formTypes";
import { formatSalesData } from "@/app/(private)/features/handleForms/utils/formDataDisplay/formDataDisplay";
import SalesForm from "@/app/(private)/features/handleForms/components/addDataRow/SalesForm";
import { getRequest } from "@/app/(private)/features/handleForms/utils/actions/crudOps";
import useSalesFormCrud from "@/app/(private)/features/handleForms/hooks/useSalesFormCrud";
import { validateDateSequence } from "@/app/(private)/features/handleForms/utils/formValidation/formValidation";
import { validateSalesInput } from "@/app/(private)/features/handleForms/utils/formValidation/editRowValidation";
import SalesTable from "@/app/(private)/features/handleForms/components/SalesTable";
import { CudError } from "@/app/(private)/features/handleForms/components/formErrors/CudError";
import TableTitle from "@/app/(private)/features/handleForms/components/TableTitle";
import { Loading } from "@/app/components/Loading";

export default function SalesFormPage() {
    const { store_id, year, month } = useParams();
    const { storeState } = useStore();
    const { stores } = storeState;

    let store_name = stores?.find((store) => store.id === parseInt(store_id as string))?.store_name;
    if (!store_name) {
        store_name = "searching...";
    }

    // fetch state, 
    const [fetchLoading, setFetchLoading] = useState(true);
    const { startDate, endDate } = getMonthDateRange(year as string, month as string); // End Date is exclusive 
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [sales, setSales] = useState<Sales[] | null>(null); // appended amount calculated in parent & 
    const [salesDisplay, setSalesDisplay] = useState<SalesDisplay[] | null>(null);
    // create mode state
    const [createSalesDate, setCreateSalesDate] = useState<string | null>(null); // start empty

    const [newSale, setNewSale] = useState<Sales | null>(null);
    const newSaleInputChange = (field: keyof Sales, value: string | number) => {
        // value is validated & formatted by the SalesForm component
        if (!newSale) return;
        setNewSale(prev => prev ? { ...prev, [field]: value } : null);
        return value;
    };

    // update mode state 
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editedRows, setEditedRows] = useState<Sales[]>([]);
    const [validationErrors, setValidationErrors] = useState<Record<number, Set<number>>>({});
    const editSalesRowValidation = (key: keyof Sales, value: string) => {
        return validateSalesInput(key, value);
    }
    const newRowToEditInputChange = (id: number, key: keyof Sales, value: string | number, colNumber: number) => {
        // need to add form validation 
        const validationResult = editSalesRowValidation(key as keyof Sales, value as string);
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
                const original = sales?.find(row => row.id === id);
                if (original) {
                    return [...prev, { ...original, [key]: updatedValue }];
                } else {
                    return prev;
                }
            }
        });
    }

    const canEdit: boolean = (editedRows.length > 0) && (Object.keys(validationErrors).length === 0);

    const handleEdit = () => {
        if (editMode && canEdit) { // can only make api call if there are rows to edit
            handleSubmitEdit(editedRows, validationErrors);
        } else if (editMode && (Object.keys(validationErrors).length > 0)) { // cancel by resetting edit mode
            setEditMode(prevMode => !prevMode);
            setValidationErrors({});
            setEditedRows([]);
        } else {
            setEditMode(prevMode => !prevMode);
        }
    };

    // api hooks
    const { handleSubmitCreate, handleSubmitEdit, cudLoading, cudError } = useSalesFormCrud({ setSales, setNewSale, setCreateSalesDate, setValidationErrors, setEditedRows, setEditMode, tableName: 'sales' })

    // get next date 
    useEffect(() => {
        const datesArray = sales ? sales.map(sale => sale.date) : [];
        const nextDate = validateDateSequence(
            datesArray,
            getDaysInMonth(parseInt(month as string, 10) - 1, parseInt(year as string))
        );
        const formattedDate = (typeof nextDate === 'number')
            ? formatDate(nextDate.toString(), month as string, year as string)
            : '0';
        setCreateSalesDate(formattedDate);
    }, [sales, month, year]); // dependencies — update this list based on what causes re-calculation

    // when createSalesDate is ready, set newSale
    useEffect(() => {
        if (!createSalesDate) return;
        setNewSale({
            id: -1,
            store_id: parseInt(store_id as string),
            date: createSalesDate,
            sales: 0,
            taxes: 0,
        });
    }, [createSalesDate, store_id]);

    useEffect(() => {
        const fetchSales = async () => {
            const dataType = { id: -1, store_id: parseInt(store_id as string), date: '', sales: 0, taxes: 0 } as Sales;
            const readRes = await getRequest({ tableName: 'sales', dataType: dataType, startDate, endDate });
            if (typeof readRes !== 'string' && !readRes.data) {
                setFetchError(readRes.error);
                return;
            } else if (typeof readRes !== 'string' && readRes.data) {
                setSales(readRes.data as Sales[]);
                setSalesDisplay(formatSalesData(readRes.data as Sales[]));
            }
            setFetchLoading(false);
        }
        fetchSales();
    }, [startDate, endDate, store_id]);

    useEffect(() => {
        if (!sales) return;
        setSalesDisplay(formatSalesData(sales));
    }, [sales]);

    if (fetchLoading) {
        return ( <div className="w-full h-full flex items-center justify-center">
            <Loading />
        </div>)
    }

    const headerTitles = ["Date", "Sales", "Taxes", "Daily ", "Total"];

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-full text-center flex flex-col items-center">
                <TableTitle title={store_name} month={month as string} year={year as string} type="sales" />            
                <div className="flex flex-col items-center justify-center"> 
            </div>
            </div>
            <CudError cudError={cudError} />
            {fetchError ? <div>{fetchError}</div> :
                <SalesTable
                    fetchError={fetchError}
                    formDataProps={{
                        rowData: salesDisplay,
                        editConfig: {
                            mode: editMode,
                            editedRows: editedRows,
                            validationErrors: validationErrors,
                            validationFunction: editSalesRowValidation,
                            onRowEdit: newRowToEditInputChange,
                        },
                        addRowForm: <SalesForm 
                            formDone={(newSale?.date === '0')} 
                            createSalesDate={createSalesDate || ''}
                            cumulativeTotal={salesDisplay?.[0]?.cumulative_total || 0}
                            onInputChange={newSaleInputChange}
                            onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmitCreate(e, newSale!)} 
                        />
                    }}
                    actionBtnsProps={{
                        editBtnProps: {
                            handleEdit: handleEdit,
                            editMode: editMode,
                            validationErrors: validationErrors
                        }
                    }}
                    cudLoading={cudLoading}
                    headerTitles={headerTitles}
                />
            }
        </div>
    );
}