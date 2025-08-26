'use client';

import { useRouter } from "next/navigation";
import { useStore } from "@/store";
import { months } from "../utils/dateUtils";
import CalendarIcon from "../components/svgs/CalendarIcon";
import GearIcon from "../components/svgs/GearIcon";
import Link from "next/link";
import { Company } from "../features/userSettings/types/CompanyTypes";
import BuildingIcon from "../components/svgs/BuildingIcon";

export default function DashboardPage() {
  const router = useRouter();
  const { companyState: companyState, propertyState, tenantState } = useStore();
  const companies: Company[] = companyState?.data?.filter(c => c.active) || [];

  // Get current month and year
  const today = new Date();
  const currentYear = today.getFullYear().toString();
  const currentMonth: number = (today.getMonth())
  const monthName = months[currentMonth];


  const handleNavigation = (company_id: number) => {
    router.push(`/selection/rents/${company_id}/${currentYear}/${(currentMonth + 1)}`)
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className=" w-[600px] h-full flex flex-col items-center justify-center ">
        <h1 className=" mb-8 text-3xl text-center font-bold text-[#2F2F2F]">
          Welcome, Choose a Company:
        </h1>
        {/* Main Contnet */}
        <div className="flex flex-col space-y-4 w-full relative">
          {companies.map((company) => (
            <div key={company.id} className="w-full flex justify-start  bg-[#FBFBFB] rounded-2xl shadow-md border border-[#DFDFDF]">
              <div
                key={company.id}
                onClick={() => handleNavigation(company.id)}
                className="w-[500px] h-[144px] bg-white px-7 hover:bg-[#F2FBFA] rounded-2xl border border-[#DFDFDF] shadow-md flex items-center justify-between transition-colors duration-200 cursor-pointer"
              >
                {/* Label section */}
                <div className="flex">
                  {/* Icon */}
                  <div className="w-[68px] h-[68px] bg-[#DFF4F3] rounded-2xl flex items-center justify-center">
                    <div className="w-[36px] h-[36px] flex items-center justify-center">
                      <BuildingIcon className="text-[#2A7D7B] w-full h-full" />
                    </div>
                  </div>
                  <div className="pl-4 h-[68px] flex flex-col justify-center">
                    <p className="text-[#2F2F2F] text-[24px] font-semibold"> {company.company_name.charAt(0).toUpperCase() + company.company_name.slice(1)}</p>
                    <p className="text-[#80848A] text-[16px] font-normal"> {monthName} {currentYear}</p>
                  </div>
                </div>
                {/* Total section */}
                <div className="w-[160px] h-[68px] bg-[#DFF4F3] rounded-2xl pl-4 flex flex-col justify-center">
                  <p className="text-[#696969] text-[14px] font-semibold"> Total </p>
                  <p className="text-[#2A7D7B] text-[16px] font-semibold"> ${
                    (propertyState.data?.get(company.id)
                      ?.reduce((sum, property) => {
                        // Get all tenants for this property
                        const tenants = tenantState.data?.get(property.id) || [];
                        // Sum rent_amount for each tenant
                        const tenantTotal = tenants.reduce((tSum, tenant) => tSum + Number(tenant.rent_amount || 0), 0);
                        return sum + tenantTotal;
                      }, 0))?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  } </p>
                </div>
              </div>
              {/* Button section */}
              <div className="w-[100px] flex flex-col items-center justify-center">
                {/* Search section */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-[52px] h-[52px] bg-[#48B4A0]/10 rounded-full flex items-center justify-center border-2 border-[#48B4A0] cursor-pointer"
                    onClick={() => router.push(`selection/rents/${company.id}`)}>
                    <CalendarIcon className="text-[#48B4A0] w-7 h-7" />
                  </div>
                  <p className="text-[#2F2F2F] font-semibold text-[12px]"> Search </p>
                </div>
                {/* Settings section */}
                <div className="flex flex-col items-center justify-center">
                  <Link href={`/settings#${company.company_name.replaceAll(" ", "")}`}>
                    <div className="w-[52px] h-[52px] bg-[#005DDF]/10 rounded-full flex items-center justify-center border-2 border-[#0C3C74] cursor-pointer">
                      <GearIcon className="text-[#0C3C74] w-7 h-7" />
                    </div>
                  </Link>
                  <p className="text-[#2F2F2F] font-semibold text-[12px]"> Settings</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}