'use client';

import React from 'react';
import { Expense } from '../../../../types/formTypes'
import { Vendor } from '../../../../features/userSettings/types/vendorTypes'
import { expenseStyles } from './ExpenseStyles';
import { Page, Text, View } from '@react-pdf/renderer';

interface ExpenseDocsProps {
    expenseData: Expense[];
    vendors: Vendor[];
    year: string;
    month: string;
}

export default function ExpenseDocs({ expenseData, year, month, vendors }: ExpenseDocsProps) {
    const totalExpenses = expenseData.reduce((sum, expense) => sum + expense.amount, 0);

    // Group expenses by payment type, then sort each group by date
    const sortedExpenses = Object.entries(
        expenseData.reduce((groups, expense) => {
            const type = expense.payment_type;
            if (!groups[type]) groups[type] = [];
            groups[type].push(expense);
            return groups;
        }, {} as Record<string, Expense[]>)
    )
        .sort(([typeA], [typeB]) => typeA.localeCompare(typeB)) // Sort payment types alphabetically
        .flatMap(([, expenses]) =>
            expenses.sort((a, b) => b.date.localeCompare(a.date)) // Sort dates within each group (newest date first)
        );

    // map the vendors to the sortedExpenses data
    const vendorMap = vendors.reduce((map, vendor) => {
        map[vendor.id] = vendor.vendor_name;
        return map;
    }, {} as Record<number, string>) || {};

    const mappedExpenses = sortedExpenses.map(expense => ({
        ...expense,
        company: vendorMap[expense.company] || "company"
    }));

    const ExpensePDF = () => (
        <Page size="A4" style={expenseStyles.page}>
            {/* Document title */}
            <View>
                <Text style={expenseStyles.title}>Expenses for {month} {year}</Text>
            </View>
            {/* Total */}
            <View>
                <Text style={expenseStyles.total}>Total: ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
            </View>

            <View style={expenseStyles.table}>
                {/* Header Row */}
                <View style={[expenseStyles.rowHeader, expenseStyles.header]} wrap={false}>
                    <Text style={expenseStyles.dateCellHeader}>Date</Text>
                    <Text style={expenseStyles.paymentTypeCellHeader}>Payment Type</Text>
                    <Text style={expenseStyles.companyCellHeader}>Company</Text>
                    <Text style={expenseStyles.cellHeader}>Detail</Text>
                    <Text style={expenseStyles.cellHeader}>Amount</Text>
                </View>

                {/* Data Rows */}
                {mappedExpenses.map((expense) => (
                    <View style={expenseStyles.row} wrap={false} key={expense.id}>
                        <Text style={expenseStyles.dateCell}>{expense.date}</Text>
                        <Text style={expenseStyles.paymentTypeCell}>{expense.payment_type}</Text>
                        <Text style={expenseStyles.companyCell}>{expense.company}</Text>
                        <Text style={expenseStyles.cell}>{expense.detail}</Text>
                        <Text style={expenseStyles.cell}>${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    </View>
                ))}
            </View>
        </Page>
    );

    return <ExpensePDF />
}