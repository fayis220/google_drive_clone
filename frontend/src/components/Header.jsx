import React, { useState } from "react";

const Header = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="flex items-center  p-4 bg-[#F8FAFD] shadow">
      <div className="flex items-center space-x-2">
        <img
          src="https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png"
          alt="Drive Logo"
          className="w-12 h-12"
        />
        <h1 className="text-xl font-semibold">Drive</h1>
      </div>
      <div className="relative w-96">
        <input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
          // className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          className="border rounded-lg px-4 py-2 w-[41rem] bg-[#E9EEF6] outline-none ml-40"
        />
        {/* <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" /> */}
      </div>
    </div>
  );
};

export default Header;
