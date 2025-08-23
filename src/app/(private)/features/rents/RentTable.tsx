import { AccountingData } from "./rentTypes";
import TableBtns from "./TableBtns";

interface RentTableProps {
    accounting_data: AccountingData
}


export default function RentTable({ accounting_data }: RentTableProps) {

    const noData = (
        <tr className="h-full flex items-center justify-center">
            <td colSpan={3} className="px-6 py-4 text-center text-[18px] text-[#404040] font-semibold">
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
                <div className="w-[800px] ">
                    {/* Header */}
                    <table className="w-full ">
                        <thead className="px-4 bg-[#F5F5F5] z-30 border border-b-0 border-t-2 border-x-2 border-[#ECECEE] h-[60px] rounded-top header-shadow flex items-center relative z-10">
                            <tr className="flex flex-row justify-between bg-[#F5F5F5] w-full px-10">
                                <th className="w-[200px] pl-4 text-left">
                                    <span className="text-[16px] text-[#80848A]">Address</span>
                                </th>
                                <th className="w-[100px] pl-4 text-left">
                                    <span className="text-[16px] text-[#80848A]">Total Rent</span>
                                </th>
                                <th className="w-[100px] pl-4 text-left">
                                    <span className="text-[16px] text-[#80848A]">Total Expenses</span>
                                </th>
                                <th className="w-[50px] pl-4 text-left">
                                    <span className="text-[16px] text-[#80848A]">Gross Income</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="flex flex-col gap-y-3 h-[304px] relative z-10 border border-[#ECECEE] table-input-shadow border-y-2 border-t-0 bg-[#FDFDFD] rounded-bottom relative z-0 py-4 ">
                            {
                                accounting_data.keys.length === 0 ? noData : <tr>
                                </tr>
                            }
                        </tbody>
                    </table>
                    {/* Body */}
                    {/* <PayrollTableRows
                        data={data}
                        showCreateRow={createRow}
                        onCreate={onCreate}
                        onSubmitCreate={onSubmitCreate}
                        cudLoading={cudLoading}
                        deleteConfig={deleteConfig}
                        editConfig={editConfig}
                    /> */}
                </div>
                {/* Action Button */}
                <div className="w-[800px]">
                    <TableBtns />
                    {/* <PayrollBtns
                        deleteMode={deleteMode}
                        editConfig={editConfig}
                        cudLoading={cudLoading}
                        onCreateToggle={handleCreateToggle}
                        handleDelete={handleDelete}
                        canDelete={canDelete}
                        onEdit={onEdit}
                    /> */}
                </div>
            </div>
        </div>
    )
}
