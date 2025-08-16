import { useState } from "react";
import { Company } from "../../types/CompanyTypes";
import SearchBar from "../SearchBar";
import MinimizeIcon from "@/app/(private)/components/svgs/MinimizeIcon";
import MaximizeIcon from "@/app/(private)/components/svgs/MaximizeIcon";
import MailIcon from "@/app/(private)/components/svgs/MailIcon";

interface CompanyTemplateProps {
    activeCompany: Company;
}

export default function CompanyTemplate(
    {
        activeCompany: activeCompany,
    }: CompanyTemplateProps
) {
    const [isMaximized, setIsMaximized] = useState<boolean>(true);
    const toggleMaximize = () => setIsMaximized(prev => !prev);

    return (
        <section
            className=" max-w-[900px] "
        >
            {/* Section Header */}
            <div className="flex items-center gap-4 bg-[#B6E8E4] border-2 border-[#B6E8E4] rounded-t-md py-4 w-[900px] pl-2">
                <div className="w-12 h-12 bg-[#DFF4F3] rounded-full flex items-center justify-center">
                    <MailIcon className="text-[#2A7D7B] w-6 h-6" />
                </div>
                <h2 className="text-2xl font-semibold text-[#4A4A4A]">{activeCompany.company_name}</h2>
            </div>
            {/* Company main content  */}
            <div className=" rounded-b-lg pt-8 pb-12 pl-4 bg-[#F2FBFA] shadow-sm">
                <div className="max-w-[850px] ">
                    <h3 className="text-xl text-left font-semibold text-[#404040] mb-4">Rents</h3>
                    {/* Begin Table Container  */}
                    <div className="bg-white border border-[#E4F0F6] rounded-lg shadow-sm pb-4">
                        <div className="">
                            {/* Begin Table Container  */}
                            <div className={` ${isMaximized ? "min-h-[360px] max-h-[360px] overflow-y-auto" : "  "}`}>
                                {/* Begin Table Header */}
                                <div className="flex items-center justify-center border-b border-b-[#E4F0F6] py-4 relative">
                                    {/* Search Bar */}
                                    <div>
                                        {/* <SearchBar onSearch={handleSearch} placeholder="JR REAL.." /> */}
                                    </div>
                                    <button
                                        onClick={toggleMaximize}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        {isMaximized ? (
                                            <MinimizeIcon className="w-5 h-5 text-[#80848A]" />
                                        ) : (
                                            <MaximizeIcon className="w-5 h-5 text-[#80848A]" />
                                        )}
                                    </button>
                                </div>
                                {/* Begin Table Data  */}
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className={`${isMaximized ? '' : 'sticky top-0'} z-10 text-[16px] bg-white after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[1.5px] after:bg-[#E4F0F6]`}>
                                        <tr>
                                            <th scope="col" className="w-[400px] min-w-[300px] max-w-[400px] mx-auto overflow-hidden px-6 py-3 text-left text-xs text-[#80848A] text-[16px] tracking-wider">
                                                Address
                                            </th>
                                            <th scope="col" className="w-[100px] min-w-[100px] max-w-[100px] px-10 py-3 text-left text-xs text-[#80848A] text-[16px] tracking-wider">
                                                Tenant Name
                                            </th>
                                            <th scope="col" className="w-[100px] min-w-[100px] max-w-[100px] px-10 py-3 text-left text-xs text-[#80848A] text-[16px] tracking-wider">
                                                Tenant Phone
                                            </th>
                                            <th scope="col" className="w-[100px] min-w-[100px] max-w-[100px] px-10 py-3 text-left text-xs text-[#80848A] text-[16px] tracking-wider">
                                                Tenant Email
                                            </th>
                                            <th scope="col" className="w-[100px] min-w-[100px] max-w-[100px] px-10 py-3 text-left text-xs text-[#80848A] text-[16px] tracking-wider">
                                                Rent Amount ($)
                                            </th>
                                            <th scope="col" className="w-[50px] min-w-[100px] max-w-[50px] px-10 py-3 text-left text-xs text-[#80848A] text-[16px] tracking-wider">
                                                Rent Due Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-[#E4F0F6] divide-y-[2px] border-b border-[#E4F0F6]">
                                        {/* <DisplayCompanyRows
                                        filteredStores={filteredStores}
                                        editingRows={editingRows}
                                        getStoreData={getStoreData}
                                        handleStoreNameChange={handleStoreNameChange}
                                        handleStatusToggle={handleStatusToggle}
                                        handleEditClick={handleEditClick}
                                        isValidName={isValidName}
                                    /> */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>



                </div>
            </div>
        </section>

    );
}