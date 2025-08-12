'use client';
import DocSearchTitle from "@/app/(private)/features/handleForms/components/DocSearch/DocSearchTitle";
import DocumentSelection from "@/app/(private)/features/handleForms/components/DocSearch/DocumentSelection";
import { useStore } from "@/store";
import { useParams } from "next/navigation";
export default function SalesSelectionPage() {
  const { store_id } = useParams();
  const { storeState } = useStore();
  const { stores } = storeState;


  let store_name = stores?.find((store) => store.id === parseInt(store_id as string))?.store_name;
  if (!store_name) {
    store_name = "searching...";
  }
  const title : string = "Calendar For " + store_name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')

  return (
      <div className="w-full h-full  flex flex-col items-center justify-center ">
        <div className=" w-full  h-full flex flex-col items-center justify-center">
          <DocSearchTitle title={title}  />
        <DocumentSelection split={false} />
        </div>
      </div>
  )
}