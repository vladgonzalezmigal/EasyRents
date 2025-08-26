import React from 'react';
import ToggleMonthsBtn from './ToggleMonthsBtn';
import SearchBar from '../../userSettings/components/SearchBar';

interface TableTitleProps {
  title?: string;
  month?: string;
  year?: string;
}

const TableTitle: React.FC<TableTitleProps> = ({ title, month, year }) => {
  return (
    <div className="flex flex-row items-center justify-between w-[800px] mb-4 ">
      <SearchBar onSearch={()=>{}}  placeholder="Search..." />
      {month && year && (
        <ToggleMonthsBtn 
          currentMonth={parseInt(month) - 1}
          currentYear={parseInt(year)}
        />
      )}
    </div>
  );
};

export default TableTitle;
