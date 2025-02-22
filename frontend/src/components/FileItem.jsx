import React from "react";
import { FaFolder, FaFile } from "react-icons/fa";

const FileItem = ({ type, name }) => {
  return (
    <div className="flex items-center space-x-2 p-4 bg-[#F8FAFD] shadow-md rounded-lg">
      {type === "folder" ? (
        <FaFolder className="text-yellow-500 text-xl" />
      ) : (
        <FaFile className="text-gray-500 text-xl" />
      )}
      <span className="text-lg">{name}</span>
    </div>
  );
};

export default FileItem;
