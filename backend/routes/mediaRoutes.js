import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Media from "../models/mediaModel.js";

const router = express.Router();

/* =====================================================
   Base Upload Directory (Linux Safe - Render Ready)
===================================================== */
const baseUploadDir = path.join(process.cwd(), "uploads");

/* Ensure base folder exists */
if (!fs.existsSync(baseUploadDir)) {
  fs.mkdirSync(baseUploadDir, { recursive: true });
}

/* =====================================================
   Auto Folder Structure Based On Type
   graphics | videos | logos | uidesign
===================================================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.body.type || "others";
    const folderPath = path.join(baseUploadDir, type);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath);
  },

  filename: (req, file, cb) => {
    const unique =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, unique);
  },
});

/* =====================================================
   File Filter + Limits
===================================================== */
const allowedExts = [
  ".jpeg", ".jpg", ".png", ".gif", ".webp",
  ".mp4", ".mov", ".avi", ".mkv", ".webm"
];

const upload = multer({
  storage: multer.memoryStorage(), // 🔥 MEMORY NOT DISK
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext)) return cb(null, true);
    cb(new Error("Unsupported file type: " + ext));
  },
});

/* =====================================================
   Upload File
===================================================== */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { title, tags, type, isVideo } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const filePath = `${type}/${fileName}`;

    const { error } = await supabase.storage
      .from("media")
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const { data } = supabase.storage
      .from("media")
      .getPublicUrl(filePath);

    const mediaDoc = await Media.create({
      title,
      type,
      tags: tags ? tags.split(",") : [],
      url: data.publicUrl,   // 🔥 STORE FULL PUBLIC URL
      isVideo: isVideo === "true" || isVideo === true,
    });

    res.status(201).json(mediaDoc);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

/* =====================================================
   Upload External URL
===================================================== */
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

/* =====================================================
   Get All Media (No Cache)
===================================================== */
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

/* =====================================================
   Delete Media (DB + Local File)
===================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Not found" });

    if (media.url.includes("supabase")) {
      const parts = media.url.split("/media/");
      const filePath = parts[1];

      await supabase.storage.from("media").remove([filePath]);
    }

    await Media.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
