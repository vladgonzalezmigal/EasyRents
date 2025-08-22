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
  const { fetchCompany: fetchCompany, companyState: companyState, fetchProperties : fetchProperties,  propertyState: propertyState, tenantState : tenantState,
    fetchTenants: fetchTenants, setGlobalLoading, fetchEmail, isLoadingEmail, emailState,
   isGlobalLoading, isLoadingCompany: isLoadingStore, isLoadingProperties, isLoadingTenants } = useStore();

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
   const loadingSettings : boolean = isLoadingStore || isLoadingProperties || isLoadingTenants || isLoadingEmail


  // Settings fetch effect
  useEffect(() => {
    // assume user is authenticated due to server-side auth check (middleware)
    const fetchSettings = async () => {
      try {
        await fetchCompany(); // companies need to be fetched first to map properties
        await fetchProperties();
        await Promise.all([
          fetchTenants(),
          fetchEmail()
        ]);
      } catch (e) {
        console.error("Error loading settings:", e);
      }
    };

    const missingSettings = (companyState.data === null || propertyState.data === null || tenantState.data === null) 
    || (emailState.emails === null);

    if (missingSettings) { // only fetch settings if user is authenticated and settings are missing
       fetchSettings();
    }
  }, [fetchCompany, companyState, fetchProperties, propertyState, fetchTenants, tenantState, fetchEmail, emailState]);
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