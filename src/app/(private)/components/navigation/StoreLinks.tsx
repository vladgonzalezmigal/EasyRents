'use client';

import { usePathname } from "next/navigation";
import { useStore } from "@/store";
import { getActiveSubpage } from "../../utils/nav";
import { Store } from "../../features/userSettings/types/storeTypes";
import Link from "next/link";

export default function StoreLinks() {
  const { storeState } = useStore();
  const storeSubpages: Store[] | null = storeState.stores?.filter(store => store.active) || null;
  const pathname = usePathname();
  const pathParts = pathname.split('/');

  const activeSubpage = getActiveSubpage(storeSubpages?.map(store => store.id.toString()) || [], pathname);

  return (
    <div className="flex flex-col gap-y-2.5 pl-10 mt-1">
      {storeSubpages ? (
        storeSubpages.map((store, index) => {
          const newPath = [...pathParts];
          newPath[3] = store.id.toString();
          const storePath = newPath.join('/');
          
          return (
            <Link 
              key={index} 
              href={storePath}
              className="hover:bg-[#B6E8E4] transition-colors duration-200 rounded-lg pl-2 py-2"
            >
              <p className={`text-[14px] ${store.id.toString() === activeSubpage ? 'text-[#2A7D7B] font-semibold' : 'text-[#6B7280]'} hover:text-[#2A7D7B] transition-colors duration-200`}>
                {store.store_name}
              </p>
            </Link>
          );
        })
      ) : (
        <p className="text-[13px] text-[#6B7280]">Please refresh the page</p>
      )}
    </div>
  );
}
