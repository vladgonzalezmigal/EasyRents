"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createCompanySlice, CompanySlice } from "./companySlice";
import { StateCreator } from "zustand";
import { createEmailSlice, EmailSlice } from "./emailSlice";
import { createPropertySlice, PropertySlice } from "./propertySlice";
import { createTenantSlice, TenantSlice } from "./tenantSlice";
import { createGlobalLoadingSlice, GlobalLoadingSlice } from "./globalLoadingSlice";
import { createAccountSlice, AccountSlice } from "./accountSlice";

export type StoreState = CompanySlice & GlobalLoadingSlice & AccountSlice & PropertySlice & TenantSlice & EmailSlice;

// Wrap each slice-creator so that TypeScript knows they extend StoreState:
const createCompanySliceWithStore: StateCreator<StoreState, [], [], CompanySlice> = (set,) =>
    createCompanySlice(set, );

const createEmailSliceWithStore: StateCreator<StoreState, [], [], EmailSlice> = (set,) =>
    createEmailSlice(set, );

const createPropertySliceWithStore: StateCreator<StoreState, [], [], PropertySlice> = (set, get) =>
    createPropertySlice(set, get);

const createTenantSliceWithStore: StateCreator<StoreState, [], [], TenantSlice> = (set,) =>
    createTenantSlice(set, );

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
            ...createCompanySliceWithStore(set, get, store),
            ...createEmailSliceWithStore(set, get, store),
            ...createPropertySliceWithStore(set, get, store),
            ...createTenantSliceWithStore(set,get, store), 
            ...createGlobalLoadingSliceWithStore(set, get, store),
            ...createAccountSliceWithStore(set, get, store),
        }),
        {
            name: "app-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                stores: state.companyState.data,
                emails: state.emailState.emails,
                properties: state.propertyState,
                isGlobalLoading: state.isGlobalLoading,
                userEmail: state.userEmail,
            }),
        }
    )
);