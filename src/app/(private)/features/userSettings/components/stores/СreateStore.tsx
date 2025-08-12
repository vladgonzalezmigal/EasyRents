'use client';

import { useState } from 'react';
import CreateBtn from '../CreateBtn';
import { useStore } from '@/store';

export default function CreateStore() {
    const { storeState, createStore, isCudStoreLoading } = useStore();
    const [storeName, setStoreName] = useState('');
    const [validInput, setValidInput] = useState(true);
    const [hasEdited, setHasEdited] = useState(false);

    const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.toUpperCase();
        setStoreName(newValue);
        setHasEdited(true);

        const existingStores = storeState.stores?.map(s => s.store_name) || [];
        const isValid = newValue.trim() !== '' && !existingStores.includes(newValue);
        setValidInput(isValid);
    };

    const handleSubmit = () => {
        if (validInput && storeName.trim()) {
            createStore(storeName).then(() => {
                setStoreName('');
                setHasEdited(false);
            });
        }
    };

    return (
        <div>
            <h3 className="text-xl font-semibold text-[#404040]">Create Store</h3>
            <div className="h-[16px] text-center"> 
            {storeState.error && (
                 <p className="text-sm font-semibold text-red-500">  Something went wrong!</p>
            )}
             
            </div>
           
            <div className="bg-white border border-[#E4F0F6] rounded-lg shadow-sm px-4 py-6 max-w-[600px]">
                {/* Form Label */}
                <div className="flex mb-3">
                    <label htmlFor="storeName" className="text-[16px] text-[#80848A] font-semibold">Store Name</label>
                </div>
                {/* Form Inputs & Button */}
                <div className="flex gap-4 pb-4">
                    <div className="flex flex-col">
                        <input
                            type="text"
                            id="storeName"
                            value={storeName}
                            onChange={handleStoreNameChange}
                            className={`w-[240px] h-[40px] border border-2 rounded-md px-3 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B] ${
                                hasEdited && !validInput ? 'border-red-500' : 'border-[#8ABBFD]'
                            }`}
                            placeholder="LA 24"
                        />
                    </div>
                    <CreateBtn onSubmit={handleSubmit} disabled={hasEdited && !validInput || isCudStoreLoading} />
                </div>
            </div>
        </div>
    );
}
