import React, { useState } from "react";
import { AccountingData, Payable } from "../../types/rentTypes";
import CreateBtn from "./CreateBtn";
import CreateExpensesPopUp from "./CreateExpensesPopUp";
import { PAYMENT_OPTIONS } from "../../types/rentTypes";

interface DisplayPayableRowsProps {
	property_id: number;
	accountingData: AccountingData;
	setAccountingData: React.Dispatch<React.SetStateAction<AccountingData>>;
	setLastSave: React.Dispatch<React.SetStateAction<AccountingData>>;
}

export const DisplayPayableRows: React.FC<DisplayPayableRowsProps> = ({ property_id, accountingData, setAccountingData,
	setLastSave
}) => {
	// Local editable payable inputs
	const rows = accountingData.get(property_id)?.payables.sort((a, b) => b.id - a.id).map(p => ({ ...p })) || [];
	const [activeInput, setActiveInput] = useState<{ row: number; field: string } | null>(null);
	const [createExpenseMode, setCreateExpenseMode] = useState<boolean>(false)


	// Handle input change
	const handleInputChange = (idx: number, field: keyof Payable, value: string | number) => {
		setAccountingData(prev => {
			const newMap = new Map(prev);
			const propertyData = newMap.get(property_id);
			if (propertyData) {
				const nextPayables = [...propertyData.payables];
				nextPayables[idx] = { ...nextPayables[idx], [field]: value, equals: nextPayables[idx].equals };
				newMap.set(property_id, { ...propertyData, payables: nextPayables });
			}
			return newMap;
		});
	};

	return (
		<tr className="w-full ml-6 ">
			<td colSpan={5} className="p-0">
				<div className="">
					<div className="px-10 pb-3">
						<div className="rounded-lg overflow-hidden">
							{/* Title & buttons */}
							<div className="flex items-center gap-x-3">
								<h4 className="text-lg font-bold text-[#404040] pt-2 pb-4">Expenses</h4>
								{/* Create Button */}
								<div className="pb-1.5">
									<CreateBtn onClick={() => setCreateExpenseMode(prev => !prev)} />
								</div>
								{/* Delete Button */}
							</div>
							<table className=" border border-[#E4F0F6]">
								<thead className="bg-[#F8F9FA] border-b border-[#E4F0F6]">
									<tr>
										<th className="w-[80px] px-6 py-3  text-xs text-[#80848A] font-semibold tracking-wider">Name</th>
										<th className="w-[120px] px-6 py-3  text-xs text-[#80848A] font-semibold tracking-wider">Amount</th>
										<th className="px-6 py-3 w-[120px]  text-xs text-[#80848A] font-semibold tracking-wider">Date</th>
										<th className="px-6 py-3 w-[120px] text-xs text-[#80848A] font-semibold tracking-wider">Paid With</th>
										<th className="px-6 py-3 w-[100px]  text-xs text-[#80848A] font-semibold tracking-wider">Detail</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-[#E4F0F6] bg-white">
									{rows.map((payable, idx) => (
										<tr key={idx} className="hover:bg-gray-50">
											{/* Name */}
											<td className="px-3 py-3 text-sm text-gray-700">
												<input
													type="text"
													value={payable.expense_name}
													onChange={e => handleInputChange(idx, 'expense_name', e.target.value)}
													onFocus={() => setActiveInput({ row: idx, field: 'expense_name' })}
													onBlur={() => setActiveInput(null)}
													className={`w-[100px] px-2 ${activeInput?.row === idx && activeInput?.field === 'expense_name' ? 'border-2 rounded' : 'border-none'}`}
												/>
											</td>
											{/* Amount */}
											<td className="px-3 py-3 text-sm text-gray-700">
												<input
													type="number"
													value={payable.expense_amount}
													onChange={e => handleInputChange(idx, 'expense_amount', Number(e.target.value))}
													onFocus={() => setActiveInput({ row: idx, field: 'expense_amount' })}
													onBlur={() => setActiveInput(null)}
													className={`w-[100px] px-2 ${activeInput?.row === idx && activeInput?.field === 'expense_amount' ? 'border-2 rounded' : 'border-none'}`}
												/>
											</td>
											{/* Date */}
											<td className="px-3 py-3 text-sm text-gray-700">
												<input
													type="date"
													value={payable.expense_date}
													onChange={e => handleInputChange(idx, 'expense_date', e.target.value)}
													onFocus={() => setActiveInput({ row: idx, field: 'expense_date' })}
													onBlur={() => setActiveInput(null)}
													className={`w-[120px] px-2 ${activeInput?.row === idx && activeInput?.field === 'expense_date' ? 'border-2 rounded' : 'border-none'}`}
												/>
											</td>
											{/* Paid With */}
											<td className="px-3 py-3 text-sm text-gray-700">
												<select
													value={payable.paid_with}
													onChange={e => handleInputChange(idx, 'paid_with', e.target.value.toUpperCase())}
													className="w-[100px] px-2 border rounded"
													required
												>
													<option value="" disabled>Select Payment</option>
													{PAYMENT_OPTIONS.map(option => (
														<option key={option} value={option}>{option}</option>
													))}
												</select>
											</td>
											{/* Detail */}
											<td className="px-3 py-3 text-sm text-gray-700">
												<input
													type="text"
													value={payable.detail}
													onChange={e => handleInputChange(idx, 'detail', e.target.value)}
													onFocus={() => setActiveInput({ row: idx, field: 'detail' })}
													onBlur={() => setActiveInput(null)}
													className={`w-[140px] px-2 ${activeInput?.row === idx && activeInput?.field === 'detail' ? 'border-2 rounded' : 'border-none'}`}
												/>
											</td>
										</tr>
									))}
									{createExpenseMode &&
										<tr>
											<td>
												<CreateExpensesPopUp
													property_id={property_id}
													property_name={accountingData.get(property_id)?.property_name || "not found"}
													setAccountingData={setAccountingData}
													setCreateExpenseMode={setCreateExpenseMode}
													setLastSave={setLastSave}
												/>
											</td>
										</tr>
									}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</td>
		</tr>
	);
};
