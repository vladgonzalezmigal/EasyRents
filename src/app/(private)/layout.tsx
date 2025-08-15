"use client";

import React, { useEffect } from "react";
import { Loading } from "../components/Loading";
import { useStore } from "@/store";
import { usePathname } from "next/navigation";
import { fetchHealth} from "../(private)/(other)/utils/mailUtils"

interface LayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: LayoutProps) => {
  const { fetchCompany: fetchCompany, companyState: companyState, setGlobalLoading, 
   isGlobalLoading, isLoadingCompany: isLoadingStore, } = useStore();

  // (1) Health check effect
  useEffect(() => {
    const awakeBackend = async () => {
      try {
        await fetchHealth();
      } catch {
        console.log("error occured while checking health")
      }
    }
    awakeBackend();
  }, []);

   // (2) load user settings 
   const loadingSettings : boolean = isLoadingStore 
  //  || isLoadingVendors;

  // Settings fetch effect
  useEffect(() => {
    // assume user is authenticated due to server-side auth check (middleware)
    const fetchSettings = async () => {
      try {
        await Promise.all([
           fetchCompany(),
          //  fetchVendorData(),
          //  fetchEmail(),
          //  fetchCurrentEmployees()
        ]);
      } catch (e) {
        console.error("Error loading settings:", e);
      }
    };

    const missingSettings = (companyState.data === null);

    if (missingSettings) { // only fetch settings if user is authenticated and settings are missing
       fetchSettings();
    }
  }, [fetchCompany, companyState]);

  // (2) monitor path changes
  const pathname = usePathname();
  useEffect(() => {
    setGlobalLoading(false);
  }, [pathname, isGlobalLoading, setGlobalLoading]);

  return (loadingSettings || isGlobalLoading) ? (
    <div className="min-w-screen min-h-screen h-full w-full flex items-center justify-center"> 
      <Loading />
    </div>
  ) : (
    <div className="">
      {children}
    </div>
  );
};

export default ProtectedLayout;