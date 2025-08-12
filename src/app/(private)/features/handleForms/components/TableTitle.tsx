import React from 'react';
import ToggleMonthsBtn from './ToggleMonthsBtn';

interface TableTitleProps {
  title?: string;
  month?: string;
  year?: string;
  type: 'sales' | 'payroll' | 'expenses';
}

const TableTitle: React.FC<TableTitleProps> = ({ title, month, year, type }) => {
  return (
    <div className="flex flex-row items-center justify-between w-[800px] mb-4 ">
      {title && (
        <h1 className="text-[#393939] font-semibold text-3xl ">
          {title}
        </h1>
      )}
      {month && year && (
        <ToggleMonthsBtn 
          type={type}
          currentMonth={parseInt(month) - 1}
          currentYear={parseInt(year)}
        />
      )}
    </div>
  );
};

export default TableTitle;
