import { AccountingData, Receivable } from "../types/rentTypes";
import { useState } from "react";
import { onTime } from "../../../utils/dateUtils";
import TrashIcon from "@/app/(private)/components/svgs/TrashIcon";
import { ReceivablesService } from "../services/ReceivableService";

interface DisplayTenantRowsProps {
    property_id: number,
    accountingData: AccountingData;
    setAccountingData: React.Dispatch<React.SetStateAction<AccountingData>>;
    setLastSave: React.Dispatch<React.SetStateAction<AccountingData>>;
}

export const DisplayRecievableRows: React.FC<DisplayTenantRowsProps> = ({ property_id, accountingData, setAccountingData, setLastSave }) => {
    // Local editable receivable inputs 
    const rows = accountingData.get(property_id)?.receivables.map(r => ({ ...r, paid_on_time: false })) || [];
    const [rowsToDelete, setRowsToDelete] = useState<Set<number>>(new Set());

    const [activeInput, setActiveInput] = useState<{ row: number; field: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);


    const addToDelete = (id: number) => {
		if (rowsToDelete.has(id)) {
			setRowsToDelete((prevSet) => {
				const newSet = new Set(prevSet);
				newSet.delete(id);
				return newSet;
			});
		} else {
			setRowsToDelete((prevSet) => new Set(prevSet).add(id));
		}
	};

    // Handle input change
    const handleInputChange = (idx: number, field: keyof Receivable, value: string | number) => {
        setAccountingData(prev => {
            const newMap = new Map(prev);
            const propertyData = newMap.get(property_id);
            if (propertyData) {
                const nextReceivables = [...propertyData.receivables];
                nextReceivables[idx] = {
                    ...nextReceivables[idx], [field]: value, equals: nextReceivables[idx].equals, clone: nextReceivables[idx].clone,
                    cloneWithoutId: nextReceivables[idx].cloneWithoutId
                };
                newMap.set(property_id, { ...propertyData, receivables: nextReceivables });
            }
            return newMap;
        });
    };

    // Handle paid on time checkbox
    const handlePaidOnTime = (idx: number, checked: boolean) => {
        setAccountingData(prev => {
            const newMap = new Map(prev);
            const propertyData = newMap.get(property_id);

            if (propertyData && checked) {
                const nextReceivables = [...propertyData.receivables]
                nextReceivables[idx].amount_paid = nextReceivables[idx].amount_due;
                nextReceivables[idx].paid_by = nextReceivables[idx].due_date;
                newMap.set(property_id, { ...propertyData, receivables: nextReceivables });

            } else if (propertyData && !checked) {
                const nextReceivables = [...propertyData.receivables]
                nextReceivables[idx].amount_paid = 0;
                newMap.set(property_id, { ...propertyData, receivables: nextReceivables });
            }
            return newMap;
        });
    };

    // handle deleting row 
    const handleDeleteClick = async () => {
            setLoading(true)
            try {
                const result = await ReceivablesService.deleteReceivables(Array.from(rowsToDelete))
                if (result.data != null) {
                    const rowsToRemove = result.data.map(receivable => (receivable.id))
                    setAccountingData(prev => {
                        const newMap = new Map(prev);
                        const propertyData = newMap.get(property_id);
                        if (propertyData) {
                            const updatedReceivables = propertyData.receivables.filter(receivable => receivable.id && !rowsToRemove.includes(receivable.id));
                            newMap.set(property_id, { ...propertyData, receivables: updatedReceivables });
                        }
                        return newMap;
                    });
                    setRowsToDelete(new Set())
                    setLastSave(prev => {
                        const newMap = new Map(prev);
                        const propertyData = newMap.get(property_id);
                        if (propertyData) {
                            const updatedReceivables = propertyData.receivables.filter(receivable => receivable.id && !rowsToRemove.includes(receivable.id));
                            newMap.set(property_id, { ...propertyData, receivables: updatedReceivables });
                        }
                        return newMap;
                    });
                    setRowsToDelete(new Set())
                } else {
                    setRowsToDelete(new Set())
                    throw new Error(result.error || "something went wrong")
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        };

    return (
        <tr className={`w-full ml-10`}>
            <td colSpan={6} className="p-0">
                <div className="">
                    <div className="px-6 pb-3">
                        <div className=" rounded-lg overflow-hidden">
                            <div className="flex items-center gap-x-3">
                                {/* Title */}
                                <h4 className="text-lg font-bold text-[#404040] pt-2 pb-4">Income</h4>
                                {/* Delete Button */}
                                <div className="flex flex-col pb-1.5">
                                    <button
                                        disabled={loading}
                                        onClick={async () => {
                                            if (rowsToDelete.size) {
                                                await handleDeleteClick().then(
                                                    () => setDeleteMode(false)
                                                );
                                            } else {
                                                setDeleteMode((prev) => !prev);
                                            }
                                        }}
                                        className={`disabled:opacity-20 cursor-pointer disabled:cursor-default p-2 rounded-full transition-colors ${deleteMode
                                            ? `text-red-700 hover:text-red-800 ${rowsToDelete.size ? 'bg-red-100' : 'bg-red-50'}`
                                            : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                                            }`}
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <table className="min-w-full border border-[#E4F0F6]">
                                <thead className="bg-[#F8F9FA] border-b border-[#E4F0F6]">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs text-[#80848A] font-semibold tracking-wider">On Time</th>
                                        <th className="px-4 py-3 text-left text-xs text-[#80848A] font-semibold tracking-wider">Tenant Name</th>
                                        <th className="px-4 py-3 text-left text-xs text-[#80848A] font-semibold tracking-wider">Amount Paid</th>
                                        <th className="px-4 py-3 text-left text-xs text-[#80848A] font-semibold tracking-wider">Paid By</th>
                                        <th className="px-4 py-3 text-left text-xs text-[#80848A] font-semibold tracking-wider">Amount Due</th>
                                        <th className="px-4 py-3 text-left text-xs text-[#80848A] font-semibold tracking-wider">Due Date</th>

                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E4F0F6] bg-white">
                                    {rows.map((receivable, idx) => (
                                        <tr key={idx}
											className={`${deleteMode ? `cursor-pointer ${receivable.id && rowsToDelete.has(receivable.id) ? 'bg-red-200' : ''}` : 'hover:bg-gray-50'}`}
											onClick={() => {
												if (deleteMode && receivable.id) addToDelete(receivable.id);
											}}>
                                            {/* Paid On Time Checkbox */}
                                            <td className="px-4 py-3 text-sm text-gray-700 flex items-center justify-center h-[44px]">
                                                {deleteMode ? (
                                                    <span className="w-[20px] h-[20px] inline-block">
                                                        {(receivable.amount_paid >= receivable.amount_due) && onTime(receivable.paid_by, receivable.due_date) ? '✓' : ''}
                                                    </span>
                                                ) : (
                                                    <input
                                                        type="checkbox"
                                                        disabled={deleteMode}
                                                        checked={(receivable.amount_paid >= receivable.amount_due) && onTime(receivable.paid_by, receivable.due_date)}
                                                        onChange={e => handlePaidOnTime(idx, e.target.checked)}
                                                        className="accent-green-500 w-5 h-5 border-2 border-green-400 rounded focus:ring-green-400"
                                                    />
                                                )}
                                            </td>
                                            {/* Tenant Name */}
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {deleteMode ? (
                                                    <span className="w-[120px] px-2 inline-block">{receivable.tenant_name}</span>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        disabled={deleteMode}
                                                        value={receivable.tenant_name}
                                                        onChange={e => handleInputChange(idx, 'tenant_name', e.target.value)}
                                                        onFocus={() => setActiveInput({ row: idx, field: 'tenant_name' })}
                                                        onBlur={() => setActiveInput(null)}
                                                        className={`w-[120px] px-2 ${activeInput?.row === idx && activeInput?.field === 'tenant_name' ? 'border-2 rounded' : 'border-none'}`}
                                                    />
                                                )}
                                            </td>
                                            {/* Amount Paid */}
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {deleteMode ? (
                                                    <span className="w-[80px] px-2 inline-block">{receivable.amount_paid}</span>
                                                ) : (
                                                    <input
                                                        type="number"
                                                        disabled={deleteMode}
                                                        value={receivable.amount_paid}
                                                        onChange={e => handleInputChange(idx, 'amount_paid', Number(e.target.value))}
                                                        onFocus={() => setActiveInput({ row: idx, field: 'amount_paid' })}
                                                        onBlur={() => setActiveInput(null)}
                                                        className={`w-[80px] px-2 ${activeInput?.row === idx && activeInput?.field === 'amount_paid' ? 'border-2 rounded' : 'border-none'}`}
                                                    />
                                                )}
                                            </td>
                                            {/* Paid By */}
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {deleteMode ? (
                                                    <span className="w-[100px] px-2 inline-block">{receivable.paid_by || ''}</span>
                                                ) : (
                                                    <input
                                                        type="date"
                                                        disabled={deleteMode}
                                                        value={receivable.paid_by || ''}
                                                        onChange={e => handleInputChange(idx, 'paid_by', e.target.value)}
                                                        onFocus={() => setActiveInput({ row: idx, field: 'paid_by' })}
                                                        onBlur={() => setActiveInput(null)}
                                                        className={`w-[100px] px-2 ${activeInput?.row === idx && activeInput?.field === 'paid_by' ? 'border-2 rounded' : 'border-none'}`}
                                                    />
                                                )}
                                            </td>
                                            {/* Amount Due */}
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {deleteMode ? (
                                                    <span className="w-[80px] px-2 inline-block">{receivable.amount_due}</span>
                                                ) : (
                                                    <input
                                                        type="number"
                                                        disabled={deleteMode}
                                                        value={receivable.amount_due}
                                                        onChange={e => handleInputChange(idx, 'amount_due', Number(e.target.value))}
                                                        onFocus={() => setActiveInput({ row: idx, field: 'amount_due' })}
                                                        onBlur={() => setActiveInput(null)}
                                                        className={`w-[80px] px-2 ${activeInput?.row === idx && activeInput?.field === 'amount_due' ? 'border-2 rounded' : 'border-none'}`}
                                                    />
                                                )}
                                            </td>
                                            {/* Due Date */}
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {deleteMode ? (
                                                    <span className="w-[100px] px-2 inline-block">{receivable.due_date}</span>
                                                ) : (
                                                    <input
                                                        type="date"
                                                        disabled={deleteMode}
                                                        value={receivable.due_date}
                                                        onChange={e => handleInputChange(idx, 'due_date', e.target.value)}
                                                        onFocus={() => setActiveInput({ row: idx, field: 'due_date' })}
                                                        onBlur={() => setActiveInput(null)}
                                                        className={`w-[100px] px-2 ${activeInput?.row === idx && activeInput?.field === 'due_date' ? 'border-2 rounded' : 'border-none'}`}
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    );
};