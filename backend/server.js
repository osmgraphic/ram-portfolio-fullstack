import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import brochureRoutes from "./routes/brochureRoutes2.js";

dotenv.config();
connectDB();

const app = express();

/* ====================== CORS ====================== */
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",")
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* ====================== MIDDLEWARE ====================== */
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads")); // ✅ ADD THIS

app.set("etag", false);

/* ====================== ROUTES ====================== */
app.use("/api/media", mediaRoutes);
app.use("/api/brochure", brochureRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Media API running with Supabase Storage");
});

/* ====================== ERROR HANDLER ====================== */
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);
  res.status(500).json({ message: err.message });
});

/* ====================== START SERVER ====================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
