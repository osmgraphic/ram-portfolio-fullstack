import fs from 'fs';
import path from 'path';

export default function deleteLocalFile(storedUrl) {
  try {
    if (!storedUrl) return;
    // storedUrl like "/uploads/abc.png" → map to actual disk path
    const normalized = storedUrl.startsWith('/') ? storedUrl.slice(1) : storedUrl; // remove leading slash
    const filePath = path.join(process.cwd(), normalized);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error('deleteLocalFile error:', err.message);
  }
}