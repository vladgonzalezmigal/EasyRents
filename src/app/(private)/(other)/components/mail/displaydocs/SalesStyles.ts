import { StyleSheet } from '@react-pdf/renderer';

export const salesStyles = StyleSheet.create({
    page: {
        padding: 20,
        height: '100%',
        width: '100%',
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2F2F2F',
        marginBottom: 10,
        textAlign: 'center',
    },
    total: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 10,
        textAlign: 'left',
        padding: '4px 0',
        borderBottom: '1px solid #DFDFDF',
    },
    table: {
        display: 'flex',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#DFDFDF',
        height: 'auto',
    },
    row: {
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
        fontSize: 9,
        textAlign: 'left',
        borderRightWidth: 1,
        borderRightColor: '#DFDFDF',
    },
    firstCell: {
        textAlign: 'left',
    }
});
