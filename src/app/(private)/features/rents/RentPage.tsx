'use client';

import React, { useState } from 'react';
import TableTitle from '../handleForms/components/TableTitle';
import { Loading } from '@/app/components/Loading';
import { useParams } from 'next/navigation';
import { PayablesService } from './PayablesService';
import RentTable from './RentTable';
import { AccountingData } from './rentTypes';

export default function RentPage() {

    const { year, month } = useParams();
    const [accountingData, setAccountingData] = useState<AccountingData>(new Map());
    // const firstDay = new Date(Number(year), Number(month) - 1, 1);
    // const lastDay = new Date(Number(year), Number(month), 0);

    // useEffect(() => {
    //     const fetchRentData = async () => {
    //         const readRes = await PayablesService.fetchPayables({ month, endDate });
    //         // if (typeof readRes !== 'string' && !readRes.data) {
    //         //     setFetchError(readRes.error);
    //         //     return;
    //         // } else if (typeof readRes !== 'string' && readRes.data) {
    //         //     setPayrollData(readRes.data as Payroll[]);
    //         // }
    //         // setFetchLoading(false);
    //     }
    //     fetchRentData();

    // }, [startDate, endDate]);
    console.log("loading rents table ")
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            {false ? (
                <div className="w-full h-full flex items-center justify-center">
                    <Loading />
                </div>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-y-1 ">
                    {/* Title */}
                    <div className="w-full text-center flex flex-col items-center">
                        <TableTitle
                            month={month as string}
                            year={year as string}
                        />
                        <div className="flex flex-col items-center justify-center">
                            <p className="font-semibold text-[#585858]">  </p>
                            {/* <CudError cudError={cudError} /> */}
                        </div>
                    </div>
                    {/* <div>
                        {fetchError && <div className="text-red-500">{fetchError}</div>}
                    </div> */}

                    {/* Table Component */}
                     <div className="w-full flex items-center justify-center"> 
                        <RentTable accounting_data={accountingData} />
                    </div>
                    {/* {payrollData.length === 0 ? (
                        <div className="w-full mb-8">
                            <CurEmployeeRows
                                newPayrolls={newPayrolls}
                                setNewPayrolls={setNewPayrolls}
                                endDate={endDate}
                                onSubmitCreate={(e) => handleSubmitCreate(e, newPayrolls)}
                                cudLoading={cudLoading}
                            />
                        </div>
                    ) : (
                        <div className="w-full">
                            <PayrollTable
                                data={payrollData}
                                onCreate={newPayrollInputChange}
                                onSubmitCreate={(e) => handleSubmitCreate(e, newPayrolls)}
                                cudLoading={cudLoading}
                                cudError={cudError}
                                deleteConfig={deleteConfig}
                                handleDelete={handleDelete}
                                deleteMode={deleteMode}
                                onEdit={handleEdit}
                                editConfig={{
                                    mode: editMode,
                                    editedRows: editedRows,
                                    validationErrors: validationErrors,
                                    validationFunction: editPayrollRowValidation,
                                    onRowEdit: newRowToEditInputChange,
                                }}
                            />
                        </div>
                    )} */}
                </div>
            )}
        </div>
    );
}
