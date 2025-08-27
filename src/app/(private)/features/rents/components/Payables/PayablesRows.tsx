import React, { useState } from "react";
import { AccountingData, Payable } from "../../types/rentTypes";
import CreateBtn from "./CreateBtn";
import CreateExpensesPopUp from "./CreateExpensesPopUp";
import { PAYMENT_OPTIONS } from "../../types/rentTypes";
import TrashIcon from "@/app/(private)/components/svgs/TrashIcon";
import { PayablesService } from "../../services/PayablesService";

interface DisplayPayableRowsProps {
	property_id: number;
	accountingData: AccountingData;
	setAccountingData: React.Dispatch<React.SetStateAction<AccountingData>>;
	setLastSave: React.Dispatch<React.SetStateAction<AccountingData>>;
}

export const DisplayPayableRows: React.FC<DisplayPayableRowsProps> = ({ property_id, accountingData, setAccountingData, setLastSave }) => {
	// Local editable payable inputs
	const rows = accountingData.get(property_id)?.payables.sort((a, b) => b.id - a.id).map(p => ({ ...p })) || [];
	const [activeInput, setActiveInput] = useState<{ row: number; field: string } | null>(null);
	const [createExpenseMode, setCreateExpenseMode] = useState<boolean>(false);
	const [deleteMode, setDeleteMode] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [rowsToDelete, setRowsToDelete] = useState<Set<number>>(new Set());

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

	const handleDeleteClick = async () => {
		setLoading(true)
		try {
			const result = await PayablesService.deletePayables(Array.from(rowsToDelete))
			if (result.data != null) {
				const rowsToRemove : number[] = result.data.map(payable => (payable.id))
				setAccountingData(prev => {
					const newMap = new Map(prev);
					const propertyData = newMap.get(property_id);
					if (propertyData) {
						const updatedPayables = propertyData.payables.filter(payable => !rowsToRemove.includes(payable.id));
						newMap.set(property_id, { ...propertyData, payables: updatedPayables });
					}
					return newMap;
				});
				setRowsToDelete(new Set())
				setLastSave(prev => {
					const newMap = new Map(prev);
					const propertyData = newMap.get(property_id);
					if (propertyData) {
						const updatedPayables = propertyData.payables.filter(payable => !rowsToRemove.includes(payable.id));
						newMap.set(property_id, { ...propertyData, payables: updatedPayables });
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
		<tr className="w-full ml-6">
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
							<table className="border border-[#E4F0F6]">
								<thead className="bg-[#F8F9FA] border-b border-[#E4F0F6]">
									<tr>
										<th className="w-[80px] px-6 py-3 text-xs text-[#80848A] font-semibold tracking-wider">Name</th>
										<th className="w-[120px] px-6 py-3 text-xs text-[#80848A] font-semibold tracking-wider">Amount</th>
										<th className="px-6 py-3 w-[120px] text-xs text-[#80848A] font-semibold tracking-wider">Date</th>
										<th className="px-6 py-3 w-[120px] text-xs text-[#80848A] font-semibold tracking-wider">Paid With</th>
										<th className="px-6 py-3 w-[100px] text-xs text-[#80848A] font-semibold tracking-wider">Detail</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-[#E4F0F6] bg-white">
									{rows.map((payable, idx) => (
										<tr
											key={idx}
											className={`${deleteMode ? `cursor-pointer ${rowsToDelete.has(payable.id) ? 'bg-red-200' : ''}` : 'hover:bg-gray-50'}`}
											onClick={() => {
												if (deleteMode) addToDelete(payable.id);
											}}
										>
											{/* Name */}
											<td className="px-3 py-3 text-sm text-gray-700">
												{deleteMode ? (
													<span className="w-[100px] px-2 inline-block">{payable.expense_name}</span>
												) : (
													<input
														type="text"
														disabled={deleteMode}
														value={payable.expense_name}
														onChange={e => handleInputChange(idx, 'expense_name', e.target.value)}
														onFocus={() => setActiveInput({ row: idx, field: 'expense_name' })}
														onBlur={() => setActiveInput(null)}
														className={`w-[100px] px-2 ${activeInput?.row === idx && activeInput?.field === 'expense_name' ? 'border-2 rounded' : 'border-none'}`}
													/>
												)}
											</td>
											{/* Amount */}
											<td className="px-3 py-3 text-sm text-gray-700">
												{deleteMode ? (
													<span className="w-[100px] px-2 inline-block">{payable.expense_amount}</span>
												) : (
													<input
														type="number"
														disabled={deleteMode}
														value={payable.expense_amount}
														onChange={e => handleInputChange(idx, 'expense_amount', Number(e.target.value))}
														onFocus={() => setActiveInput({ row: idx, field: 'expense_amount' })}
														onBlur={() => setActiveInput(null)}
														className={`w-[100px] px-2 ${activeInput?.row === idx && activeInput?.field === 'expense_amount' ? 'border-2 rounded' : 'border-none'}`}
													/>
												)}
											</td>
											{/* Date */}
											<td className="px-3 py-3 text-sm text-gray-700">
												{deleteMode ? (
													<span className="w-[120px] px-2 inline-block">{payable.expense_date}</span>
												) : (
													<input
														type="date"
														disabled={deleteMode}
														value={payable.expense_date}
														onChange={e => handleInputChange(idx, 'expense_date', e.target.value)}
														onFocus={() => setActiveInput({ row: idx, field: 'expense_date' })}
														onBlur={() => setActiveInput(null)}
														className={`w-[120px] px-2 ${activeInput?.row === idx && activeInput?.field === 'expense_date' ? 'border-2 rounded' : 'border-none'}`}
													/>
												)}
											</td>
											{/* Paid With */}
											<td className="px-3 py-3 text-sm text-gray-700">
												{deleteMode ? (
													<span className="w-[100px] px-2 inline-block">{payable.paid_with}</span>
												) : (
													<select
														value={payable.paid_with}
														disabled={deleteMode}
														onChange={e => handleInputChange(idx, 'paid_with', e.target.value.toUpperCase())}
														className="w-[100px] px-2 border rounded"
														required
													>
														<option value="" disabled>Select Payment</option>
														{PAYMENT_OPTIONS.map(option => (
															<option key={option} value={option}>{option}</option>
														))}
													</select>
												)}
											</td>
											{/* Detail */}
											<td className="px-3 py-3 text-sm text-gray-700">
												{deleteMode ? (
													<span className="w-[140px] px-2 inline-block">{payable.detail}</span>
												) : (
													<input
														type="text"
														disabled={deleteMode}
														value={payable.detail}
														onChange={e => handleInputChange(idx, 'detail', e.target.value)}
														onFocus={() => setActiveInput({ row: idx, field: 'detail' })}
														onBlur={() => setActiveInput(null)}
														className={`w-[140px] px-2 ${activeInput?.row === idx && activeInput?.field === 'detail' ? 'border-2 rounded' : 'border-none'}`}
													/>
												)}
											</td>
										</tr>
									))}
									{createExpenseMode && (
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
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</td>
		</tr>
	);
};