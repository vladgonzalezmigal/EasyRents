'use client'

import { useEffect, useState } from 'react';
import { generateCompanyPdfs } from '../utils/generateUtils';
import LineBreak from '../../features/userSettings/components/LineBreak';
import MailIcon from '../../components/svgs/MailIcon';
import PlusIcon from '../../components/svgs/PlusIcon';
import MailSearch from '../components/mail/MailSearch';
import { useStore } from "@/store";
import { formatDate, getDaysInMonth, months } from '@/app/(private)/utils/dateUtils';
import PDFDisplay from '../components/mail/displaydocs/PDFDisplay';
import { fetchHealth } from '../utils/mailUtils';
import { DocMetaData } from '../types/mailTypes';
import CompanySelect from '../features/mail/CompanySelect';
import { Property, PropertyMap } from '../../features/userSettings/types/propertyTypes';
import { Company } from '../../features/userSettings/types/CompanyTypes';
import CompanyDoc from '../components/mail/displaydocs/CompanyDoc';

type Doc = {
  displayPdf: React.ReactNode;
  metadata: DocMetaData;
}

export default function MailPage() {
  // awake backend for email generation
  useEffect(() => {
    const awakeBackend = async () => {
      try {
        await fetchHealth();
      } catch {
        console.log("error occurred while checking health")
      }
    }
    awakeBackend();
  }, []);

  const today = new Date();
  const { companyState, emailState, propertyState } = useStore();
  const [currentStartMonth, setCurrentStartMonth] = useState(today.getMonth());
  const [currentEndMonth, setCurrentEndMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);

  // generate document state
  const [generatedDocs, setGeneratedDocs] = useState<Doc[]>([]);

  const handleStartMonthChange = (month: number) => {
    setCurrentStartMonth(month);
    // Clear generated docs when month changes
    setGeneratedDocs([]);
    setSelectedCompanies([]);
  };

  const handleEndMonthChange = (month: number) => {
    setCurrentEndMonth(month);
    // Clear generated docs when month changes
    setGeneratedDocs([]);
    setSelectedCompanies([]);
  };

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
    // Clear generated docs when year changes
    setGeneratedDocs([]);
    setSelectedCompanies([]);
  };

  const handleCompanySelect = (companyId: string) => {
    const storeIdInt = parseInt(companyId);
    setSelectedCompanies(prev => {
      if (prev.includes(storeIdInt)) {
        return prev.filter(id => id !== storeIdInt);
      } else {
        return [...prev, storeIdInt];
      }
    });
  };

  const activeCompanies: Company[] | null = companyState.data?.filter(company => company.active) || null;

  const handleSelectAll = () => {
    const activeStoreIds = companyState.data
      ?.filter(co => co.active)
      .map(co => co.id) || [];
    setSelectedCompanies(activeStoreIds);
  };

  // State to track selected properties per company
  const [selectedPropertiesByCompany, setSelectedPropertiesByCompany] = useState<Map<number, Map<number, boolean>>>(
    () => {
      const newMap = new Map<number, Map<number, boolean>>();
      if (activeCompanies && propertyState) {
        activeCompanies.forEach(company => {
          // Filter properties for this company
          const allProperties: Property[] = propertyState.data.get(Number(company.id))?.filter(p => p.company_id === company.id) || []
          const companyProperties = allProperties.map((property) => [property.id, true] as [number, boolean]);
          newMap.set(company.id, new Map(companyProperties));
        });
      }
      return newMap
    }
  );

  const [companyError, setCompanyError] = useState<string | null>(null);
  const [fetchLoading, setFetchLoading] = useState<boolean>(false)

  const handleGenerateDocuments = async () => {
    // set all errors to null
    let docs: Doc[] = [];

    setGeneratedDocs([]);
    setCompanyError(null);

    if (selectedCompanies.length === 0) {
      setCompanyError('Please select at least one company');
      return;
    } else if (emailState.emails?.[0]?.recipient_email == null || emailState.emails?.[0]?.sender_email == null) {
      setCompanyError('Please set the sender and recipient email in the email settings');
      return;
    }

    // check that we didn't select later month first
    if (currentStartMonth > currentEndMonth) {
      setCompanyError('Please pick the same or later month second');
      return;
    }


    try {
      // generate company rent documents
      if (selectedCompanies.length > 0) {
        // get raw data
        const filteredPropertyMap: PropertyMap = new Map()
        selectedPropertiesByCompany.forEach((prop_map, co_id) => {
          const active_props = [...prop_map.entries()]
            .filter(([, value]) => value === true)
            .map(([key]) => key);
        
          const companyProperties = propertyState.data
            .get(co_id)
            ?.filter(prop => active_props.includes(prop.id) && prop.active) || [];
        
          if (selectedCompanies.includes(co_id)) {
            filteredPropertyMap.set(co_id, companyProperties);
          }
        });
        console.log("fitlred map is", filteredPropertyMap)
        const startDate = formatDate("1", String(currentStartMonth + 1), String(currentYear))
        const endDate = formatDate(String(getDaysInMonth(Number(currentEndMonth), Number(currentYear))), String(currentEndMonth + 1), String(currentYear))
        const { data: companyValidResults, errors } = await generateCompanyPdfs(filteredPropertyMap, activeCompanies, startDate,
          endDate, setCompanyError, setFetchLoading)
        if (errors.length > 0 || !companyValidResults) {
          setCompanyError(errors.join() || 'An error occurred while generating company documents');
          return;
        }

        const companyDocs = companyValidResults.map(result => ({
          metadata: {
            subject: `Rental information for ${result.companyName}, ${months[currentStartMonth]} - ${months[currentEndMonth]} ${currentYear}`,
            sender: emailState.emails![0].sender_email,
            receiver: emailState.emails![0].recipient_email,
            bodyText: `Rental information for ${result.companyName}, ${months[currentStartMonth]} - ${months[currentEndMonth]} ${currentYear}, sent by ${emailState.emails![0].sender_email}`,
            fileName: `Rental_Income_From_${months[currentStartMonth]}_${months[currentEndMonth]}_${currentYear}_${result.companyName.replace(/\s+/g, '_')}.pdf`
          },
          displayPdf: (
            <CompanyDoc
              key={result.companyName}
              companyName={result.companyName}
              accountingData={result.accountingData}
              startDate={startDate}
              endDate={endDate}
            />
          )
        }));

        docs = [...docs, ...companyDocs]
      }

      setGeneratedDocs(docs);

    } catch (error) {
      setCompanyError('An error occurred while generating the PDF' + error);
    } finally {
      setSelectedCompanies([]);
    }
  };

  const handleClosePdfs = () => {
    setGeneratedDocs([]);
  };

  return (
    <div className="container px-16 py-8 min-h-screen h-full max-h-screen overflow-y-auto bg-[#FAFAFA] min-w-full">
      {/* Display generated PDFs */}
      {generatedDocs.length > 0 &&
        <PDFDisplay displayDocs={generatedDocs} receiver={emailState.emails?.[0]?.recipient_email || "NO_EMAIL_SET"} handleClosePdfs={handleClosePdfs} />
      }
      {/* Page Title  */}
      <div className="flex items-center h-[52px] w-full justify-begin mb-4">
        <MailIcon className="w-8 h-8 text-[#2F2F2F] mr-2" />
        <h1 className="text-[32px] font-bold text-[#2F2F2F] pl-2">Mail Documents</h1>
      </div>
      <LineBreak className="mb-6" />

      {/* Select Month, Year  */}
      <div className=" max-w-[1000px]">
        <div className="mb-8 flex justify-between pr-16  w-full">
          <MailSearch
            onStartMonthChange={handleStartMonthChange}
            onEndMonthChange={handleEndMonthChange}
            onYearChange={handleYearChange}
            currentMonth={currentStartMonth}
            currentEndMonth={currentEndMonth}
            currentYear={currentYear}
          />
          {/* Generate Documents Button */}
          <div className="flex justify-center">
            <button
              disabled={fetchLoading}
              onClick={handleGenerateDocuments}
              className="disabled:opacity-50 cursor-pointer flex items-center gap-x-2 px-6 py-3 bg-[#DFF4F3] border-2 border-[#8ABBFD] rounded-lg hover:bg-[#C5E8E6] transition-colors duration-200"
            >
              <PlusIcon className="text-[#8ABBFD] w-6 h-6" />
              <span className="text-[#8ABBFD] font-semibold">Generate Documents</span>
            </button>
          </div>
        </div>
        <LineBreak className="mb-6" />

        {/* Company Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-x-4 ">
              <div className="flex justify-between w-full">
                <h2 className="text-[20px] font-semibold text-[#2F2F2F]">Companies</h2>
                <button
                  onClick={handleSelectAll}
                  className="px-4  text-[14px] text-[#2A7D7B] font-semibold hover:text-[#48B4A0] transition-colors duration-200"
                >
                  Select All
                </button>
                {companyError && <span className="text-[#FF0000] text-sm">{companyError}</span>}
              </div>
            </div>
          </div>
          <CompanySelect
            selectedCompanies={selectedCompanies.map(String)}
            onCompanySelect={handleCompanySelect}
            selectedPropertiesByCompany={selectedPropertiesByCompany}
            setSelectedPropertiesByCompany={setSelectedPropertiesByCompany}
          />
        </div>
      </div>
    </div>
  );
}