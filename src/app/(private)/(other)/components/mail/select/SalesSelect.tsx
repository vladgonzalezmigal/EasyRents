'use client';

import { useStore } from "@/store";
import { Store } from "../../../../features/userSettings/types/storeTypes";

interface SalesSelectProps {
    selectedStores: string[];
    onStoreSelect: (storeId: string) => void;
}

export default function SalesSelect({ selectedStores, onStoreSelect }: SalesSelectProps) {
    const { storeState } = useStore();
    const storeSubpages: Store[] | null = storeState.stores?.filter(store => store.active) || null;

    return (
        <div className="flex flex-wrap gap-4 ">
            {storeSubpages ? (
                storeSubpages.map((store, index) => (
                    <div
                        key={index}
                        onClick={() => onStoreSelect(store.id.toString())}
                        className={`p-4 border rounded-2xl shadow-md cursor-pointer w-[270px] flex items-center justify-center ${
                            selectedStores.includes(store.id.toString())
                                ? 'bg-[#F2FBFA] border-[#DFDFDF]'
                                : 'bg-white border-[#DFDFDF]'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={selectedStores.includes(store.id.toString())}
                                onChange={() => {}}
                                className="w-4 h-4 rounded border-[#8ABBFD] text-[#8ABBFD] focus:ring-[#8ABBFD]"
                            />
                            <p className={`text-sm ${
                                selectedStores.includes(store.id.toString())
                                    ? 'text-[#2A7D7B] font-bold'
                                    : 'text-gray-500 font-semibold'
                            }`}>
                                {store.store_name}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-[13px] text-[#6B7280]">Please refresh the page</p>
            )}
        </div>
    );
}
