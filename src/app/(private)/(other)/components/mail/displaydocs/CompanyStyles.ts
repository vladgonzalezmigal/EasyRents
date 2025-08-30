import { StyleSheet } from '@react-pdf/renderer';

export const companyStyles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#1A1A1A',
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 16,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    subTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    h3: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#3A3A3A',
        marginBottom: 8,
        marginTop: 8,
    },
    total: {
        fontSize: 11,
        color: '#2A2A2A',
        marginBottom: 6,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    section: {
        marginBottom: 8,
    },
    propertySection: {
        marginBottom: 24,
        padding: 12,
        borderWidth: 0.5,
        borderColor: '#E0E0E0',
    },
    propertyHeader: {
        marginBottom: 12,
    },
    propertyTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    propertyTotalsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
    },
    propertyTotals: {
        fontSize: 11,
        color: '#3A3A3A',
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    subSection: {
        marginVertical: 10,
    },
    rowText: {
        fontSize: 10,
        color: '#2A2A2A',
        marginBottom: 4,
        paddingHorizontal: 4,
    },
    totalsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
        marginBottom: 16,
        padding: 8,
    },
    row: {
        flexDirection: 'row',
        minHeight: 20,
        alignItems: 'center',
        borderTopWidth: 0.5,
        borderTopColor: '#E0E0E0',
        borderBottomWidth: 0.5,
        borderBottomColor: '#E0E0E0',
    },
    headerRow: {
        fontWeight: 'medium',
    },
    cell: {
        flex: 1,
        padding: 6,
        fontSize: 9,
        color: '#2A2A2A',
        textAlign: 'left',
        borderRightWidth: 0.5,
        borderRightColor: '#E0E0E0',
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginTop: 12,
        marginBottom: 4,
    },
});