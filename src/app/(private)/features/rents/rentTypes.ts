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

export type Payable = {
    id: number;
    property_id: number;
    expense_amount: number;
    expense_date: string;
    paid_with: string;
    detail: string;
};

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

        // Deep copy payables (since Payable is a plain object, a shallow copy is sufficient)
        const payablesCopy = value.payables.map(item => ({ ...item }));

        // Set the new entry in the map
        newMap.set(key, {
            property_name: value.property_name,
            receivables: receivablesCopy,
            payables: payablesCopy
        });
    }

    return newMap;
}