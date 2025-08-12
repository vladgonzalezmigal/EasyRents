'use client';

import { Sales } from '@/app/(private)/types/formTypes';
import { formatSalesData } from '@/app/(private)/features/handleForms/utils/formDataDisplay/formDataDisplay';
import { salesStyles } from './SalesStyles';
import { Page, Text, View } from '@react-pdf/renderer';

interface SalesDocsProps {
    salesData: Sales[];
    storeName: string;
    year: string;
    month: string;
}

export default function SalesDocs({ salesData, storeName, year, month }: SalesDocsProps) {
    const formattedData = formatSalesData(salesData);
    const totalSales = formattedData.length > 0 ? formattedData[0].cumulative_total : 0;

    const SalesPDF = () => (
            <Page size="A4" style={salesStyles.page}>
                {/* Document title */}
                <View>
                    <Text style={salesStyles.title}>Sales for {storeName}, {month} {year}</Text>
                </View>
                {/* Total */}
                <View>
                    <Text style={salesStyles.total}>Total: ${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                </View>

                <View style={salesStyles.table}>
                    {/* Header Row */}
                    <View style={[salesStyles.row, salesStyles.header]}>
                        <Text style={salesStyles.cell}>Date</Text>
                        <Text style={salesStyles.cell}>Sales</Text>
                        <Text style={salesStyles.cell}>Taxes</Text>
                        <Text style={salesStyles.cell}>Daily</Text>
                        <Text style={salesStyles.cell}>Total</Text>
                    </View>

                    {/* Data Rows */}
                    {formattedData.map((row) => (
                        <View style={salesStyles.row} key={row.date}>
                            <Text style={salesStyles.cell}>{row.date}</Text>
                            <Text style={salesStyles.cell}>${row.sales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                            <Text style={salesStyles.cell}>${row.taxes.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                            <Text style={salesStyles.cell}>${row.daily_total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                            <Text style={salesStyles.cell}>${row.cumulative_total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                        </View>
                    ))}
                </View>
            </Page>
    );

    return <SalesPDF />
}
