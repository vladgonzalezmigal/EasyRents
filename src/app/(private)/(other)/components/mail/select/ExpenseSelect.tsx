'use client';

interface ExpenseSelectProps {
    selectedExpenses: string[];
    onExpenseSelect: (expense: string) => void;
    expenses: string[];
}

export default function ExpenseSelect({ selectedExpenses, onExpenseSelect, expenses }: ExpenseSelectProps) {
    return (
        <div className="flex flex-wrap gap-4">
            {expenses.map((expense, index) => (
                <div
                    key={index}
                    onClick={() => onExpenseSelect(expense)}
                    className={`p-4 border rounded-2xl shadow-md cursor-pointer w-[270px] flex items-center justify-center ${
                        selectedExpenses.includes(expense)
                            ? 'bg-[#F2FBFA] border-[#DFDFDF]'
                            : 'bg-white border-[#DFDFDF]'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={selectedExpenses.includes(expense)}
                            onChange={() => {}}
                            className="w-4 h-4 rounded border-[#8ABBFD] text-[#8ABBFD] focus:ring-[#8ABBFD]"
                        />
                        <p className={`text-sm ${
                            selectedExpenses.includes(expense)
                                ? 'text-[#2A7D7B] font-bold'
                                : 'text-gray-500 font-semibold'
                        }`}>
                            {expense.toUpperCase()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
