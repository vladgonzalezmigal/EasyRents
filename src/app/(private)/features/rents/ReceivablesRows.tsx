import { AccountingData, Receivable } from "./rentTypes";
import { useEffect, useState } from "react";

interface DisplayTenantRowsProps {
    property_id: number,
    accountingData: AccountingData;
    setAccountingData: React.Dispatch<React.SetStateAction<AccountingData>>;
}

export const DisplayRecievableRows: React.FC<DisplayTenantRowsProps> = ({ property_id, accountingData, setAccountingData }) => {
    // Local editable receivable inputs 
    const rows = accountingData.get(property_id)?.receivables.map(r => ({ ...r, paid_on_time: false })) || [];
    console.log("rows are ", rows )
    const [activeInput, setActiveInput] = useState<{ row: number; field: string } | null>(null);

    // Handle input change
    const handleInputChange = (idx: number, field: keyof Receivable, value: string | number) => {
        setAccountingData(prev => {
            const newMap = new Map(prev);
            const propertyData = newMap.get(property_id);
            if (propertyData) {
                const nextReceivables = [...propertyData.receivables];
                nextReceivables[idx] = { ...nextReceivables[idx], [field]: value };
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
            }
            return newMap;
        });
    };

    return ( 
        <tr className={`w-full ml-10`}>
            <td colSpan={6} className="p-0">
                <div className="">
                    <div className="px-6 pb-3">
                        <div className=" rounded-lg overflow-hidden">
                            {/* Title */}
                            <div>
                                <h4 className="text-lg font-bold text-[#404040] pt-2 pb-4">Income</h4>
                            </div>
                            <table className="min-w-full border border-[#E4F0F6]">
                                <thead className="bg-[#F8F9FA] border-b border-[#E4F0F6]">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs text-[#80848A] font-semibold tracking-wider">On Time</th>
                                        <th className="px-4 py-3 text-left text-xs text-[#80848A] font-semibold tracking-wider">Tenant Name</th>
                                        <th className="px-4 py-3 text-left text-xs text-[#80848A] font-semibold tracking-wider">Amount Due</th>
                                        <th className="px-4 py-3 text-left text-xs text-[#80848A] font-semibold tracking-wider">Due Date</th>
                                        <th className="px-4 py-3 text-left text-xs text-[#80848A] font-semibold tracking-wider">Amount Paid</th>
                                        <th className="px-4 py-3 text-left text-xs text-[#80848A] font-semibold tracking-wider">Paid By</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E4F0F6] bg-white">
                                    {rows.map((receivable, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            {/* Paid On Time Checkbox */}
                                            <td className="text-sm text-gray-700 flex items-center justify-center h-[44px]">
                                                <input
                                                    type="checkbox"
                                                    checked={!!receivable.paid_on_time}
                                                    onChange={e => handlePaidOnTime(idx, e.target.checked)}
                                                    className="accent-green-500 w-5 h-5 border-2 border-green-400 rounded focus:ring-green-400"
                                                />
                                            </td>
                                            {/* Tenant Name */}
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                <input
                                                    type="text"
                                                    value={receivable.tenant_name}
                                                    onChange={e => handleInputChange(idx, 'tenant_name', e.target.value)}
                                                    onFocus={() => setActiveInput({ row: idx, field: 'tenant_name' })}
                                                    onBlur={() => setActiveInput(null)}
                                                    className={`w-[120px] px-2 ${activeInput?.row === idx && activeInput?.field === 'tenant_name' ? 'border-2 rounded' : 'border-none'}`}
                                                />
                                            </td>
                                            {/* Amount Due */}
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                <input
                                                    type="number"
                                                    value={receivable.amount_due}
                                                    onChange={e => handleInputChange(idx, 'amount_due', Number(e.target.value))}
                                                    onFocus={() => setActiveInput({ row: idx, field: 'amount_due' })}
                                                    onBlur={() => setActiveInput(null)}
                                                    className={`w-[80px] px-2 ${activeInput?.row === idx && activeInput?.field === 'amount_due' ? 'border-2 rounded' : 'border-none'}`}
                                                />
                                            </td>
                                            {/* Due Date */}
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                <input
                                                    type="text"
                                                    value={receivable.due_date}
                                                    onChange={e => handleInputChange(idx, 'due_date', e.target.value)}
                                                    onFocus={() => setActiveInput({ row: idx, field: 'due_date' })}
                                                    onBlur={() => setActiveInput(null)}
                                                    className={`w-[100px] px-2 ${activeInput?.row === idx && activeInput?.field === 'due_date' ? 'border-2 rounded' : 'border-none'}`}
                                                />
                                            </td>
                                            {/* Amount Paid */}
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                <input
                                                    type="number"
                                                    value={receivable.amount_paid}
                                                    onChange={e => handleInputChange(idx, 'amount_paid', Number(e.target.value))}
                                                    onFocus={() => setActiveInput({ row: idx, field: 'amount_paid' })}
                                                    onBlur={() => setActiveInput(null)}
                                                    className={`w-[80px] px-2 ${activeInput?.row === idx && activeInput?.field === 'amount_paid' ? 'border-2 rounded' : 'border-none'}`}
                                                />
                                            </td>
                                            {/* Paid By */}
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                <input
                                                    type="text"
                                                    value={receivable.paid_by}
                                                    onChange={e => handleInputChange(idx, 'paid_by', e.target.value)}
                                                    onFocus={() => setActiveInput({ row: idx, field: 'paid_by' })}
                                                    onBlur={() => setActiveInput(null)}
                                                    className={`w-[100px] px-2 ${activeInput?.row === idx && activeInput?.field === 'paid_by' ? 'border-2 rounded' : 'border-none'}`}
                                                />
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