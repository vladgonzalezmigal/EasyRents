'use client';

import DisplayEmployees from "./DisplayEmployees";
import CreateEmployee from "./CreateEmployee";


export default function EmployeeSelection() {

    return (
        <div className="w-full space-y-6">
            <CreateEmployee />
            <DisplayEmployees />
        </div>
    );
}
