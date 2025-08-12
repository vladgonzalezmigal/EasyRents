'use client';

import CreateStore from "./СreateStore";
import DisplayStores from "./DisplayStores";

export default function StoreSelection() {

    return (
        <div className="w-full space-y-6">
            <CreateStore />
            <DisplayStores />
        </div>
    );
}
