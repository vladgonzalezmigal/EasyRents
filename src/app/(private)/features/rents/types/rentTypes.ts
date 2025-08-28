export class Receivable {
    constructor(
        public id: number | undefined,
        public property_id: number,
        public amount_paid: number,
        public amount_due: number,
        public due_date: string,
        public paid_by: string | null,
        public tenant_name: string
    ) { }

    equals(other: Receivable): boolean {
        return (
            this.id === other.id &&
            this.property_id === other.property_id &&
            this.amount_paid === other.amount_paid &&
            this.amount_due === other.amount_due &&
            this.due_date === other.due_date &&
            this.paid_by === other.paid_by &&
            this.tenant_name === other.tenant_name
        );
    }

    clone(): Receivable {
        return new Receivable(
            this.id,
            this.property_id,
            this.amount_paid,
            this.amount_due,
            this.due_date,
            this.paid_by,
            this.tenant_name
        );
    }

    cloneWithoutId() {
        const { id, ...rest } = this;
        return { ...rest }; // Return plain object
    }
}

export class Payable {
    constructor(
        public id: number,
        public property_id: number,
        public expense_name: string,
        public expense_amount: number,
        public expense_date: string,
        public paid_with: string,
        public detail: string
    ) { }

    equals(other: Payable): boolean {
        return (
            this.id === other.id &&
            this.property_id === other.property_id &&
            this.expense_name === other.expense_name &&
            this.expense_amount === other.expense_amount &&
            this.expense_date === other.expense_date &&
            this.paid_with === other.paid_with &&
            this.detail === other.detail
        );
    }
}

export interface Unoccupied {
    id: number;
    property_id: number; 
    month: string
}

// maps property id to information about the property's rents and expenses
export type AccountingData = Map<number, { property_name: string, receivables: Receivable[], payables: Payable[] }>; // Map of property_id to array of Payables

export function deepCopyMap(originalMap: AccountingData): AccountingData {
    const newMap = new Map<number, { property_name: string, receivables: Receivable[], payables: Payable[] }>();

    for (const [key, value] of originalMap) {
        // Deep copy receivables by creating new Receivable instances
        const receivablesCopy = value.receivables.map(item => new Receivable(
            item.id,
            item.property_id,
            item.amount_paid,
            item.amount_due,
            item.due_date,
            item.paid_by,
            item.tenant_name
        ));

        // Deep copy payables 
        const payablesCopy = value.payables.map(item => new Payable(
            item.id,
            item.property_id,
            item.expense_name,
            item.expense_amount,
            item.expense_date,
            item.paid_with,
            item.detail
        ));

        // Set the new entry in the map
        newMap.set(key, {
            property_name: value.property_name,
            receivables: receivablesCopy,
            payables: payablesCopy
        });
    }

    return newMap;
}

export const PAYMENT_OPTIONS = ['CASH', 'CHECK', 'CARD']