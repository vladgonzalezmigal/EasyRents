'use client';

import { Page, Text, View } from '@react-pdf/renderer';
import { companyStyles } from './CompanyStyles';
import { AccountingData } from '@/app/(private)/features/rents/types/rentTypes';

interface CompanyDocsProps {
    accountingData: AccountingData;
    companyName: string;
    startDate: string;
    endDate: string;
}

export default function CompanyDoc({ accountingData, companyName, startDate, endDate }: CompanyDocsProps) {
    // Compute totals across all properties
    const totalIncome = Array.from(accountingData.values())
        .reduce((sum, { receivables }) => sum + receivables.reduce((rSum, r) => rSum + Number(r.amount_paid), 0), 0);

    const totalExpenses = Array.from(accountingData.values())
        .reduce((sum, { payables }) => sum + payables.reduce((pSum, p) => pSum + Number(p.expense_amount), 0), 0);

    const totalDue = Array.from(accountingData.values())
        .reduce((sum, { receivables }) => sum + receivables.reduce((rSum, r) => rSum + Number(r.amount_due), 0), 0);

    const totalBalance = totalDue - totalIncome;

    const CompanyPDF = () => (
        <Page size="A4" style={companyStyles.page}>
            {/* Document Title */}
            <View style={companyStyles.section}>
                <Text style={companyStyles.title}>
                    Rental Property Report for {companyName} from {startDate.substring(5,)+"-"+startDate.substring(0,4)} to {endDate.substring(5,)+"-"+startDate.substring(0,4)}
                </Text>
            </View>

            {/* Totals */}
            <View style={companyStyles.section}>
                <Text style={companyStyles.subTitle}>Company Totals</Text>
                <View

 style={companyStyles.totalsRow}>
                    <Text style={companyStyles.total}>Total Income: ${totalIncome.toLocaleString()}</Text>
                    <Text style={companyStyles.total}>Total Expenses: ${totalExpenses.toLocaleString()}</Text>
                    <Text style={companyStyles.total}>Gross Profit: ${(totalIncome - totalExpenses).toLocaleString()}</Text>
                    <Text style={companyStyles.total}>Uncollected Rent: ${totalBalance.toLocaleString()}</Text>
                </View>
            </View>

            {/* Per-Property Data */}
            {Array.from(accountingData.entries()).map(([propertyId, { property_name, receivables, payables, unoccupied }]) => {
                const totalPropertyIncome = receivables.reduce((sum, r) => sum + Number(r.amount_paid), 0);
                const totalPropertyIncomeDue = receivables.reduce((sum, r) => sum + Number(r.amount_due), 0) - totalPropertyIncome;
                const totalPropertyExpenses = payables.reduce((sum, p) => sum + Number(p.expense_amount), 0);
                const grossPropertyIncome = totalPropertyIncome - totalPropertyExpenses;

                return (
                    <View key={propertyId} style={companyStyles.propertySection} wrap={false}>
                        {/* Property Header */}
                        <View style={companyStyles.propertyHeader}>
                            <Text style={companyStyles.propertyTitle}>{property_name}</Text>
                            <View style={companyStyles.propertyTotalsRow}>
                                <Text style={companyStyles.propertyTotals}>Income: ${totalPropertyIncome.toLocaleString()}</Text>
                                <Text style={companyStyles.propertyTotals}>Expenses: ${totalPropertyExpenses.toLocaleString()}</Text>
                                <Text style={companyStyles.propertyTotals}>Gross Income: ${grossPropertyIncome.toLocaleString()}</Text>
                                <Text style={companyStyles.propertyTotals}>Uncollected Rent: ${totalPropertyIncomeDue.toLocaleString()}</Text>
                            </View>
                        </View>

                        {/* Unoccupied Section */}
                        {unoccupied.length > 0 && (
                            <View style={companyStyles.subSection}>
                                <Text style={companyStyles.h3}>Vacancy Details</Text>
                                {unoccupied.map((u, idx) => (
                                    <Text key={idx} style={companyStyles.rowText}>
                                        The property was unoccupied in {u.month.substring(5,7)}/{u.month.substring(0,4)}
                                    </Text>
                                ))}
                            </View>
                        )}

                        {/* Receivables */}
                        {receivables.length > 0 && (
                            <View style={companyStyles.subSection}>
                                <Text style={companyStyles.h3}>Rental Income</Text>
                                <View style={[companyStyles.row, companyStyles.headerRow]}>
                                    <Text style={companyStyles.cell}>Tenant</Text>
                                    <Text style={companyStyles.cell}>Amount Paid</Text>
                                    <Text style={companyStyles.cell}>Amount Due</Text>
                                    <Text style={companyStyles.cell}>Paid On</Text>
                                </View>
                                {receivables.map((r, idx) => (
                                    <View key={idx} style={companyStyles.row}>
                                        <Text style={companyStyles.cell}>{r.tenant_name}</Text>
                                        <Text style={companyStyles.cell}>${r.amount_paid}</Text>
                                        <Text style={companyStyles.cell}>${r.amount_due}</Text>
                                        <Text style={companyStyles.cell}>{r.due_date.substring(5,)+"-"+r.due_date.substring(0,4)}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Payables */}
                        {payables.length > 0 && (
                            <View style={companyStyles.subSection}>
                                <Text style={companyStyles.h3}>Expenses</Text>
                                <View style={[companyStyles.row, companyStyles.headerRow]}>
                                    <Text style={companyStyles.cell}>Expense</Text>
                                    <Text style={companyStyles.cell}>Amount</Text>
                                    <Text style={companyStyles.cell}>Paid Date</Text>
                                    <Text style={companyStyles.cell}>Paid With</Text>
                                    <Text style={companyStyles.cell}>Detail</Text>
                                </View>
                                {payables.map((p, idx) => (
                                    <View key={idx} style={[companyStyles.row, idx === 0 && companyStyles.headerRow]}>
                                        <Text style={companyStyles.cell}>{p.expense_name}</Text>
                                        <Text style={companyStyles.cell}>Amount: ${p.expense_amount}</Text>
                                        <Text style={companyStyles.cell}>Date: {p.expense_date.substring(5,)+"-"+p.expense_date.substring(0,4)}</Text>
                                        <Text style={companyStyles.cell}>Paid With: {p.paid_with}</Text>
                                        <Text style={companyStyles.cell}>{p.detail}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                        <View style={companyStyles.divider} />
                    </View>
                );
            })}
        </Page>
    );

    return <CompanyPDF />;
}