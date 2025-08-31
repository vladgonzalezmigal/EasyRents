'use client';

import CreateCompany from "./СreateCompany";
import DisplayCompanies from "./DisplayCompanies";

export default function CompanySection() {

    return (
        <div className="w-full space-y-6">
            <CreateCompany />
            <DisplayCompanies />
        </div>
    );
}