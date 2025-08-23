export type Receivable = {
    id: number;
    property_id: number;
    amount_paid: number; 
    amount_due: number;
    due_date: string; 
    paid_by: string; 
    tenant_name: string; 
};

export type Payable = {
    id: number;
    property_id: number;
    expense_amount: number; 
    expense_date: string;
    paid_with: string;
    detail: string; 
};

export type AccountingData = Map<number, {property_name : string, receivables: Receivable[], payables: Payable[]}>; // Map of property_id to array of Payables