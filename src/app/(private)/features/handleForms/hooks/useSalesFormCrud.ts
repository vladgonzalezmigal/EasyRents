import { useState } from 'react';
import { Sales } from '@/app/(private)/types/formTypes';
import { postRequest } from '../utils/actions/crudOps';
import { useParams } from 'next/navigation';
import { getNextDayInMonth } from '../utils/formValidation/formValidation';

// export type 
type salesFormCrudHandlers = {
    handleSubmitCreate: (e: React.FormEvent<HTMLFormElement>, newSales: Sales) => Promise<void>;
    handleSubmitEdit: (editedRows: Sales[], validationErrors: Record<number, Set<number>>) => Promise<void>;
    cudLoading: boolean;
    cudError: string | null;
};


type UseFormCrudProps = {
    setSales: React.Dispatch<React.SetStateAction<Sales[] | null>>;
    setNewSale: React.Dispatch<React.SetStateAction<Sales | null>>;
    setCreateSalesDate: React.Dispatch<React.SetStateAction<string | null>>;
    setEditedRows: React.Dispatch<React.SetStateAction<Sales[]>>;
    setValidationErrors: React.Dispatch<React.SetStateAction<Record<number, Set<number>>>>;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    tableName: string;
};

export function useSalesFormCrud({
    setSales,
    setNewSale,
    setCreateSalesDate,
    setEditedRows,
    setValidationErrors,
    setEditMode,
    tableName = 'sales',
}: UseFormCrudProps): salesFormCrudHandlers {
    const [cudLoading, setCudLoading] = useState(false);
    const [cudError, setCudError] = useState<string | null>(null);

    const { store_id } = useParams();


    const handleSubmitCreate = async (e: React.FormEvent<HTMLFormElement>, newSale: Sales ) => {
        e.preventDefault();

        setCudLoading(true);

        const createRes = await postRequest('create', {
            tableName,
            createData: newSale,
        });

        if (createRes.error) {
            setCudError(createRes.error);
            setCudLoading(false);
            return;
        }

        setCudError(null);

        if (createRes.data) {
            const newSalesdata = createRes.data as Sales[];
            setSales((prevSales) =>
                [...(prevSales || []), newSalesdata[0]].sort(
                    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                )
            );
            const nextDay = getNextDayInMonth(newSalesdata[0].date);
            setCreateSalesDate(nextDay);
            setNewSale({
                id: -1,
                store_id: parseInt(store_id as string),  // todo replace store id with current one 
                date: nextDay, // todo replace date with appropriate date 
                sales: 0,
                taxes: 0,
            });
            // setDisplaySales

        }
        setCudLoading(false);
    };


    const handleSubmitEdit = async (
        editedRows: Sales[],
        validationErrors: Record<number, Set<number>>
    ) => {

        setCudLoading(true);

        const updateRes = await postRequest('update', { tableName, editedRows }, {
            editedRows,
            tableName,
            validationErrors
        });

        if (updateRes.error) {
            setCudError(updateRes.error);
            setCudLoading(false);
            return;
        } else {
            setCudError(null);
            const updateData = updateRes.data as Sales[];

            setSales((prevSales) => {
                if (!prevSales) return updateData;

                // Create a map of updated sales by ID for quick lookup
                const updateSalesmap = new Map(
                    updateData.map(sale => [sale.id, sale])
                );

                // Replace existing sales with updated ones based on ID
                return prevSales.map(sale =>
                    updateSalesmap.has(sale.id)
                        ? updateSalesmap.get(sale.id)!
                        : sale
                );
            });
            // clear edit form state 
            setEditedRows([]);
            setValidationErrors({});
            setEditMode(false);
        }
        setCudLoading(false);
    };

    return {
        handleSubmitCreate,
        handleSubmitEdit,
        cudLoading,
        cudError,
    };
}

export default useSalesFormCrud;