'use client';

import CreateVendor from './CreateVendor';
import DisplayVendors from './DisplayVendors';

export default function VendorSection() {

    return (
        <div className="w-full space-y-6">
            <CreateVendor />
            <DisplayVendors />
        </div>
    );
}
