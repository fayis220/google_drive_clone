const express = require("express");
const mongoose = require("mongoose");
const { supabase, upload } = require("../supabase");
const FileMetadata = require("../models/FileMetadata");

const fileUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { originalname, mimetype, buffer } = req.file;
    const userId = req.user?.id || new mongoose.Types.ObjectId();

    const filePath = `uploads/${Date.now()}-${originalname}`;
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(filePath, buffer, {
        contentType: mimetype,
      });

    if (error) throw error;

    const { publicUrl } = supabase.storage
      .from("uploads")
      .getPublicUrl(filePath)?.data;

    const newFile = await FileMetadata.create({
      fileName: originalname,
      fileType: mimetype,
      fileUrl: publicUrl,
      uploadedBy: userId,
    });

    res
      .status(201)
      .json({ message: "File uploaded successfully", data: newFile });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.body;

    const file = await FileMetadata.findById(fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const fileUrl = file.fileUrl;
    const filePath = fileUrl.split("/").slice(8).join("/");

    const { error } = await supabase.storage.from("uploads").remove([filePath]);

    if (error) {
      console.error("Delete Error:", error);
      return res
        .status(500)
        .json({ error: "Failed to delete file from Supabase" });
    }

    await FileMetadata.findByIdAndDelete(fileId);

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const renameFile = async (req, res) => {
  try {
    const { fileId } = req.body;
    const { newFileName } = req.body;

    const file = await FileMetadata.findByIdAndUpdate(
      fileId,
      { fileName: newFileName },
      { new: true }
    );

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json({ message: "File renamed successfully in MongoDB", data: file });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const searchFiles = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const files = await FileMetadata.find({
      fileName: { $regex: query, $options: "i" },
    });

    if (files.length === 0) {
      return res.status(404).json({ message: "No matching files found" });
    }

    res.json({ message: "Files retrieved successfully", data: files });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { fileUpload, deleteFile, renameFile, searchFiles };
