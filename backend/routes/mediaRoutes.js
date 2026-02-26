import express from "express";
import multer from "multer";
import Media from "../models/mediaModel.js";
import supabase from "../config/supabase.js";

const router = express.Router();

// 🔥 Use memory storage (NOT disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { title, tags, type, isVideo } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const filePath = `${type}/${fileName}`;

    // Upload to Supabase
    const { error } = await supabase.storage
      .from("media")
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return res.status(500).json({ message: error.message });
    }

    const { data } = supabase.storage
      .from("media")
      .getPublicUrl(filePath);

    const mediaDoc = await Media.create({
      title,
      type,
      tags: tags ? tags.split(",") : [],
      url: data.publicUrl,
      isVideo: isVideo === "true" || isVideo === true,
    });

    res.status(201).json(mediaDoc);

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

router.get("/", async (req, res) => {
  const media = await Media.find().sort({ createdAt: -1 });
  res.json(media);
});

router.delete("/:id", async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Not found" });

    if (media.url.includes("supabase")) {
      const filePath = media.url.split("/media/")[1];
      await supabase.storage.from("media").remove([filePath]);
    }

    await Media.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
