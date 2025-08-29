import React from "react";
import { createPortal } from "react-dom";
import { AccountingData, Unoccupied } from "../types/rentTypes";
import { UnoccupiedService } from "../services/UnoccupiedService";
import { formatDate, months } from "@/app/(private)/utils/dateUtils";

interface ToggleUnoccupiedPopUpProps {
    property_id: number;
    property_name: string;
    month: number;
    year: number;
    num_tens: number;
    accountingData: AccountingData;
    lastSave: AccountingData;
    setAccountingData: React.Dispatch<React.SetStateAction<AccountingData>>;
    setToggleUnoccupiedMode: React.Dispatch<React.SetStateAction<boolean>>;
    setLastSave: React.Dispatch<React.SetStateAction<AccountingData>>;
}

export default function ToggleUnoccupiedPopUp({
    property_id,
    property_name,
    month,
    year,
    num_tens,
    accountingData,
    lastSave,
    setAccountingData,
    setToggleUnoccupiedMode,
    setLastSave
}: ToggleUnoccupiedPopUpProps) {

    const isUnoccupied = accountingData.get(property_id)?.unoccupied.some(p => p.property_id === property_id) || false;

    const toggleUnoccupied = async (propertyId: number, num_tens: number) => {
        if (!num_tens || isUnoccupied) {
            const record: Unoccupied = accountingData.get(property_id)?.unoccupied.find(u => u.property_id === propertyId)
            if (record && record.id) {
                try {
                    const result = await UnoccupiedService.deleteUnoccupied([record.id])
                    if (result.error) { throw new Error(result.error) }
                } catch (e) {
                    console.error(e)
                } finally {
                    setAccountingData(
                        (prev) => {
                            const newData = new Map(prev)
                            let newUnoccupied = [...accountingData.get(propertyId).unoccupied]
                            newUnoccupied = newUnoccupied.filter(p => (p.property_id != propertyId))
                            newData.set(propertyId, {
                                property_name: property_name,
                                unoccupied: newUnoccupied,
                                receivables: accountingData.get(propertyId).receivables,
                                payables: accountingData.get(propertyId).payables,
                            });
                            setLastSave(prev => {
                                const newData = new Map(prev)
                                newData.set(propertyId, {
                                    property_name: property_name,
                                    unoccupied: [...newUnoccupied],
                                    receivables: lastSave.get(propertyId).receivables,
                                    payables: lastSave.get(propertyId).payables,
                                });
                                return newData
                            })
                            return newData
                        }
                    )
                }
            } else if (record && !record.id) {
                setAccountingData(
                    (prev) => {
                        const newData = new Map(prev)
                        let newUnoccupied = [...accountingData.get(propertyId).unoccupied]
                        newUnoccupied = newUnoccupied.filter(p => (p.property_id != propertyId))
                        newData.set(propertyId, {
                            property_name: property_name,
                            unoccupied: newUnoccupied,
                            receivables: accountingData.get(propertyId).receivables,
                            payables: accountingData.get(propertyId).payables,
                        });
                        setLastSave(prev => {
                            const newData = new Map(prev)
                            newData.set(propertyId, {
                                property_name: property_name,
                                unoccupied: [...newUnoccupied],
                                receivables: lastSave.get(propertyId).receivables,
                                payables: lastSave.get(propertyId).payables,
                            });
                            return newData
                        })
                        return newData
                    }
                )
            } else {
                const result = await UnoccupiedService.createUnoccupied([{
                    property_id: propertyId,
                    month: formatDate("1", String(month), String(year))
                }])
                setAccountingData(
                    (prev) => {
                        const newData = new Map(prev)
                        let newUnoccupied = [...accountingData.get(propertyId).unoccupied]
                        newUnoccupied = newUnoccupied.filter(p => (p.property_id != propertyId))
                        // create 
                        newUnoccupied.push(...result.data)
                        newData.set(propertyId, {
                            property_name: property_name,
                            unoccupied: newUnoccupied,
                            receivables: accountingData.get(propertyId).receivables,
                            payables: accountingData.get(propertyId).payables,
                        });
                        setLastSave(prev => {
                            const newData = new Map(prev)
                            newData.set(propertyId, {
                                property_name: property_name,
                                unoccupied: [...newUnoccupied],
                                receivables: lastSave.get(propertyId).receivables,
                                payables: lastSave.get(propertyId).payables,
                            });
                            return newData
                        })

                        return newData
                    }
                )
            }
        }
    }

    const handleYes = (propertyId: number, num_tens: number) => {
        toggleUnoccupied(propertyId, num_tens)
        setToggleUnoccupiedMode(false);
    };

    const handleNo = () => {
        setToggleUnoccupiedMode(false);
    };

    return createPortal(
        <div className="fixed inset-0 z-[900] flex items-center justify-center backdrop-blur-sm bg-opacity-10 isolate ">
            <div className="bg-white rounded-lg shadow-lg p-8 w-[500px] relative">
                <button
                    onClick={() => setToggleUnoccupiedMode(false)}
                    className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700 text-xl font-bold"
                    aria-label="Close"
                >
                    &times;
                </button>
                <h2 className="text-xl font-semibold mb-4 text-[#2A7D7B]">
                    {(num_tens && !isUnoccupied)
                        ? `Property ${property_name} has tenants. Cannot mark as unoccupied.`
                        : `Do you want to ${isUnoccupied ? "remove" : "mark"} ${property_name} as unoccupied for ${months[month - 1]}?`}
                </h2>
                {(!num_tens || isUnoccupied) && (
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => handleYes(property_id, num_tens)}
                                className="cursor-pointer px-4 py-2 bg-[#2A7D7B] text-white rounded hover:bg-[#226968]"
                            >
                                Yes
                            </button>
                            <button
                                onClick={handleNo}
                                className="cursor-pointer px-4 py-2 bg-gray-300 text-[#404040] rounded hover:bg-gray-400"
                            >
                                No
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}