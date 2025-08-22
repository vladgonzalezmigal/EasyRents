import { useState, useEffect, useMemo } from "react";
import { Company } from "../../types/CompanyTypes";
// import { filterByIncludes } from "../../../utils/searchUtils";
import SearchBar from "../SearchBar";
import CreateProperty from "./CreateProperty";
import { Property } from "../../types/propertyTypes";
import DisplayPropertyRows from "./DisplayPropertyRows";
import MinimizeIcon from "@/app/(private)/components/svgs/MinimizeIcon";
import MaximizeIcon from "@/app/(private)/components/svgs/MaximizeIcon";
import HouseIcon from "@/app/(private)/components/svgs/HouseIcon";
import TrashIcon from "@/app/(private)/components/svgs/TrashIcon";
import { useStore } from "@/store";
import EditIcon from "@/app/(private)/components/svgs/EditIcon";
import SaveIcon from "@/app/(private)/components/svgs/SaveIcon";
import PayrollIcon from "@/app/(private)/components/svgs/PayrollIcon";
import CreateTenantsPopUp from "./CreateTenantsPopUp";

interface CompanyTemplateProps {
    activeCompany: Company;
}

export default function CompanyTemplate(
    {
        activeCompany: activeCompany,
    }: CompanyTemplateProps
) {
    const { propertyState, deleteProperty, updateProperties, isCudLoadingProperties, tenantState } = useStore()
    const properties = useMemo(() => {
        const properties = propertyState.data?.get(activeCompany.id) || [];
        return [...properties].reverse(); // Create a copy and reverse it
    }, [propertyState.data, activeCompany.id]);

    // Create inverse map: property_id -> tenant names for searching
    const propertyTenantNames = useMemo(() => {
        const namesMap = new Map<number, string[]>();
        if (tenantState.data) {
            for (const [propertyId, tenants] of tenantState.data.entries()) {
                const names = tenants.map(tenant => 
                    `${tenant.first_name} ${tenant.last_name}`.toLowerCase()
                );
                namesMap.set(propertyId, names);
            }
        }
        return namesMap;
    }, [tenantState.data]);

    const [filteredProperites, setFilteredProperties] = useState<Property[]>([]);
    const [isMaximized, setIsMaximized] = useState<boolean>(true);
    const [searchByAddr, setsearchByAddr] = useState<boolean>(true);
    const [matchingPropertyIds, setMatchingPropertyIds] = useState<Set<number>>(new Set());

    // Update filtered properties whenever properties change
    useEffect(() => {
        setFilteredProperties(properties);
        setMatchingPropertyIds(new Set());
    }, [properties]);

    const handleSwapSearchMode = () => {
        setsearchByAddr((prev) => !prev);
        setFilteredProperties(properties); // Reset filtered properties when swapping search mode
        setMatchingPropertyIds(new Set());
    };

    const toggleMaximize = () => setIsMaximized(prev => !prev);

    const handleSearch = (query: string) => {
        if (!query.trim()) {
            setFilteredProperties(properties);
            setMatchingPropertyIds(new Set());
            return;
        }

        const queryLower = query.toLowerCase();
        const matchingIds = new Set<number>();
        
        const filtered = properties.filter(p => {
            let matches = false;
            
            if (searchByAddr) {
                // Search by address
                matches = p.address.toLowerCase().includes(queryLower);
            } else {
                // Search by tenant names
                const tenantNames = propertyTenantNames.get(p.id) || [];
                matches = tenantNames.some(name => name.includes(queryLower));
                
                // If tenant matches, add property to matching IDs for auto-expansion
                if (matches) {
                    matchingIds.add(p.id);
                }
            }
            
            return matches;
        });
        
        setFilteredProperties(filtered);
        setMatchingPropertyIds(matchingIds);
    };

    // Crud operations
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [createMode, setCreateMode] = useState<boolean>(false);
    const [rowsDelete, setRowsDelete] = useState<Set<number>>(new Set());
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

    // Edit buffer: property id -> new address
    const [editedAddresses, setEditedAddresses] = useState<Map<number, string>>(new Map());
    const handleAddressEdit = (propertyId: number, address: string) => {
        setEditedAddresses(prev => {
            const next = new Map(prev);
            next.set(propertyId, address);
            return next;
        });
    };

    const addToDelete = (id: number) => {
        if (rowsDelete.has(id)) {
            setRowsDelete((prevSet) => {
                const newSet = new Set(prevSet);
                newSet.delete(id);
                return newSet;
            });
        } else {
            setRowsDelete((prevSet) => new Set(prevSet).add(id));
        }
    };

    const handleDeleteClick = async () => {
        deleteProperty(Array.from(rowsDelete))
        setRowsDelete(new Set())
    };

    const handleEditToggleOrSave = async () => {
        if (deleteMode) { return }
        // If edits exist, save them
        if (editMode && editedAddresses.size > 0) {
            const payload = Array.from(editedAddresses.entries()).map(([id, address]) => ({
                id,
                company_id: activeCompany.id,
                address
            }));
            await updateProperties(payload);
            setEditedAddresses(new Map());
            setEditMode(false);
            return;
        }
        // Otherwise toggle edit mode
        setEditMode((prev) => !prev);
    };

    // Handle property row click for create mode
    const handlePropertyRowClick = (property: Property) => {
        if (createMode) {
            setSelectedProperty(property);
        }
    };

    const handleCloseCreatePopup = () => {
        setCreateMode(false);
        setSelectedProperty(null);
    };

    return (
        <section
            className="max-w-[900px]" id={activeCompany.company_name.replaceAll(" ", "")}
        >
            {/* Section Header */}
            <div className="flex items-center gap-4 bg-[#B6E8E4] border-2 border-[#B6E8E4] rounded-t-md py-4 w-[900px] pl-2">
                <div className="w-12 h-12 bg-[#DFF4F3] rounded-full flex items-center justify-center">
                    <HouseIcon className="text-[#2A7D7B] w-6 h-6" />
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
                                <div className="flex items-center justify-between border-b border-b-[#E4F0F6] py-4 relative px-8">
                                    {/* Edit, Delete, Create */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col items-center"> 
                                            <button
                                                disabled={isCudLoadingProperties || editMode}
                                                onClick={() => {
                                                    if (rowsDelete.size) {
                                                        handleDeleteClick();
                                                        setDeleteMode(false);
                                                    } else {
                                                        setEditMode(false);
                                                        setEditedAddresses(new Map());
                                                        setDeleteMode((prev) => !prev);
                                                    }
                                                }}
                                                className={`disabled:opacity-50 cursor-pointer disabled:cursor-default p-2 rounded-full transition-colors ${deleteMode
                                                    ? `text-red-700 hover:text-red-800 ${rowsDelete.size ? 'bg-red-100' : 'bg-red-50'}`
                                                    : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                                                    }`}
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                            <p className="text-xs">delete</p>
                                        </div>
                                        <div className="flex flex-col items-center"> 
                                            <button
                                                onClick={handleEditToggleOrSave}
                                                disabled={isCudLoadingProperties || deleteMode}
                                                className={`disabled:opacity-50 disabled:cursor-default cursor-pointer p-2 rounded-full transition-colors ${editMode
                                                    ? 'text-[#0C3C74] hover:text-[#2A7D7B] bg-blue-50'
                                                    : 'text-[#0C3C74] hover:text-[#2A7D7B] hover:bg-gray-100'
                                                    }`}
                                            >
                                                {(editMode && editedAddresses.size > 0) ? (
                                                    <SaveIcon className="w-5 h-5" />
                                                ) : (
                                                    <EditIcon className="w-5 h-5" />
                                                )}
                                            </button>
                                            <p className="text-xs pr-0.5">edit</p>
                                        </div>
                                        <div className="flex flex-col items-center"> 
                                            <button
                                                onClick={() => setCreateMode((prev) => !prev)}
                                                disabled={deleteMode || editMode}
                                                className={`disabled:opacity-50 disabled:cursor-default cursor-pointer p-2 rounded-full transition-colors text-[#2A7D7B] hover:text-[#0C3C74] hover:bg-[#DFF4F3]
                                                    ${createMode ? 'bg-[#DFF4F3]' : ''}`}
                                            >
                                                <PayrollIcon className="w-5 h-5" />
                                            </button>
                                            <p className="text-xs pr-0.5">create</p>
                                        </div>
                                    </div>
                                    {/* Search Bar and Swap Button */}
                                    <div className="flex items-center gap-2">
                                        <SearchBar onSearch={handleSearch} placeholder={searchByAddr ? 'El Agave Azul...' : 'Joaquin Rodri...'} />
                                        <button
                                            onClick={handleSwapSearchMode}
                                            className={`border-2 text-[#0C3C74] border-[#8ABBFD] h-[40px] w-[80px] bg-[#DFF4F3] rounded-3xl transition-colors duration-200 flex items-center justify-center gap-1 ${'cursor-pointer hover:bg-[#B6E8E4]'
                                                }`}
                                        >
                                            <span>{searchByAddr ? 'name' : 'address'}</span>
                                        </button>
                                    </div>
                                    {/* Maximize/Minimize Button */}
                                    <button
                                        onClick={toggleMaximize}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
                                            <th scope="col" className="w-[25px] min-w-[25px] max-w-[25px] mx-auto overflow-hidden px-6 py-3 text-left text-xs text-[#80848A] text-[16px] tracking-wider">
                                                {/* Space for the chevron */}
                                             </th>
                                            <th scope="col" className="w-[250px] min-w-[250px] max-w-[250px] mx-auto overflow-hidden px-6 py-3 text-left text-xs text-[#80848A] text-[16px] tracking-wider">
                                                Address
                                            </th>
                                            <th scope="col" className="w-[150px] min-w-[150px] max-w-[150px] mx-auto overflow-hidden px-6 py-3 text-left text-xs text-[#80848A] text-[16px] tracking-wider">
                                                Total Rent
                                            </th>
                                            <th scope="col" className="w-[100px] min-w-[100px] max-w-[100px] mx-auto overflow-hidden px-6 py-3 text-left text-xs text-[#80848A] text-[16px] tracking-wider">
                                                # of Tenants
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-[#E4F0F6] divide-y-[2px] border-b border-[#E4F0F6]">
                                        {properties.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="text-center text-gray-500 py-4">
                                                    No properties found
                                                </td>
                                            </tr>
                                        ) :
                                            <DisplayPropertyRows
                                                properties={filteredProperites}
                                                delete_mode={deleteMode}
                                                rowsToDelete={rowsDelete}
                                                addToDelete={addToDelete}
                                                edit_mode={editMode}
                                                editedAddresses={editedAddresses}
                                                onEditAddressChange={handleAddressEdit}
                                                matchingPropertyIds={matchingPropertyIds}
                                                onPropertyRowClick={handlePropertyRowClick}
                                            />
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/* Create Tenants PopUp */}
        {createMode && selectedProperty !== null && (
            <CreateTenantsPopUp
                property={selectedProperty}
                onClose={handleCloseCreatePopup}
            />
        )}
        </section>
    );
}