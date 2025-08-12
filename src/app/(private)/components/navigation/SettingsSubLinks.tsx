'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDaysInMonth, trimmedMonthName } from "../../utils/dateUtils";

type SettingsType = 'expenses' | 'payroll';

interface SettingsSubLinksProps {
    type: SettingsType;
}

export default function SettingsSubLinks({ type }: SettingsSubLinksProps) {
    const pathname = usePathname();
    if (type !== 'expenses' && type !== 'payroll') {
        return null;
    }
    const periodLinks: boolean = (pathname.split("/").length === 6) && (pathname.includes("payroll"));
    let monthIndex: number = 0;
    let parsedPath: string = ""
    if (periodLinks) {
        monthIndex = parseInt(pathname.split("/")[4]) - 1;
        parsedPath = pathname.split("/").slice(0, 5).join("/");
    }

    return (
        <div className="flex flex-col gap-y-2.5 pl-10 mt-1">
            <Link
                href={`/settings#${type}`}
                className="hover:bg-[#B6E8E4] transition-colors duration-200 rounded-lg pl-2 py-2"
            >
                <p className="text-[14px] text-[#6B7280] hover:text-[#2A7D7B] transition-colors duration-200 capitalize">
                    {(type === 'expenses') ? "Vendors" : "Employees"}
                </p>
            </Link>
            {/* Payroll Links */}
            {periodLinks && (
                <>
                    <Link
                        href={parsedPath + "/1"}
                        className="hover:bg-[#B6E8E4] transition-colors duration-200 rounded-lg pl-2 py-2"
                    >
                        <p className={`text-[14px] ${pathname.endsWith("/1") ? 'text-[#2A7D7B] font-semibold' : 'text-[#6B7280]'} hover:text-[#2A7D7B] transition-colors duration-200 capitalize`}>
                            {trimmedMonthName(monthIndex)} 15
                        </p>
                    </Link>
                    <Link
                        href={parsedPath + "/2"}
                        className="hover:bg-[#B6E8E4] transition-colors duration-200 rounded-lg pl-2 py-2"
                    >
                        <p className={`text-[14px] ${pathname.endsWith("/2") ? 'text-[#2A7D7B] font-semibold' : 'text-[#6B7280]'} hover:text-[#2A7D7B] transition-colors duration-200 capitalize`}>
                            {trimmedMonthName(monthIndex)} {getDaysInMonth(monthIndex, parseInt(pathname.split("/")[3]))}
                        </p>
                    </Link>
                </>
            )}
        </div>
    );
} 