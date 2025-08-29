import { StyleSheet } from '@react-pdf/renderer';

export const companyStyles = StyleSheet.create({
    page: {
        padding: 20,
        height: '100%',
        width: '100%',
        fontSize: 10,
        color: '#2F2F2F',
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2F2F2F',
        marginBottom: 12,
        textAlign: 'center',
    },
    total: {
        fontSize: 11,
        color: '#333333',
        marginBottom: 6,
        textAlign: 'left',
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#DFDFDF',
    },

    // Sections
    section: {
        marginBottom: 12,
    },
    subTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#2F2F2F',
    },

    h3: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#666666',
    },

    // Property block
    propertySection: {
        marginBottom: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
    },
    propertyHeader: {
        marginBottom: 12,
    },

    propertyTitle: {
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 4, // space between title and totals row
    },

    propertyTotalsRow: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 20, // spacing between each total (or use marginRight if gap unsupported)
    },

    propertyTotals: {
        fontSize: 12,
        color: "#555",
    },

    // Sub-sections inside property
    subSection: {
        marginTop: 6,
        marginBottom: 4,
    },
    rowText: {
        fontSize: 10,
        marginBottom: 2,
    },
    totalsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 20, // 20px space between items
    },

    // Table-like rows
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#DFDFDF',
        minHeight: 18,
        alignItems: 'center',
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
    },
});
