import React, { useState } from 'react';
import SearchIcon from '@/app/(private)/components/svgs/SearchIcon';

interface LargeSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const LargeSearchBar: React.FC<LargeSearchBarProps> = ({ onSearch, placeholder }) => {
  const [input, setInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    onSearch(value); // Notify parent
  };

  return (
    <div className="relative w-[340px]">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder={placeholder || "Search address, tenant, etc..."}
        className="w-full pl-12 pr-4 py-3 h-[54px] bg-white rounded-xl text-[20px] font-medium text-[#2A7D7B] border border-[#8ABBFD] focus:outline-none focus:ring-2 focus:ring-[#2A7D7B] shadow-sm"
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <SearchIcon className="w-6 h-6 text-[#2A7D7B]" />
      </div>
    </div>
  );
};

export default LargeSearchBar;