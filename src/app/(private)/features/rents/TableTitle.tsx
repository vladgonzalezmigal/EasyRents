import React from 'react';
import ToggleMonthsBtn from './ToggleMonthsBtn';
import LargeSearchBar from './LargeSearchBar';

interface TableTitleProps {
  month?: string;
  year?: string;
  onSearch: (query: string) => void;

}

const TableTitle: React.FC<TableTitleProps> = ({ month, year, onSearch }) => {
  return (
    <div className="flex flex-row items-center justify-between w-[800px] mb-4 ">
       <div className='pt-1'> 
          <LargeSearchBar onSearch={onSearch} placeholder="Search..." />
      </div>
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
