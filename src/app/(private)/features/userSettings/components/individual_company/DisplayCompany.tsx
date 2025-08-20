import { useState, useEffect, useMemo } from "react";
import { Company } from "../../types/CompanyTypes";
// import { filterByIncludes } from "../../../utils/searchUtils";
import SearchBar from "../SearchBar";
import CreateProperty from "./CreateProperty";
import { Property } from "../../types/propertyTypes";
import DisplayPropertyRows from "./DisplayPropertyRows";
import MinimizeIcon from "@/app/(private)/components/svgs/MinimizeIcon";
import MaximizeIcon from "@/app/(private)/components/svgs/MaximizeIcon";
import MailIcon from "@/app/(private)/components/svgs/MailIcon";
import { useStore } from "@/store";

interface CompanyTemplateProps {
    activeCompany: Company;
}

export default function CompanyTemplate(
    {
        activeCompany: activeCompany,
    }: CompanyTemplateProps
) {
    const { propertyState } = useStore()
    const properties = useMemo(() => {
        const properties = propertyState.data?.get(activeCompany.id) || [];
        return [...properties].reverse(); // Create a copy and reverse it
      }, [propertyState.data, activeCompany.id]);

    const [filteredProperites, setFilteredProperties] = useState<Property[]>([]);
    const [isMaximized, setIsMaximized] = useState<boolean>(true);
    const [searchByAddr, setsearchByAddr] = useState<boolean>(true);

    // Update filtered properties whenever properties change
    useEffect(() => {
        setFilteredProperties(properties);
    }, [properties]);

    const handleSwapSearchMode = () => {
        setsearchByAddr((prev) => !prev);
        setFilteredProperties(properties); // Reset filtered properties when swapping search mode
    };

    const toggleMaximize = () => setIsMaximized(prev => !prev);

    const handleSearch = (query: string) => {
        const filtered = properties.filter(p =>
            (searchByAddr ? p.address : p.tenant_name).toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProperties(filtered);
    };

    return (
        <section
            className="max-w-[900px] "
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
                    {/* Create Property */}
                    <CreateProperty company_id={activeCompany.id} />
                    <h3 className="text-xl text-left font-semibold text-[#404040] my-4">Properties</h3>
                    {/* Begin Table Container  */}
                    <div className="bg-white border border-[#E4F0F6] rounded-lg shadow-sm pb-4">
                        <div className="">
                            {/* Begin Table Container  */}
                            <div className={` ${isMaximized ? "min-h-[360px] overflow-y-auto" : " min-h-[360px] max-h-[360px]  overflow-y-auto "}`}>
                                {/* Begin Table Header */}
                                <div className="flex items-center justify-center border-b border-b-[#E4F0F6] py-4 relative">
                                    {/* Search Bar and Swap Button */}
                                    <div className="flex items-center gap-2">
                                        <SearchBar onSearch={handleSearch} placeholder={searchByAddr ? 'El Agave Azul...' : 'Joaquin Rodri...'} />
                                        <button
                                            onClick={handleSwapSearchMode}
                                            className={`border-2 text-[#0C3C74] border-[#8ABBFD] h-[40px] w-[80px] bg-[#DFF4F3] rounded-3xl transition-colors duration-200 flex items-center justify-center gap-1 ${
                                                'cursor-pointer hover:bg-[#B6E8E4]'
                                            }`}
                                        >
                                            <span>{searchByAddr ? 'name' : 'address'}</span>
                                        </button>
                                    </div>
                                    {/* Maximize/Minimize Button */}
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
                                            <th scope="col" className="w-[250px] min-w-[250px] max-w-[250px] mx-auto overflow-hidden px-6 py-3 text-left text-xs text-[#80848A] text-[16px] tracking-wider">
                                                Address
                                            </th>
                                            <th scope="col" className="w-[100px] min-w-[100px] max-w-[100px] px-4 py-3 text-left text-xs text-[#80848A] text-[16px] tracking-wider">
                                                Tenant Name
                                            </th>
                                            <th scope="col" className="w-[100px] min-w-[100px] max-w-[100px] px-4 py-3 text-left text-xs text-[#80848A] text-[16px] tracking-wider">
                                                Tenant Phone
                                            </th>
                                            <th scope="col" className="w-[100px] min-w-[100px] max-w-[100px] px-4 py-3 text-left text-xs text-[#80848A] text-[16px] tracking-wider">
                                                Tenant Email
                                            </th>
                                            <th scope="col" className="w-[100px] min-w-[100px] max-w-[100px] px-4 py-3 text-left text-xs text-[#80848A] text-[14px] tracking-wider">
                                                Rent Amount ($)
                                            </th>
                                            <th scope="col" className="w-[100px] min-w-[100px] max-w-[100px] px-4 py-3 text-left text-xs text-[#80848A] text-[14px] tracking-wider">
                                                Rent Due Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-[#E4F0F6] divide-y-[2px] border-b border-[#E4F0F6]">
                                        {properties.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="text-center text-gray-500 py-4">
                                                    No properties found
                                                </td>
                                            </tr>
                                        ) :
                                            <DisplayPropertyRows properties={filteredProperites} />
                                        }
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