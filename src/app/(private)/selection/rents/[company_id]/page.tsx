'use client';
import DocSearchTitle from "@/app/(private)/features/DocSearch/DocSearchTitle";
import DocumentSelection from "@/app/(private)/features/DocSearch/DocumentSelection";
import { useStore } from "@/store";
import { usePathname } from "next/navigation";

export default function RentDocumentCalendar() {
    const pathname = usePathname();
    const id = pathname.split('/')[3] 
    const { companyState } = useStore()
    const company_name = companyState.data?.find(company => company.id.toString() === id)?.company_name || "Company";

    const title: string = "Document Selection For " + company_name

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className=" w-full h-full flex flex-col items-center justify-center">
                <DocSearchTitle title={title} />
                <DocumentSelection split={false} />
            </div>
        </div>
    )
}