'use client';

import { Payroll } from '@/app/(private)/types/formTypes';
import {  Page, Text, View } from '@react-pdf/renderer';
import { payrollStyles } from './PayrollStyles';

interface PayrollDocsProps {
    payrollData: Payroll[];
    startDate: string;
    endDate: string;
}

export default function PayrollDocs({ payrollData, startDate, endDate }: PayrollDocsProps) {
    const totalPayroll = payrollData.reduce((sum, payroll) => sum + payroll.total_pay, 0);

    const PayrollPDF = () => (
            <Page size="A4" style={payrollStyles.page}>
                {/* Document title */}
                <View>
                    <Text style={payrollStyles.title}>Payroll Period: {startDate.slice(5)} to {endDate.slice(5) + ", " + startDate.slice(0, 4)}</Text>
                </View>
                {/* Total */}
                <View>
                    <Text style={payrollStyles.total}>Total: ${totalPayroll.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                </View>

                <View style={payrollStyles.table}>
                    {/* Header Row */}
                    <View style={[payrollStyles.rowHeader, payrollStyles.header]} wrap={false}>
                        <Text style={payrollStyles.employeeCell}>Employee</Text>
                        <Text style={payrollStyles.cell}>Pay Type</Text>
                        <Text style={payrollStyles.cell}>Rate</Text>
                        <Text style={payrollStyles.smallCell}>Hours</Text>
                        <Text style={payrollStyles.smallCell}>Minutes</Text>
                        <Text style={payrollStyles.cell}>Gross Pay</Text>
                    </View>

                    {/* Data Rows */}
                    {payrollData.map((row) => (
                        <View style={payrollStyles.row} key={row.id} wrap={false}>
                            <Text style={payrollStyles.employeeCell}>{row.employee_name}</Text>
                            <Text style={payrollStyles.cell}>{row.wage_type}</Text>
                            <Text style={payrollStyles.cell}>${row.wage_rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                            <Text style={payrollStyles.smallCell}>{row.hours}</Text>
                            <Text style={payrollStyles.smallCell}>{row.minutes}</Text>
                            <Text style={payrollStyles.cell}>${row.total_pay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                        </View>
                    ))}
                </View>
            </Page>
    );

    return <PayrollPDF />
    
}
