import express from "express";
import multer from "multer";
import supabase from "../config/supabase.js";
import Media from "../models/mediaModel.js";

const router = express.Router();

/* -------------------------------------------------
   Multer (Memory Storage)
------------------------------------------------- */
const upload = multer({
  storage: multer.memoryStorage(),
});

/* -------------------------------------------------
   Upload file (SAVE TO SUPABASE + SAVE MEDIA DOC)
------------------------------------------------- */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { title, tags, type, isVideo } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const fileName = `media/${Date.now()}-${req.file.originalname.replace(
      /\s+/g,
      "-"
    )}`;

    // Upload to Supabase
    const { error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) throw error;

    // Get public URL
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
    res.status(500).json({
      message: "Upload failed",
      error: err.message,
    });
  }
});

/* -------------------------------------------------
   Add external media (YouTube / URL)
------------------------------------------------- */
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
    console.error("EXTERNAL UPLOAD ERROR:", err);
    res.status(500).json({
      message: "Adding external media failed",
      error: err.message,
    });
  }
});

/* -------------------------------------------------
   Get all media
------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");

    const media = await Media.find().sort({ createdAt: -1 });

    res.json(media);
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch media" });
  }
});

/* -------------------------------------------------
   Delete media (DELETE FROM DB + SUPABASE)
------------------------------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const media = await Media.findById(id);
    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    // Extract file path from URL
    const filePath = media.url.split("/storage/v1/object/public/")[1];

    if (filePath) {
      await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .remove([filePath]);
    }

    await Media.findByIdAndDelete(id);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;