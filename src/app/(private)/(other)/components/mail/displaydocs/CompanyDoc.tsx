'use client';

import { Page, Text, View } from '@react-pdf/renderer';
import { companyStyles } from './CompanyStyles';
import { AccountingData } from '@/app/(private)/features/rents/types/rentTypes';

interface SalesDocsProps {
    accountingData: AccountingData;
    companyName: string;
    startDate: string;
    endDate: string;
}

export default function CompanyDoc({ accountingData, companyName, startDate, endDate }: SalesDocsProps) {
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
                    Rental Property Report for {companyName} from {startDate} to {endDate}
                </Text>
            </View>

            {/* Totals */}
            <View style={companyStyles.section}>
                <Text style={companyStyles.subTitle}>Company Totals</Text>
            </View>
            <View style={companyStyles.totalsRow}>
                <Text style={companyStyles.total}>Total Income: ${totalIncome.toLocaleString()}</Text>
                <Text style={companyStyles.total}>Total Expenses: ${totalExpenses.toLocaleString()}</Text>
                <Text style={companyStyles.total}>Gross Profit: ${(totalIncome - totalExpenses).toLocaleString()}</Text>
                <Text style={companyStyles.total}>Uncollected Rent: ${totalBalance.toLocaleString()}</Text>
            </View>

            {/* Per-Property Data */}
            {Array.from(accountingData.entries()).map(([propertyId, { property_name, receivables, payables, unoccupied }]) => {
                const totalPropertyIncome = receivables.reduce((sum, r) => sum + Number(r.amount_paid), 0);
                const totalPropertyIncomeDue = receivables.reduce((sum, r) => sum + Number(r.amount_due), 0);
                const totalPropertyExpenses = payables.reduce((sum, p) => sum + Number(p.expense_amount), 0);
                const grossPropertyIncome = totalPropertyIncome - totalPropertyExpenses;

                return (
                    <View key={propertyId} style={companyStyles.propertySection}>
                        {/* Property Header */}
                        <View style={companyStyles.propertyHeader}>
                            <Text style={companyStyles.propertyTitle}>{property_name}</Text>
                            <View style={companyStyles.propertyTotalsRow}>
                                <Text style={companyStyles.propertyTotals}>Income: ${totalPropertyIncome.toLocaleString()}</Text>
                                <Text style={companyStyles.propertyTotals}>Expenses: ${totalPropertyExpenses.toLocaleString()}</Text>
                                <Text style={companyStyles.propertyTotals}>Gross Income: ${grossPropertyIncome.toLocaleString()}</Text>
                                <Text style={companyStyles.propertyTotals}>Uncollected Rent ${totalPropertyIncomeDue.toLocaleString()}</Text>
                                
                            </View>
                        </View>

                        {/* Unoccupied Section */}
                        {unoccupied.length > 0 && (
                            <View style={companyStyles.subSection}>
                                <Text style={companyStyles.h3}>Vacancy Details</Text>
                                {unoccupied.map((u, idx) => (
                                    <Text key={idx} style={companyStyles.rowText}>
                                        The property was unoccupied for {u.month.substring(5,7)}/{u.month.substring(0,4)}
                                    </Text>
                                ))}
                            </View>
                        )}

                        {/* Receivables */}
                        {receivables.length > 0 && (
                            <View style={companyStyles.subSection}>
                                <Text style={companyStyles.h3}>Rental Income</Text>
                                {receivables.map((r, idx) => (
                                    <View key={idx} style={companyStyles.row}>
                                        <Text style={companyStyles.cell}>{r.tenant_name}</Text>
                                        <Text style={companyStyles.cell}>Due: ${r.amount_due}</Text>
                                        <Text style={companyStyles.cell}>Paid: ${r.amount_paid}</Text>
                                        <Text style={companyStyles.cell}>Date: {r.due_date}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Payables */}
                        {payables.length > 0 && (
                            <View style={companyStyles.subSection}>
                                <Text style={companyStyles.h3}>Payables</Text>
                                {payables.map((p, idx) => (
                                    <View key={idx} style={companyStyles.row}>
                                        <Text style={companyStyles.cell}>{p.expense_name}</Text>
                                        <Text style={companyStyles.cell}>Amount: ${p.expense_amount}</Text>
                                        <Text style={companyStyles.cell}>Date: {p.expense_date}</Text>
                                        <Text style={companyStyles.cell}>Paid With: {p.paid_with}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                );
            })}
        </Page>
    );

    return <CompanyPDF />;
}
