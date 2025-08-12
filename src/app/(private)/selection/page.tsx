'use client';

import { useRouter } from "next/navigation";
import { useStore } from "@/store";
import { months } from "../utils/dateUtils";
import SalesIcon from "../components/svgs/SalesIcon";
import ExpensesIcon from "../components/svgs/ExpensesIcon";
import PayrollIcon from "../components/svgs/PayrollIcon";
import CalendarIcon from "../components/svgs/CalendarIcon";
import GearIcon from "../components/svgs/GearIcon";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { storeState } = useStore();
  const { stores } = storeState;

  // Get current month and year
  const today = new Date();
  const currentYear = today.getFullYear().toString();
  const currentMonth: number = (today.getMonth())
  const monthName = months[currentMonth];

  // Create an object mapping form types to their icons
  const formOptions = {
    sales: SalesIcon,
    expenses: ExpensesIcon,
    payroll: PayrollIcon
  };

  const handleNavigation = (option: string) => {
    if (stores && option === "sales") {
      router.push(`/selection/sales/${stores[0].id}/${currentYear}/${(currentMonth + 1)}`);
    } else if (!stores && option === "sales") {
      router.push(`/selection/`); // user needs to refresh the page to see the stores
    } else if (option === "payroll") { // calculate which half of the month to navigate to
      const currentDay = today.getDate();
      const half = currentDay <= 15 ? 1 : 2;
      router.push(`/selection/${option}/${currentYear}/${(currentMonth + 1)}/${half}`);
      // router.push(`/selection/${option}/${currentYear}/${(currentMonth + 1)}`);
    } else {
      router.push(`/selection/${option}/${currentYear}/${(currentMonth + 1)}`);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className=" w-[600px] h-full flex flex-col items-center justify-center ">
        <h1 className=" mb-8 text-3xl text-center font-bold text-[#2F2F2F]">
          Welcome, Choose a Document:
        </h1>
        {/* Main Contnet */}
        <div className="flex flex-col space-y-4 w-full relative">
          {Object.entries(formOptions).map(([option, Icon]) => (
            <div key={option} className="w-full flex justify-start  bg-[#FBFBFB] rounded-2xl shadow-md border border-[#DFDFDF]">
              <div
                key={option}
                onClick={() => handleNavigation(option)}
                className="w-[500px] h-[144px] bg-white px-7 hover:bg-[#F2FBFA] rounded-2xl border border-[#DFDFDF] shadow-md flex items-center justify-between transition-colors duration-200 cursor-pointer"
              >
                {/* Label section */}
                <div className="flex">
                  {/* Icon */}
                  <div className="w-[68px] h-[68px] bg-[#DFF4F3] rounded-2xl flex items-center justify-center">
                    <div className="w-[36px] h-[36px] flex items-center justify-center">
                      <Icon className="text-[#2A7D7B] w-full h-full" />
                    </div>
                  </div>
                  <div className="pl-4 h-[68px] flex flex-col justify-center">
                    <p className="text-[#2F2F2F] text-[24px] font-semibold"> {option.charAt(0).toUpperCase() + option.slice(1)}</p>
                    <p className="text-[#80848A] text-[16px] font-normal"> {monthName} {currentYear}</p>
                  </div>
                </div>
                {/* Total section */}
                <div className="w-[136px] h-[68px] bg-[#DFF4F3] rounded-2xl pl-4 flex flex-col justify-center">
                  <p className="text-[#696969] text-[14px] font-semibold"> Total </p>
                  <p className="text-[#2A7D7B] text-[18px] font-semibold"> $100,000</p>
                </div>
              </div>
              {/* Button section */}
              <div className="w-[100px] flex flex-col items-center justify-center">
                {/* Search section */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-[52px] h-[52px] bg-[#48B4A0]/10 rounded-full flex items-center justify-center border-2 border-[#48B4A0] cursor-pointer"
                    onClick={() => router.push(`selection/${option}/${(stores && (option === "sales") ? `${stores[0].id}` : '')}`)}>
                    <CalendarIcon className="text-[#48B4A0] w-7 h-7" />
                  </div>
                  <p className="text-[#2F2F2F] font-semibold text-[12px]"> Search </p>
                </div>
                {/* Settings section */}
                <div className="flex flex-col items-center justify-center">
                  <Link href={`/settings#${option}`}>
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