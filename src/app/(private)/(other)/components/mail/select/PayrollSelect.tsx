'use client';

interface PayrollSelectProps {
    selectedPayrolls: { startDate: string; endDate: string }[];
    onPayrollSelect: (payroll: { startDate: string; endDate: string }) => void;
    payrolls: { startDate: string; endDate: string }[];
}

export default function PayrollSelect({ selectedPayrolls, onPayrollSelect, payrolls }: PayrollSelectProps) {
    return (
        <div className="flex flex-wrap gap-4 ">
            {payrolls.map((payroll, index) => (
                <div
                    key={`${payroll.startDate}-${payroll.endDate}`}
                    onClick={() => onPayrollSelect(payroll)}
                    className={`p-4 border rounded-2xl shadow-md cursor-pointer w-[300px] flex items-center justify-center ${
                        selectedPayrolls.some(p => p.startDate === payroll.startDate && p.endDate === payroll.endDate)
                            ? 'bg-[#F2FBFA] border-[#DFDFDF]'
                            : 'bg-white border-[#DFDFDF]'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={selectedPayrolls.some(p => p.startDate === payroll.startDate && p.endDate === payroll.endDate)}
                            onChange={() => {}}
                            className="w-4 h-4 rounded border-[#8ABBFD] text-[#8ABBFD] focus:ring-[#8ABBFD]"
                        />
                        <p className={`text-sm  ${
                            selectedPayrolls.some(p => p.startDate === payroll.startDate && p.endDate === payroll.endDate)
                                ? 'text-[#2A7D7B] font-bold'
                                : 'text-gray-500 font-semibold'
                        }`}>
                            Period {index + 1}: {payroll.startDate.slice(5)} to {payroll.endDate.slice(5) + ", " + payroll.startDate.slice(0, 4)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
