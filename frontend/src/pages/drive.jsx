import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import FileItem from "../components/FileItem";
import { MoreVertical, Trash2, Edit, X } from "lucide-react";
import {
  FileText,
  FileImage,
  FileSpreadsheet,
  FileVideo,
  FileMusic,
  FileArchive,
  File,
} from "lucide-react";

const folders = [
  { type: "folder", name: "tech profile" },
  { type: "folder", name: "apps" },
  { type: "folder", name: "photos" },
];

const Drive = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);
  const [showRenamePopup, setShowRenamePopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFileName, setNewFileName] = useState("");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://localhost:3002/api/file/list");
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!selectedFile || !newFileName.trim()) return;

    try {
      await axios.patch(`http://localhost:3002/api/file/rename`, {
        newFileName,
        fileId: selectedFile._id,
      });
      setShowRenamePopup(false);
      setNewFileName("");
      fetchFiles();
    } catch (error) {
      console.error("Error renaming file:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedFile) return;

    try {
      await axios.delete(`http://localhost:3002/api/file/delete/`, {
        data: { fileId: selectedFile._id }, // Send req.body here
      });
      setShowDeletePopup(false);
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const getFilePreview = (file) => {
    if (file.fileType.startsWith("image/")) {
      return (
        <img
          src={file.fileUrl}
          alt={file.fileName}
          className="w-full h-32 object-cover rounded-md"
        />
      );
    } else if (file.fileType === "application/pdf") {
      return (
        <iframe
          src={file.fileUrl}
          className="w-full h-32 border rounded-md"
          title={file.fileName}
        />
      );
    } else if (file.fileType.startsWith("video/")) {
      return (
        <video controls className="w-full h-32 rounded-md">
          <source src={file.fileUrl} type={file.fileType} />
        </video>
      );
    } else if (file.fileType.startsWith("audio/")) {
      return (
        <audio controls className="w-full">
          <source src={file.fileUrl} type={file.fileType} />
        </audio>
      );
    } else if (
      file.fileType.includes("spreadsheet") ||
      file.fileType.includes("excel")
    ) {
      return <FileSpreadsheet className="w-16 h-16 text-green-500 mx-auto" />;
    } else if (
      file.fileType.includes("word") ||
      file.fileType.includes("ppt")
    ) {
      return <FileText className="w-16 h-16 text-blue-500 mx-auto" />;
    } else if (file.fileType.includes("zip")) {
      return <FileArchive className="w-16 h-16 text-yellow-500 mx-auto" />;
    } else {
      return <File className="w-16 h-16 text-gray-500 mx-auto" />;
    }
  };

  const handleSearch = async (query) => {
    // setSearchTerm(query);
    if (!query.trim()) {
      fetchFiles(); // Reload all files if search is cleared
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3002/api/file/search?query=${query}`
      );

      setFiles(response.data || []);
    } catch (error) {
      console.error("Error searching files:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header onSearch={handleSearch} />
      <div className="flex flex-grow">
        <Sidebar fetchFiles={fetchFiles} />
        <div className="p-6 flex-grow bg-[#FFFFFF]">
          <h2 className="text-2xl mb-10 text-left">Welcome to Drive</h2>

          {/* Folders Section */}
          {/* <h3 className="text-xl mb-10 text-left">Folders</h3>
          <div className="grid grid-cols-3 gap-4">
            {folders.map((folder, index) => (
              <FileItem key={index} type={folder.type} name={folder.name} />
            ))}
          </div> */}

          {/* Files Section */}
          <h3 className="mt-8 text-xl mb-10 text-left">Files</h3>
          {loading ? (
            <p className="text-center">Loading files...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {files?.data?.map((file) => (
                <div
                  key={file._id}
                  className="relative bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Three-dot menu */}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() =>
                        setMenuOpen(menuOpen === file._id ? null : file._id)
                      }
                      className="p-2 text-gray-600 hover:bg-gray-200 rounded-full"
                    >
                      <MoreVertical />
                    </button>
                    {menuOpen === file._id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white shadow-md rounded-lg py-2">
                        <button
                          className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
                          onClick={() => {
                            setSelectedFile(file);
                            setShowRenamePopup(true);
                            setMenuOpen(null);
                          }}
                        >
                          <Edit className="mr-2 w-4 h-4" />
                          Rename
                        </button>
                        <button
                          className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-red-500"
                          onClick={() => {
                            setSelectedFile(file);
                            setShowDeletePopup(true);
                            setMenuOpen(null);
                          }}
                        >
                          <Trash2 className="mr-2 w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="mt-2 mb-4 text-center font-normal text-gray-800 truncate">
                    {file.fileName}
                  </p>
                  {getFilePreview(file)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rename Popup */}
      {showRenamePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="mb-4">Rename File</h3>
            <input
              type="text"
              className="border p-2 w-full rounded"
              placeholder="New file name"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 rounded mr-2"
                onClick={() => setShowRenamePopup(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleRename}
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="mb-4">Are you sure you want to delete this file?</h3>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 rounded mr-2"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drive;
