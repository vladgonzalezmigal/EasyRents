'use client';

import { useStore } from '@/store'; 
import { Company } from '../../types/CompanyTypes';
import CompanyTemplate from './DisplayCompany';

export default function CompanySection() {
    const { companyState: companyState } = useStore();
    const active_companies : Company[] = companyState.data?.filter(company => company.active) || [];

    return (
        <div className="w-full space-y-6">
                {active_companies.map(company => (
                    <CompanyTemplate key={company.id} activeCompany={company} />
                ))}
        </div>
    );
}