import multer from 'multer';
import fs from 'fs';
import path from 'path';


const uploadDir = path.join(process.cwd(), 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, unique + ext);
  }
});

const allowedExts = [
  '.jpeg', '.jpg', '.png', '.gif', '.webp',
  '.mp4', '.mov', '.avi', '.mkv', '.webm'
];

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExts.includes(ext)) return cb(null, true);
  cb(new Error('Unsupported file type: ' + ext));
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100 MB
});

export default upload;