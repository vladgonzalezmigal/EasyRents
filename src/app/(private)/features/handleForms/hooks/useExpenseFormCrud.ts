import { useState } from 'react';
import { Expense } from '@/app/(private)/types/formTypes';
import { postRequest } from '../utils/actions/crudOps';

// export type 
type expenseFormCrudHandlers = {
  handleSubmitCreate: (e: React.FormEvent<HTMLFormElement>, newExpense: Expense) => Promise<void>;
  handleSubmitDelete: (rowsToDelete: number[]) => Promise<void>;
  handleSubmitEdit: (editedRows: Expense[], validationErrors: Record<number, Set<number>>) => Promise<void>;
  cudLoading: boolean;
  cudError: string | null;
};


type UseFormCrudProps = {
  setExpenses: React.Dispatch<React.SetStateAction<Expense[] | null>>;
  setNewExpense: React.Dispatch<React.SetStateAction<Expense>>;
  setEditedRows: React.Dispatch<React.SetStateAction<Expense[]>>;
  setValidationErrors: React.Dispatch<React.SetStateAction<Record<number, Set<number>>>>;
  setRowsToDelete: React.Dispatch<React.SetStateAction<number[]>>;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteMode: React.Dispatch<React.SetStateAction<boolean>>;
  tableName: string;
};

export function useFormCrud({
  setExpenses,
  setNewExpense,
  setEditedRows,
  setValidationErrors,
  setRowsToDelete,
  setEditMode,
  setDeleteMode,
  tableName = 'expenses',
}: UseFormCrudProps): expenseFormCrudHandlers {
  const [cudLoading, setCudLoading] = useState(false);
  const [cudError, setCudError] = useState<string | null>(null);

  const handleSubmitCreate = async (e: React.FormEvent<HTMLFormElement>, newExpense: Expense) => {
    e.preventDefault();

    setCudLoading(true);

    const createRes = await postRequest('create', {
      tableName,
      createData: newExpense,
    });

    if (createRes.error) {
      setCudError(createRes.error);
      setCudLoading(false);
      return;
    }

    setCudError(null);

    if (createRes.data) {
      const newExpenseData = createRes.data as Expense[];
      setExpenses((prevExpenses) =>
        [newExpenseData[0], ...(prevExpenses || [])].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      ); // reset create state 
      setNewExpense({
        id: -1,
        date: '',
        payment_type: 'CHECK',
        detail: '',
        company: -1,
        amount: 0
      });
    }
    setCudLoading(false);
  };

  const handleSubmitDelete = async (rowsToDelete: number[]) => {

    setCudLoading(true);

    const deleteRes = await postRequest('delete', { tableName, rowsToDelete }, { tableName, rowsToDelete });

    if (deleteRes.error) {
      setCudError(deleteRes.error);
      setCudLoading(false);
      return;
    }

    setCudError(null);

    if (typeof deleteRes !== 'string' && deleteRes.data) {
      const expenseData = deleteRes.data as Expense[];
      const deletedIds: number[] = expenseData.map((expense: Expense) => expense.id);
      if (tableName === 'expenses' && setExpenses) {
        setExpenses((prevExpenses) =>
          prevExpenses ? prevExpenses.filter(expense => !deletedIds.includes(expense.id)) : null
        );
      }
      setRowsToDelete([]);
      setDeleteMode(false);
    }
    setCudLoading(false);
  };

  const handleSubmitEdit = async (
    editedRows: Expense[],
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
      const updateData = updateRes.data as Expense[];

      setExpenses((prevExpenses) => {
        if (!prevExpenses) return updateData;

        // Create a map of updated expenses by ID for quick lookup
        const updatedExpensesMap = new Map(
          updateData.map(expense => [expense.id, expense])
        );

        // Replace existing expenses with updated ones based on ID
        return prevExpenses.map(expense =>
          updatedExpensesMap.has(expense.id)
            ? updatedExpensesMap.get(expense.id)!
            : expense
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
    handleSubmitDelete,
    handleSubmitEdit,
    cudLoading,
    cudError,
  };
}

export default useFormCrud;