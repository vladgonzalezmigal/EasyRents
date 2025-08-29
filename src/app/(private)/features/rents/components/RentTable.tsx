import { useStore } from "@/store";
import { AccountingData, deepCopyMap, Payable, Receivable, Unoccupied } from "../types/rentTypes";
import TableBtns from "./TableBtns";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDaysInMonth, formatDate, getMonthDateRange } from "../../../utils/dateUtils";
import PropertyRows from "./PropertyRows";
import { ReceivablesService } from "../services/ReceivableService";
import { PayablesService } from "../services/PayablesService";
import { fetchRents } from "../utils";

interface RentTableProps {
    accounting_data: AccountingData
    setAccountingData: React.Dispatch<React.SetStateAction<AccountingData>>
    last_save: AccountingData;
    setLastSave: React.Dispatch<React.SetStateAction<AccountingData>>
    filtered_property_ids: number[]
    setFetchError:  React.Dispatch<React.SetStateAction<string | null>>
    setFetchLoading: React.Dispatch<React.SetStateAction<boolean>>
}


export default function RentTable({ accounting_data, setAccountingData, last_save, setLastSave, filtered_property_ids,
    setFetchError,setFetchLoading
 }: RentTableProps) {
    const { company_id, year, month } = useParams();
    const { propertyState, tenantState } = useStore()
    const [hasEdits, setHasEdits] = useState<boolean>(false)
    const [enlarged, setEnlarged] = useState<boolean>(true)
    const { startDate, endDate } = getMonthDateRange(String(year), String(month));

    const onSync = () => {

        if (propertyState.data?.get(Number(company_id)) && tenantState.data) {
            const newAccountingData: AccountingData = new Map();
            propertyState.data.get(Number(company_id))?.filter(p => p.active).forEach(property => {

                const receivables: Receivable[] = []
                const payables: Payable[] = last_save.get(property.id)?.payables || []
                const unoccupied: Unoccupied[] = last_save.get(property.id)?.unoccupied || []
                // add income data 
                tenantState.data.get(property.id)?.forEach(tenant => {
                    // check if exists 
                    const last_save_existing_receivables = last_save.get(property.id)?.receivables || []
                    const existing_tenant = last_save_existing_receivables.find(r =>
                        r.tenant_name.toLowerCase().trim() === (tenant.first_name.toLowerCase().trim() + " " + tenant.last_name.toLowerCase().trim()))
                    if (existing_tenant) {
                        receivables.push(new Receivable(
                            existing_tenant.id,
                            existing_tenant.property_id,
                            existing_tenant.amount_paid,
                            existing_tenant.amount_due,
                            existing_tenant.due_date,
                            existing_tenant.paid_by,
                            existing_tenant.tenant_name
                        ))
                    } else if (unoccupied.length === 0) {
                        // need to check that the name doesn't exist before adding 
                        const rent_due_day = Math.min((Number(tenant.rent_due_date)), getDaysInMonth(Number(month), Number(year))).toString()
                        const new_tenant = new Receivable(
                            undefined,
                            Number(property.id),
                            Number(0),
                            Number(tenant.rent_amount),
                            `${formatDate(rent_due_day, String(month), String(year))}`,
                            null,
                            `${tenant.first_name.trim()} ${tenant.last_name.trim()}`,
                        )

                        receivables.push(new_tenant)
                    }
                })

                newAccountingData.set(property.id, {
                    property_name: property.address,
                    unoccupied: unoccupied,
                    payables: payables,
                    receivables: receivables,
                });
            });
            setAccountingData(newAccountingData);
        }
    }

    const receivablesEqual = (a1: Receivable[], a2: Receivable[]) => a1.every(item1 => a2.some(item2 => item1.equals(item2)));
    const payablesEqual = (a1: Payable[], a2: Payable[]) => a1.every(item1 => a2.some(item2 => item1.equals(item2)));

    useEffect(() => {
        const maps_equal = (last_save: AccountingData, accounting_data: AccountingData): boolean => {
            if (last_save.size != accounting_data.size) {
                return false
            }
            let maps_equal = true
            for (const key of accounting_data.keys()) {
                const last_save_prop = last_save.get(key)
                if (last_save_prop) {
                    const receivables_equal = receivablesEqual(accounting_data.get(key)?.receivables || [], last_save_prop.receivables)
                    const payables_equal = payablesEqual(accounting_data.get(key)?.payables || [], last_save_prop.payables || [])
                    if (!receivables_equal || !payables_equal) {
                        maps_equal = false
                        break
                    }
                } else {
                    maps_equal = false
                    break
                }
            }
            return maps_equal
        }
        const edited = !maps_equal(last_save, accounting_data);
        setHasEdits(edited);
    }, [accounting_data, last_save]);

    const [loading, setLoading] = useState<boolean>(false)

    type ReceivableResult = {
        data: Receivable[] | null;
        error: string | null;
      };
      
      type PayableResult = {
        data: Payable[] | null;
        error: string | null;
    };

    const onSave = async () => {
        if (!hasEdits) { return }
        setLoading(true)
        try {
            const promises: Promise<ReceivableResult | PayableResult
                >[] = [];
            for (const prop_id of accounting_data.keys()) {
                const property = accounting_data.get(prop_id)
                if (!property) return
                const new_receivables = property.receivables.filter(r => (r.id === undefined)).map(r => r.cloneWithoutId());
                const existing_receivables = property.receivables.filter(r => (r.id !== undefined));
                if (new_receivables.length > 0) {
                    promises.push(ReceivablesService.createReceivables(new_receivables));
                }
                if (existing_receivables.length > 0) {
                    promises.push(ReceivablesService.updateReceivables(existing_receivables.map(r => ({
                        id: r.id!,
                        property_id: r.property_id,
                        amount_paid: r.amount_paid,
                        amount_due: r.amount_due,
                        due_date: r.due_date,
                        paid_by: r.paid_by,
                        tenant_name: r.tenant_name
                    }))));
                }
                // for payables check if they are equal 
                const last_save_payables = last_save.get(prop_id)?.payables
                const updated_payables = last_save_payables ? // if there are specific edits change those to make it efficient
                    property.payables.filter(p => {
                        const last_save_payable = last_save_payables.find(ls => (ls.id === p.id))
                        if (!last_save_payable || !last_save_payable?.equals(p)) {
                            return p
                        }
                    }) :
                    property.payables
                if (updated_payables) {
                    promises.push(PayablesService.updatePayables(
                        updated_payables.map(p => ({
                            id: p.id,
                            property_id: p.property_id,
                            expense_name: p.expense_name,
                            expense_amount: p.expense_amount,
                            expense_date: p.expense_date,
                            paid_with: p.paid_with,
                            detail: p.detail
                        }))
                    ))
                }
            }
            await Promise.all(promises);
        } catch (e) {
            console.error(e);
        } finally {
            let newAccountingData: AccountingData = new Map();
            newAccountingData = await fetchRents({ propertyData: propertyState.data, company_id: Number(company_id), startDate: startDate, endDate: endDate, setFetchError: setFetchError, setFetchLoading: setFetchLoading })
            setLastSave(deepCopyMap(newAccountingData))
            setAccountingData(newAccountingData);
            setLoading(false)
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
        <div className={`w-[930px]`}>
            <div className="w-full flex flex-col items-center">
                <div className="h-[20px]">
                    {/* {cudError &&
                        <div className="text-red-500">
                            {cudError}
                        </div>} */}
                </div>
                {/* Main Table */}
                <div className={`w-[930px]`}>
                    {/* Header */}
                    <table className="w-full">
                        <thead className="px-4 bg-[#F5F5F5] z-20 isolate border border-b-0 border-t-2 border-x-2 border-[#ECECEE] h-[60px] rounded-top header-shadow flex items-center relative z-10">
                            <tr className="flex flex-row gap-x-4 bg-[#F5F5F5] w-full  ">
                                <th className="w-[25px] ">
                                    {/* Carat Col */}
                                </th>
                                <th className="w-[250px] text-left pl-1 flex items-center ">
                                    <span className="text-[16px] text-[#80848A]">Address</span>
                                </th>
                                <th className="w-[150px]  text-left flex items-center ">
                                    <span className="text-[16px] text-[#80848A]">Rent Collected</span>
                                </th>
                                <th className="w-[100px] pl-1 flex items-center text-left">
                                    <span className="text-[16px] text-[#80848A]">Expenses</span>
                                </th>
                                <th className="w-[150px] flex items-center  text-left">
                                    <span className="text-[16px] text-[#80848A]">Gross Income</span>
                                </th>
                                <th className="w-[130px] flex items-center  text-left">
                                    <span className="text-[16px] text-[#80848A]">Balance</span>
                                </th>
                            </tr>
                        </thead>
                        {/* Main Content */}
                        <tbody className={`${hasEdits ? 'border-4 border-orange-400 shadow-[0_0_32px_8px_rgba(255,140,0,0.25)] backdrop-blur-sm' : 'border-[#ECECEE]'} w-[930px] flex flex-col gap-y-3 min-h-[304px] ${accounting_data.size === 0 ? 'h-[304px]' : ''} ${enlarged ? '' : 'max-h-[304px] overflow-y-auto'} relative z-10 border  table-input-shadow border-y-2 border-t-0 bg-[#FDFDFD] rounded-bottom relative z-0 py-4`}>
                            {
                                accounting_data.size === 0 ? noDataDisplay : <PropertyRows accounting_data={accounting_data} setAccountingData={setAccountingData} filtered_property_ids={filtered_property_ids}
                                  last_save={last_save}  setLastSave={setLastSave} />
                            }
                        </tbody>
                    </table>
                </div>
                {/* Action Button */}
                <div className="w-full">
                    <TableBtns onSync={onSync} onSave={onSave} hasEdits={hasEdits} enlarged={enlarged} setEnlarged={setEnlarged} loading={loading} />
                </div>
            </div>
        </div>
    )
}
