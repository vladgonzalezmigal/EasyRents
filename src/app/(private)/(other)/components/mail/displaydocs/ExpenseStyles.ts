import { StyleSheet } from '@react-pdf/renderer';

export const expenseStyles = StyleSheet.create({
    page: {
        paddingVertical: 30,
        paddingHorizontal: 20,
        width: '100%',
        height: '100%',
        maxHeight: '90%',
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2F2F2F',
        marginBottom: 4,
        textAlign: 'center',
    },
    total: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 10,
        textAlign: 'left',
        padding: '8px 0',
        borderBottom: '1px solid #DFDFDF',
    },
    table: {
        display: 'flex',
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#DFDFDF',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#DFDFDF',
        height: 18,
        maxHeight: 30,
        alignItems: 'center',
    },
    rowHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#DFDFDF',
        minHeight: 20,
        alignItems: 'center',
        breakInside: 'avoid',
    },
    header: {
        backgroundColor: '#F2FBFA',
        fontWeight: 'bold',
    },
    cell: {
        flex: 1,
        padding: 2,
        fontSize: 8,
        textAlign: 'left',
        borderRightWidth: 1,
        borderRightColor: '#DFDFDF',
    },
    dateCell: {
        flex: 0.75,
        padding: 2,
        fontSize: 8,
        textAlign: 'left',
        borderRightWidth: 1,
        borderRightColor: '#DFDFDF',
    },
    dateCellHeader: {
        flex: 0.75,
        padding: 4,
        fontSize: 10,
        textAlign: 'left',
        borderRightWidth: 1,
        borderRightColor: '#DFDFDF',
    },
    cellHeader: {
        flex: 1,
        padding: 4,
        fontSize: 10,
        textAlign: 'left',
        borderRightWidth: 1,
        borderRightColor: '#DFDFDF',
    },
    paymentTypeCell: {
        flex: 0.75, // 25% smaller than other cells
        padding: 2,
        fontSize: 8,
        textAlign: 'left',
        borderRightWidth: 1,
        borderRightColor: '#DFDFDF',
    },
    paymentTypeCellHeader: {
        flex: 0.75, // 25% smaller than other cells
        padding: 4,
        fontSize: 10,
        textAlign: 'left',
        borderRightWidth: 1,
        borderRightColor: '#DFDFDF',
    },
    companyCell: {
        flex: 1.50, // Extra space from payment type & date
        padding: 2,
        fontSize: 8,
        textAlign: 'left',
        borderRightWidth: 1,
        borderRightColor: '#DFDFDF',
    },
    companyCellHeader: {
        flex: 1.50, // Extra space from payment type & date
        padding: 4,
        fontSize: 10,
        textAlign: 'left',
        borderRightWidth: 1,
        borderRightColor: '#DFDFDF',
    },
    firstCell: {
        textAlign: 'left',
    }
});