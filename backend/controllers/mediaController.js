import Media from "../models/Media.js";

export const uploadMedia = async (req, res) => {
  try {
    const { title, description, link } = req.body;

    let filePath = null;
    if (req.file) {
      filePath = `/uploads/${req.file.filename}`;
    }

    const media = new Media({
      title,
      description,
      fileUrl: filePath,
      externalLink: link || null,
    });

    await media.save();
    res.json({ success: true, media });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Upload failed" });
  }
};
