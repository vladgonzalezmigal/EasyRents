import React, { useState } from "react";
import ChevronIcon from "@/app/(private)/components/svgs/ChevronIcon";
import { AccountingData, Payable, Receivable } from "./rentTypes";
import { DisplayRecievableRows } from "./ReceivablesRows";
import SumRow from "./SumRow";

interface PropertyRowsProps {
    accounting_data: AccountingData;
    setAccountingData: React.Dispatch<React.SetStateAction<AccountingData>>;
}

export default function PropertyRows({ accounting_data, setAccountingData }: PropertyRowsProps) {
    const [expanded, setExpanded] = useState<Set<number>>(new Set());

    const toggleExpand = (propertyId: number) => {
        setExpanded(prev => {
            const next = new Set(prev);
            if (next.has(propertyId)) {
                next.delete(propertyId);
            } else {
                next.add(propertyId);
            }
            return next;
        });
    };

    // high-level accounting vars 
    const totalIncome = Array.from(accounting_data.values())
        .reduce((sum, { receivables }) => sum + receivables.reduce((rSum, r) => rSum + Number(r.amount_paid), 0), 0);
    const totalExpenses = Array.from(accounting_data.values())
        .reduce((sum, { payables }) => sum + payables.reduce((rSum, r) => rSum + Number(r.expense_amount), 0), 0);

    // Render each property row
    return (
        <>
            {[...accounting_data.keys()].map(propertyId => {
                const { property_name, payables, receivables } = accounting_data.get(propertyId)!;
                // Calculate gross values
                const totalPropertyIncome = receivables.reduce((sum, r) => sum + Number(r.amount_due), 0);
                const totalPropertyExpenses = payables.reduce((sum, p) => sum + Number(p.expense_amount), 0);
                const grossPropertyIncome = totalPropertyIncome - totalPropertyExpenses;
                const isExpanded = expanded.has(propertyId);
                return (
                    <React.Fragment key={propertyId}>
                        <tr className="relative table-row-style gap-x-4 hover:bg-gray-200 table-row-text mx-auto">
                            {/* Carat Column */}
                            <td
                                style={{ position: 'absolute', left: '-40px', top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}
                                className=" px-1 py-4 text-center "
                            >
                                {receivables.length > 0 && (
                                    <button
                                        onClick={e => {
                                            e.stopPropagation();
                                            toggleExpand(propertyId);
                                        }}
                                        className={`w-[20px] h-[20px] flex items-center justify-center transition-transform duration-200 ${isExpanded ? '-rotate-90' : '-rotate-180'}`}
                                    >
                                        <ChevronIcon className="w-[20px] h-6 text-gray-600" />
                                    </button>
                                )}
                            </td>
                            {/* Address Column */}
                            <td className="w-[250px] min-w-[250px] max-w-[250px] pl-4 py-4 text-left font-medium ">{property_name}</td>
                            {/* Total Rent */}
                            <td className="w-[150px] min-w-[150px] max-w-[150px] pl-4 py-4 font-medium text-left ">${totalPropertyIncome.toLocaleString('en-US')}</td>
                            {/* Total Expenses */}
                            <td className="w-[100px] min-w-[100px] max-w-[100px] pl-4 py-4 font-medium text-left">${totalPropertyExpenses.toLocaleString('en-US')}</td>
                            {/* Gross Income */}
                            <td className="w-[150px] min-w-[150px] max-w-[150px] pl-4 py-4 font-medium text-left">${grossPropertyIncome.toLocaleString('en-US')}</td>
                        </tr>
                        {/* Expandable Payables Details */}
                        {isExpanded && receivables.length > 0 && (
                            <DisplayRecievableRows property_id={propertyId} accountingData={accounting_data} setAccountingData={setAccountingData} />
                        )}
                    </React.Fragment>
                );
            })}
            {/* Sum Row  */}
            <SumRow totalIncome={totalIncome} totalExpenses={totalExpenses} />
        </>
    );
}
