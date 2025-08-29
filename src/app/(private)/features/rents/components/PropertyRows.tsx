import React, { useState } from "react";
import ChevronIcon from "@/app/(private)/components/svgs/ChevronIcon";
import { AccountingData } from "../types/rentTypes";
import { DisplayRecievableRows } from "./ReceivablesRows";
import SumRow from "./SumRow";
import { DisplayPayableRows } from "./Payables/PayablesRows";
import { useStore } from "@/store";
import { useParams } from "next/navigation";
import ToggleUnoccupiedPopUp from "./UnoccupiedPopUp";

interface PropertyRowsProps {
    accounting_data: AccountingData;
    last_save: AccountingData;
    filtered_property_ids: number[]
    setAccountingData: React.Dispatch<React.SetStateAction<AccountingData>>;
    setLastSave: React.Dispatch<React.SetStateAction<AccountingData>>;
}

export default function PropertyRows({ accounting_data, setAccountingData, filtered_property_ids, last_save, setLastSave
}: PropertyRowsProps) {
    const { tenantState } = useStore()
    const { month, year } = useParams()

    const [expanded, setExpanded] = useState<Set<number>>(new Set(
        filtered_property_ids.filter(id =>
            // tenant(s) haven't paid yet 
            (accounting_data.get(id)?.receivables.reduce((sum, r) => sum + Number(r.amount_due), 0) || 0) !=
            (accounting_data.get(id)?.receivables.reduce((sum, r) => sum + Number(r.amount_paid), 0) || 0)
        )
    ));
    const [activeUnoccupiedPropertyId, setActiveUnoccupiedPropertyId] = useState<number | null>(null)

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
    const totalBalance = Array.from(accounting_data.values())
        .reduce((sum, { receivables }) => sum + receivables.reduce((rSum, r) => rSum + (Number(r.amount_due) - Number(r.amount_paid)), 0), 0);


    // Render each filtered property row
    return (
        <>
            {filtered_property_ids.sort((a, b) => b - a).map(propertyId => {
                const { property_name, payables, receivables } = accounting_data.get(propertyId)!;
                // Calculate gross values
                const totalPropertyIncomeOwed = receivables.reduce((sum, r) => sum + Number(r.amount_due), 0);
                const totalPropertyIncome = receivables.reduce((sum, r) => sum + Number(r.amount_paid), 0);
                const totalPropertyExpenses = payables.reduce((sum, p) => sum + Number(p.expense_amount), 0);
                const grossPropertyIncome = totalPropertyIncome - totalPropertyExpenses;
                const isExpanded = expanded.has(propertyId);
                const num_tens: number = tenantState.data.get(propertyId)?.length ?? 0

                const unoccupiedIncludes: boolean = accounting_data.get(propertyId).unoccupied.map(p => p.property_id).includes(propertyId) || null
                
                return (
                    <React.Fragment key={propertyId}>
                        <tr className={`${totalPropertyIncome < totalPropertyIncomeOwed ? 'table-row-style-not-payed' : `${unoccupiedIncludes ? 'table-row-style-unoccupied' : 'table-row-style '}`} relative gap-x-4 hover:bg-gray-200 table-row-text mx-auto ${(!num_tens || unoccupiedIncludes) ? 'cursor-pointer' : ''}`}
                            onClick={(!num_tens || unoccupiedIncludes) ? () => setActiveUnoccupiedPropertyId(propertyId) : () => {}}>
                            {/* Carat Column */}
                            <td
                                style={{ position: 'absolute', left: '-40px', top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}
                                className=" px-1 py-4 text-center "
                            >
                                {(
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
                            {/* Balance */}
                            <td className="w-[130px] min-w-[130px] max-w-[130px] pl-4 py-4 font-medium text-left">${totalPropertyIncomeOwed - totalPropertyIncome}</td>
                        </tr>
                        {/* Expandable Financial Details */}
                        {isExpanded && (
                            <>
                                <DisplayRecievableRows property_id={propertyId} accountingData={accounting_data} setAccountingData={setAccountingData} setLastSave={setLastSave} />
                                <DisplayPayableRows property_id={propertyId} accountingData={accounting_data} setAccountingData={setAccountingData}
                                    setLastSave={setLastSave}
                                />
                            </>
                        )}
                        {/* Toggle Unoccupied PopUp */}
                        {activeUnoccupiedPropertyId === propertyId && (
                            <ToggleUnoccupiedPopUp
                                property_id={propertyId}
                                property_name={property_name}
                                month={Number(month)}
                                year={Number(year)}
                                num_tens={num_tens}
                                accountingData={accounting_data}
                                setToggleUnoccupiedMode={() => setActiveUnoccupiedPropertyId(null)}
                                setAccountingData={setAccountingData}
                                setLastSave={setLastSave}
                                lastSave={last_save}
                            />
                        )}

                    </React.Fragment>
                );

            })}
            {/* Sum Row  */}
            <SumRow totalIncome={totalIncome} totalExpenses={totalExpenses} totalBalance={totalBalance} />

        </>
    );
}
