import express from "express";
import multer from "multer";
import supabase from "../config/supabase.js";
import Media from "../models/mediaModel.js";
import deleteSupabaseFile from "../utils/deleteSupabaseFile.js";

const router = express.Router();

/* Multer Memory Storage */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

/* Upload Media */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { title, tags, type, isVideo } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    /* Auto Folder Mapping */
    const folderMap = {
      graphic: "graphics",
      video: "videos",
      logos: "logos",
      uidesign: "uidesign",
    };

    const folder = folderMap[type] || "others";

    const fileExt = req.file.originalname.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    const { error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(fileName);

    const mediaDoc = await Media.create({
      title,
      type,
      tags: tags ? tags.split(",").map(t => t.trim()) : [],
      url: data.publicUrl,
      isVideo: isVideo === "true" || isVideo === true,
    });

    res.status(201).json(mediaDoc);
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

/* External URL Upload */
router.post("/upload-url", async (req, res) => {
  try {
    const { title, url, tags, type, isVideo } = req.body;

    const mediaDoc = await Media.create({
      title,
      url,
      type,
      tags: tags ? tags.split(",").map(t => t.trim()) : [],
      isVideo: isVideo === "true" || isVideo === true,
    });

    res.status(201).json(mediaDoc);
  } catch (err) {
    res.status(500).json({ message: "Adding external media failed" });
  }
});

/* Get Media */
router.get("/", async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");
    const media = await Media.find().sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch media" });
  }
});

/* Delete Media */
router.delete("/:id", async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Not found" });

    await deleteSupabaseFile(media.url);
    await Media.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;