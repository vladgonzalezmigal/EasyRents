export interface Vendor {
    id: number;
    vendor_name: string;
    active: boolean;
}

export interface VendorResponse {
    vendors: Vendor[] | null;
    error: string | null;
}