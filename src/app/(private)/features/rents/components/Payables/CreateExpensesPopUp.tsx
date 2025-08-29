import React, { useState } from "react";
import { PayablesService } from "../../services/PayablesService";
import { createPortal } from "react-dom";
import CreateBtn from "../../../userSettings/components/CreateBtn";
import { AccountingData } from "../../types/rentTypes";
import { PAYMENT_OPTIONS } from "../../types/rentTypes";

interface CreateExpensesPopUpProps {
    property_id: number;
    property_name: string;
    setAccountingData: React.Dispatch<React.SetStateAction<AccountingData>>;
    setLastSave: React.Dispatch<React.SetStateAction<AccountingData>>;
    setCreateExpenseMode: React.Dispatch<React.SetStateAction<boolean>>;
}


export default function CreateExpensesPopUp({ property_id, property_name, setCreateExpenseMode, setAccountingData, setLastSave}: CreateExpensesPopUpProps) {
    const [expenseCount, setExpenseCount] = useState(1);
    const [expenses, setExpenses] = useState<Array<{
        expense_name: string;
        expense_amount: number;
        expense_date: string;
        paid_with: string;
        detail: string;
    }>>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Handle input change for each expense
    const handleExpenseChange = (index: number, field: string, value: string | number) => {
        setExpenses(prev => {
            const newExpenses = [...prev];
            if (!newExpenses[index]) {
                newExpenses[index] = {
                    expense_name: '',
                    expense_amount: 0,
                    expense_date: '',
                    paid_with: '',
                    detail: ''
                };
            }
            if (field === 'expense_amount') {
                value = isNaN(Number(value)) ? 0 : Number(value) < 0 ? 0 : Number(value);
            }
            newExpenses[index] = { ...newExpenses[index], [field]: value };
            return newExpenses;
        });
    };

    // Handle submit
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const expensesWithPropertyId = expenses.slice(0, expenseCount).map(expense => ({
            ...expense,
            property_id
        }));
        try {
            const result = await PayablesService.createExpense(expensesWithPropertyId)
            if (result.data && result.data.length > 0) {
                setAccountingData(prev => {
                    const newMap = new Map(prev);
                    if (result.data != null) {
                        const property_id = result.data[0].property_id;

                        newMap.get(property_id)?.payables.push(...result.data)
                    }
                    return newMap
                })
                setLastSave(prev => {
                    const newMap = new Map(prev);
                    if (result.data != null) {
                        const property_id = result.data[0].property_id;
                        newMap.get(property_id)?.payables.push(...result.data)
                    }
                    return newMap
                })
                setIsLoading(false)
                setExpenseCount(1)
                setExpenses([])
                setCreateExpenseMode(prev => !prev)
            } else {
                throw new Error(result?.error || "something went wrong")
            }
        } catch (e) {
            console.error(e)
        }
    };

    // Render expense forms
    const expenseRows = [];
    for (let i = 0; i < expenseCount; i++) {
        const expense = expenses[i] || {
            expense_name: '',
            expense_amount: 0,
            expense_date: '',
            paid_with: '',
            detail: ''
        };
        expenseRows.push(
            <tr key={i} className="bg-white border-b border-[#E4F0F6]">
                <td className="px-2 py-2">
                    <input
                        type="text"
                        value={expense.expense_name}
                        onChange={e => handleExpenseChange(i, 'expense_name', e.target.value)}
                        placeholder="Name"
                        className="w-[120px] px-2 border rounded"
                    />
                </td>
                <td className="px-2 py-2">
                    <input
                        type="number"
                        value={expense.expense_amount}
                        onChange={e => handleExpenseChange(i, 'expense_amount', Number(e.target.value))}
                        placeholder="Amount"
                        className="w-[100px] px-2 border rounded"
                    />
                </td>
                <td className="px-2 py-2">
                    <input
                        type="date"
                        value={expense.expense_date}
                        onChange={e => handleExpenseChange(i, 'expense_date', e.target.value)}
                        className="w-[120px] px-2 border rounded"
                        required
                    />
                </td>
                <td className="px-2 py-2">
                    <select
                        value={expense.paid_with}
                        onChange={e => handleExpenseChange(i, 'paid_with', e.target.value)}
                        className="w-[100px] px-2 border rounded"
                        required
                    >
                        <option value="" disabled>Select Payment</option>
                        {PAYMENT_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </td>
                <td className="px-2 py-2">
                    <input
                        type="text"
                        value={expense.detail}
                        onChange={e => handleExpenseChange(i, 'detail', e.target.value)}
                        placeholder="#1234"
                        className="w-[180px] px-2 border rounded"
                    />
                </td>
            </tr>
        );
    }

    // create portal allows to override parent's z index 
    return createPortal(
        <div className="fixed inset-0 z-[900] flex items-center justify-center backdrop-blur-sm bg-opacity-10 isolate">
            <div className="bg-white rounded-lg shadow-lg p-8 min-w-[750px] relative overflow-y-auto max-h-[95vh]">
                <button
                    onClick={() => setCreateExpenseMode(prev => !prev)}
                    className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700 text-xl font-bold"
                    aria-label="Close"
                >
                    &times;
                </button>
                <h2 className="text-xl font-semibold mb-4 text-[#2A7D7B]">Add Expenses to Property: {property_name}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="flex items-center gap-2 mb-4">
                        <label htmlFor="expenseCount" className="text-[18px] text-[#404040] font-bold whitespace-nowrap"># of Expenses:</label>
                        <select
                            id="expenseCount"
                            value={expenseCount}
                            onChange={e => setExpenseCount(Math.max(1, Math.min(100, Number(e.target.value))))}
                            className="w-[120px] h-[40px] border border-2 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B] border-[#8ABBFD] bg-white">
                            {Array.from({ length: 101 }, (_, i) => (
                                <option key={i} value={i}>{i}</option>
                            ))}
                        </select>
                    </div>
                    <table className="min-w-full border border-[#E4F0F6] mb-4">
                        <thead className="bg-[#F8F9FA] border-b border-[#E4F0F6]">
                            <tr>
                                <th className="px-2 py-2 text-left text-xs text-[#80848A] font-semibold tracking-wider">Name</th>
                                <th className="px-2 py-2 text-left text-xs text-[#80848A] font-semibold tracking-wider">Amount</th>
                                <th className="px-2 py-2 text-left text-xs text-[#80848A] font-semibold tracking-wider">Date</th>
                                <th className="px-2 py-2 text-left text-xs text-[#80848A] font-semibold tracking-wider">Paid With</th>
                                <th className="px-2 py-2 text-left text-xs text-[#80848A] font-semibold tracking-wider">Detail</th>
                            </tr>
                        </thead>
                        <tbody>{expenseRows}</tbody>
                    </table>
                    <div className="flex w-full items-center justify-center">
                        <CreateBtn disabled={isLoading} />
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
