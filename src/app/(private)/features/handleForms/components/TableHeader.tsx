import React from 'react';

interface TableHeaderProps {
  headerTitles: string[];
}

const TableHeader: React.FC<TableHeaderProps> = ({ headerTitles }) => {
  return (
    <div className="px-4 bg-[#F5F5F5] z-30 border border-b-0 border-t-2 border-x-2 border-[#ECECEE] h-[60px] rounded-top header-shadow flex items-center relative z-10">
      <div className="flex flex-row justify-between bg-[#F5F5F5] w-full px-10">
        {headerTitles.map((title, index) => (
          <div key={index} className="w-[100px] pl-4">
            <p className="text-[16px] text-[#80848A]">{title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableHeader;
