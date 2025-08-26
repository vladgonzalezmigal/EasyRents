import React from 'react';
import ToggleMonthsBtn from './ToggleMonthsBtn';
import LargeSearchBar from '../../rents/LargeSearchBar';

interface TableTitleProps {
  title?: string;
  month?: string;
  year?: string;
}

const TableTitle: React.FC<TableTitleProps> = ({ title, month, year }) => {
  return (
    <div className="flex flex-row items-center justify-between w-[800px] mb-4 ">
      <div className='pt-4'> 
          <LargeSearchBar onSearch={()=>{}}  placeholder="Search..." />
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
