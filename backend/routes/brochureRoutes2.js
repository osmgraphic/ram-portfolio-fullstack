import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

/* ==============================
   Safe Absolute Brochure Folder
============================== */
const brochureDir = path.join(process.cwd(), "brochure");

// Ensure folder exists (recursive for safety)
if (!fs.existsSync(brochureDir)) {
  fs.mkdirSync(brochureDir, { recursive: true });
}

/* ==============================
   Multer Storage Config
============================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, brochureDir);
  },
  filename: (req, file, cb) => {
    cb(null, "brochure.pdf"); // Always overwrite
  },
});

/* ==============================
   File Filter (PDF Only)
============================== */
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});

/* ==============================
   Upload / Replace Brochure
============================== */
router.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({
      success: true,
      message: "Brochure uploaded successfully",
    });
  } catch (error) {
    console.error("Brochure Upload Error:", error.message);
    res.status(500).json({ message: "Upload failed" });
  }
});

/* ==============================
   Download Brochure
============================== */
router.get("/download", (req, res) => {
  try {
    const filePath = path.join(brochureDir, "brochure.pdf");

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Brochure not found" });
    }

    res.download(filePath, "Resume.pdf");
  } catch (error) {
    console.error("Download Error:", error.message);
    res.status(500).json({ message: "Download failed" });
  }
});

export default router;