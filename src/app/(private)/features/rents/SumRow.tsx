import React from "react";

interface SumRowProps {
	totalIncome: number;
	totalExpenses: number;
}

export default function SumRow({ totalIncome, totalExpenses }: SumRowProps) {
	const grossIncome = totalIncome - totalExpenses;
	return (
		<tr>
			<td className="rounded-full bg-[#DFDFDF] w-[800px] h-[4px]"></td>
			<td className='flex pl-14 pr-10  py-4 text-[#4A4A4A] font-semibold items-center'>
				<p className=" w-[250px] text-[24px] pl-4">Totals</p>
				<p className="w-[150px] pl-6">${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
				<p className="w-[150px] pl-10">${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
				<p className=" w-[150px] pl-2">${grossIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
			</td>
		</tr>
	);
}
