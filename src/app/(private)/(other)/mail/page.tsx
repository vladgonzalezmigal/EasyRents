'use client'

import { useEffect, useState } from 'react';
import { generateSalesPdfs } from '../utils/generateUtils';
import LineBreak from '../../features/userSettings/components/LineBreak';
import MailIcon from '../../components/svgs/MailIcon';
import PlusIcon from '../../components/svgs/PlusIcon';
import MailSearch from '../components/mail/MailSearch';
import { useStore } from "@/store";
import { months } from '@/app/(private)/utils/dateUtils';
import SalesDocs from '../components/mail/displaydocs/SalesDocs';
import PDFDisplay from '../components/mail/displaydocs/PDFDisplay';
import { fetchHealth } from '../utils/mailUtils';
import { DocMetaData } from '../types/mailTypes';
import CompanySelect from '../features/mail/CompanySelect';

type Doc = {
 displayPdf: React.ReactNode;
 metadata: DocMetaData;
}


export default function MailPage() {
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
 const today = new Date();
 const { companyState, emailState } = useStore();
 const [currentMonth, setCurrentMonth] = useState(today.getMonth());
 const [currentYear, setCurrentYear] = useState(today.getFullYear());
 const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
 const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
 const [selectedPayrolls, setSelectedPayrolls] = useState<{ startDate: string; endDate: string }[]>([]);


 // generate document state
 const [generatedDocs, setGeneratedDocs] = useState<Doc[]>([]);


 const handleMonthChange = (month: number) => {
   setCurrentMonth(month);
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


 const handleSelectAll = () => {
   const activeStoreIds = companyState.data
     ?.filter(co => co.active)
     .map(co => co.id) || [];
   setSelectedCompanies(activeStoreIds);
 };


 const [companyError, setCompanyError] = useState<string | null>(null);


 const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME || "";


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


   try {
     // generate company rent documents
     if (selectedCompanies.length > 0) {
       // get raw data
       const { data: salesValidResults, error } = await generateSalesPdfs(selectedCompanies, companyState.data || [], currentYear, currentMonth);
       if (error || !salesValidResults) {
         setCompanyError(error || 'An error occurred while generating sales documents');
         return;
       }


       const salesDocs = salesValidResults.map(result => ({
         metadata: {
           subject: `${COMPANY_NAME} Sales for ${result.storeName}, ${months[currentMonth]} ${currentYear}`,
           sender: emailState.emails![0].sender_email,
           receiver: emailState.emails![0].recipient_email,
           bodyText: `Sales for ${result.storeName}, ${months[currentMonth]} ${currentYear}, sent by ${emailState.emails![0].sender_email}`,
           fileName: `Sales_${months[currentMonth]}_${currentYear}_${result.storeName.replace(/\s+/g, '_')}.pdf`
         },
         displayPdf: (
           <SalesDocs
             key={result.storeName}
             salesData={result.salesData}
             storeName={result.storeName}
             year={String(currentYear)}
             month={months[currentMonth]}
           />
         )
       }));


       docs = [...docs, ...salesDocs];
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
           onMonthChange={handleMonthChange}
           onYearChange={handleYearChange}
           currentMonth={currentMonth}
           currentYear={currentYear}
         />
         {/* Generate Documents Button */}
         <div className="flex justify-center">
           <button
             onClick={handleGenerateDocuments}
             className="cursor-pointer flex items-center gap-x-2 px-6 py-3 bg-[#DFF4F3] border-2 border-[#8ABBFD] rounded-lg hover:bg-[#C5E8E6] transition-colors duration-200"
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
         />
       </div>
       <LineBreak className="mb-6" />
     </div>
   </div>
 );
}
