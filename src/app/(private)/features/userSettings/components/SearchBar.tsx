import React, { useState } from 'react';
import SearchIcon from '@/app/(private)/components/svgs/SearchIcon';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder }) => {
  const [input, setInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    onSearch(value); // Notify parent
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder={placeholder || "Jetro..."}
        className="w-[148px] pl-8 pr-3 py-2 h-[36px] bg-[#F6F6F6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4F0F6]"
      />
      <div className="absolute left-2 top-1/2 -translate-y-1/2">
        <SearchIcon className="w-5 h-5 text-[#747576]" />
      </div>
    </div>
  );
};

export default SearchBar;