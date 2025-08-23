import { useStore } from "@/store";
import { AccountingData, Payable, Receivable } from "./rentTypes";
import TableBtns from "./TableBtns";
import { useState } from "react";
import { useParams } from "next/navigation";
import { getDaysInMonth } from "../../utils/dateUtils";
import PropertyRows from "./PropertyRows";

interface RentTableProps {
    accounting_data: AccountingData
    setAccountingData: React.Dispatch<React.SetStateAction<AccountingData>>;
}


export default function RentTable({ accounting_data, setAccountingData }: RentTableProps) {
    const { company_id, year, month } = useParams();
    const { propertyState, tenantState } = useStore()

    const onSync = () => {

        if (propertyState.data?.get(Number(company_id)) && tenantState.data) {
            const newAccountingData: AccountingData = new Map();
            propertyState.data.get(Number(company_id))?.forEach(property => {

                const receivables: Receivable[] = []
                const payables: Payable[] = []
                // add income data 
                tenantState.data.get(property.id)?.forEach(tenant => {
                    const rent_due_day = getDaysInMonth(Number(month) - 1, Number(year))
                    receivables.push({
                        property_id: property.id,
                        amount_paid: 0,
                        amount_due: Number(tenant.rent_amount),
                        due_date: `${rent_due_day}-${month}-${year}`, // Placeholder due date
                        tenant_name: `${tenant.first_name} ${tenant.last_name}`,
                        paid_by: ``,
                    } as Receivable)
                })

                newAccountingData.set(property.id, {
                    property_name: property.address,
                    payables: payables,
                    receivables: receivables,
                });
                console.log('receivalbles', receivables)
            });
            setAccountingData(newAccountingData);
        }
    }


    const noDataDisplay = (
        <tr className="h-full flex items-center justify-center">
            <td colSpan={3} className="text-center text-[18px] text-[#404040] font-semibold">
                Please sync properties or refresh the page
            </td>
        </tr>
    )

    return (
        <div className="w-[800px]">
            <div className="w-full flex flex-col items-center">
                <div className="h-[20px]">
                    {/* {cudError &&
                        <div className="text-red-500">
                            {cudError}
                        </div>} */}
                </div>
                {/* Main Table */}
                <div className="w-[800px]">
                    {/* Header */}
                    <table className="w-full">
                        <thead className="px-4 bg-[#F5F5F5] z-30 border border-b-0 border-t-2 border-x-2 border-[#ECECEE] h-[60px] rounded-top header-shadow flex items-center relative z-10">
                            <tr className="flex flex-row gap-x-4 bg-[#F5F5F5] w-full  ">
                                <th className="w-[25px] ">
                                    {/* Carat Col */}
                                </th>
                                <th className="w-[250px] text-left pl-2  flex items-center ">
                                    <span className="text-[16px] text-[#80848A]">Address</span>
                                </th>
                                <th className="w-[150px] pl-2 text-left flex items-center ">
                                    <span className="text-[16px] text-[#80848A]">Rent</span>
                                </th>
                                <th className="w-[100px] pl-2 flex items-center text-left">
                                    <span className="text-[16px] text-[#80848A]">Expenses</span>
                                </th>
                                <th className="w-[150px] flex items-center pl-2 text-left">
                                    <span className="text-[16px] text-[#80848A]">Gross Income</span>
                                </th>
                            </tr>
                        </thead>
                        {/* Main Content */}
                        <tbody className={`flex flex-col gap-y-3 min-h-[304px] ${accounting_data.size === 0 ? 'h-[304px]' : ''} relative z-10 border border-[#ECECEE] table-input-shadow border-y-2 border-t-0 bg-[#FDFDFD] rounded-bottom relative z-0 py-4`}>
                            {
                                accounting_data.size === 0 ? noDataDisplay : <PropertyRows accounting_data={accounting_data} />
                            }
                        </tbody>
                    </table>
                </div>
                {/* Action Button */}
                <div className="w-full">
                    <TableBtns onSync={
                        onSync
                    } />
                </div>
            </div>
        </div>
    )
}
