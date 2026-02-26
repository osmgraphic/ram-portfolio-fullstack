import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema(
  {
    title: String,
    type: String,
    tags: [String],
    url: String,
    isVideo: Boolean,
  },
  { timestamps: true }
);

export default mongoose.model("Media", MediaSchema, "media");