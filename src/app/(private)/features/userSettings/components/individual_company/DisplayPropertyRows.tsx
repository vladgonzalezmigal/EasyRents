import React from "react";
import { Property } from "../../types/propertyTypes";

interface DisplayPropertyRowsProps {
    properties: Property[];
}

const DisplayPropertyRows: React.FC<DisplayPropertyRowsProps> = ({ properties }) => {

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
                <tr key={property.id} className="hover:bg-gray-50 text-gray-700">
                    <td className="px-6 py-4 text-left font-medium ">
                        {property.address}
                    </td>
                    <td className="px-4 py-4 font-medium">
                        {property.tenant_name}
                    </td>
                    <td className="px-4 py-4  text-left font-medium">
                        {property.tenant_phone}
                    </td>
                    <td className="px-4 py-4  text-left font-medium">
                        {property.tenant_email}
                    </td>
                    <td className="px-4 py-4 text-left font-medium">
                        {property.rent_amount}
                    </td>
                    <td className="px-4 py-4 text-left font-medium">
                        {property.rent_due_date}
                    </td>
                </tr>
            ))}
        </>
    );
};

export default DisplayPropertyRows;
