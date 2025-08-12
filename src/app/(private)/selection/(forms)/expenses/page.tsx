'use client';
import DocSearchTitle from "@/app/(private)/features/handleForms/components/DocSearch/DocSearchTitle";
import DocumentSelection from "@/app/(private)/features/handleForms/components/DocSearch/DocumentSelection";
export default function ExpenseSelectionPage() {

  const title : string = "Calendar For Expenses"

  return (
    <div className="w-full h-full  flex flex-col items-center justify-center ">
    <div className=" w-full  h-full flex flex-col items-center justify-center">
      <DocSearchTitle title={title}  />
    <DocumentSelection split={false} />
    </div>
  </div>
  )
}