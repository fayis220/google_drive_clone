const express = require("express");
const mongoose = require("mongoose");
const { supabase, upload } = require("../supabase");
const FileMetadata = require("../models/FileMetadata");

const fileUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { originalname, mimetype, buffer } = req.file;
    const userId = req.user?.id || new mongoose.Types.ObjectId(); // Replace with actual user ID

    // Upload file to Supabase Storage
    const filePath = `uploads/${Date.now()}-${originalname}`;
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(filePath, buffer, {
        contentType: mimetype,
      });

    if (error) throw error;

    // Get Public URL
    const { publicUrl } = supabase.storage
      .from("uploads")
      .getPublicUrl(filePath)?.data;
    // console.log("publicURL");
    // console.log(supabase.storage.from("uploads").getPublicUrl(filePath)?.data);
    // console.log(publicUrl);
    // console.log(userId);
    // console.log("publicURL");
    // Store Metadata in MongoDB
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

module.exports = { fileUpload };
