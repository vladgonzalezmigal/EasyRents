import React from "react";
import { Property } from "../../types/propertyTypes";
import { useStore } from "@/store";

interface DisplayPropertyRowsProps {
    properties: Property[];
    delete_mode: boolean;
    rowsToDelete: Set<number>;
    addToDelete: (id: number) => void; 
}

const DisplayPropertyRows: React.FC<DisplayPropertyRowsProps> = ({ properties, delete_mode, rowsToDelete, addToDelete }) => {
    const { tenantState } = useStore()

    if (!properties || properties.length === 0) {
        return (
            <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-[18px] text-[#404040] font-semibold">
                    Nothing found for this search
                </td>
            </tr>
        );
    }

    return (
        <>
            {properties.map((property) => (
                <tr key={property.id} className={`text-gray-700 ${delete_mode ? `cursor-pointer ${rowsToDelete.has(property.id) ? 'bg-red-300' : ''}` : 'hover:bg-gray-50'}`}
                onClick={() => addToDelete(Number(property.id))}>
                    <td className="px-6 py-4 text-left font-medium ">
                        {property.address}
                    </td>
                     {/* Display # of properties */}
                    <td className="px-6 py-4 font-medium">
                        {tenantState.data?.get(property.id)?.length || 0}
                    </td>
                    
                </tr>
            ))}
        </>
    );
};

export default DisplayPropertyRows;
