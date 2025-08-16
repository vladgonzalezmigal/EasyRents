'use client';

import CreateCompany from "./СreateStore";
import DisplayCompanies from "./DisplayStores";

export default function CompanySection() {

    return (
        <div className="w-full space-y-6">
            <CreateCompany />
            <DisplayCompanies />
        </div>
    );
}