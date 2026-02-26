import supabase from "../config/supabase.js";

export default async function deleteSupabaseFile(fileUrl) {
  try {
    if (!fileUrl) return;

    const parts = fileUrl.split("/storage/v1/object/public/");
    if (parts.length < 2) return;

    const pathWithBucket = parts[1]; // bucket/folder/file
    const [bucket, ...fileParts] = pathWithBucket.split("/");
    const filePath = fileParts.join("/");

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error("Supabase delete error:", error.message);
    }
  } catch (err) {
    console.error("Delete file error:", err.message);
  }
}