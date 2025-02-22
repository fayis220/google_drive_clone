import React, { useRef, useState } from "react";
import axios from "axios";
import { FaHome, FaHdd, FaFolder, FaPlus } from "react-icons/fa";

const Sidebar = ({ fetchFiles }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await axios.post(
        "http://localhost:3002/api/file/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      fetchFiles();
      setUploadResult({ success: true, message: "Upload success!" });
    } catch (error) {
      setUploadResult({ success: false, message: "Upload failed!" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-64 p-4 bg-[#F8FAFD] shadow-md h-screen flex flex-col">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        // className="w-full h-[50px] py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all"
        className="w-[100px] h-[70px] py-2 bg-white text-black rounded-lg shadow-md mr-[140px]"
        onClick={() => fileInputRef.current.click()}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "+ NEW"}
      </button>

      <nav className="mt-6 space-y-3">
        <SidebarItem icon={<FaHome />} text="Home" />
        <SidebarItem icon={<FaFolder />} text="My Drive" />
        <SidebarItem icon={<FaHdd />} text="Computers" />
      </nav>
      {uploadResult && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-xl font-semibold mb-3">
              {uploadResult.success ? "Upload Successful" : "Upload Failed"}
            </h2>
            <p className="text-gray-600">
              {uploadResult.success
                ? "Your file has been uploaded successfully!"
                : uploadResult.message}
            </p>
            <button
              className="mt-4 px-6 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-all"
              onClick={() => setUploadResult(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SidebarItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition-all">
    <span className="text-gray-600">{icon}</span>
    <span className="text-gray-700 font-medium">{text}</span>
  </div>
);

export default Sidebar;
