"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createStoreSlice, StoreSlice } from "./storeSlice";
import { StateCreator } from "zustand";
import { createVendorSlice, VendorSlice } from "./vendorSlice";
import { createEmailSlice, EmailSlice } from "./emailSlice";
import { createCurrentEmployeeSlice, CurrentEmployeeSlice } from "./currentEmployeeSlice";
import { createGlobalLoadingSlice, GlobalLoadingSlice } from "./globalLoadingSlice";
import { createAccountSlice, AccountSlice } from "./accountSlice";

export type StoreState = StoreSlice & VendorSlice & EmailSlice & CurrentEmployeeSlice & GlobalLoadingSlice & AccountSlice;

// Wrap each slice-creator so that TypeScript knows they extend StoreState:
const createStoreSliceWithStore: StateCreator<StoreState, [], [], StoreSlice> = (set,) =>
    createStoreSlice(set, );

const createVendorSliceWithStore: StateCreator<StoreState, [], [], VendorSlice> = (set,) =>
    createVendorSlice(set, );

const createEmailSliceWithStore: StateCreator<StoreState, [], [], EmailSlice> = (set,) =>
    createEmailSlice(set, );

const createCurrentEmployeeSliceWithStore: StateCreator<StoreState, [], [], CurrentEmployeeSlice> = (set,) =>
    createCurrentEmployeeSlice(set, );

const createGlobalLoadingSliceWithStore: StateCreator<StoreState, [], [], GlobalLoadingSlice> = (set,) =>
    createGlobalLoadingSlice(set, );

const createAccountSliceWithStore: StateCreator<StoreState, [], [], AccountSlice> = (set,) =>
    createAccountSlice(set, );

/**
 * The main Zustand store that combines all slices.
 * Uses the persist middleware to save specific parts of state to sessionStorage.
 * Each slice has access to the full store state via the get() function.
 */
export const useStore = create<StoreState>()(
    persist(
        (set, get, store) => ({
            ...createStoreSliceWithStore(set, get, store),
            ...createVendorSliceWithStore(set, get, store),
            ...createEmailSliceWithStore(set, get, store),
            ...createCurrentEmployeeSliceWithStore(set, get, store),
            ...createGlobalLoadingSliceWithStore(set, get, store),
            ...createAccountSliceWithStore(set, get, store),
        }),
        {
            name: "app-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                stores: state.storeState.stores,
                vendors: state.vendorState.vendors,
                emails: state.emailState.emails,
                currentEmployees: state.currentEmployeeState.currentEmployees,
                isGlobalLoading: state.isGlobalLoading,
                userEmail: state.userEmail,
            }),
        }
    )
);