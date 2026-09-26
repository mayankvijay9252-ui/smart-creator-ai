import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import chatRoutes from "./routes/chat.js";
import imageRoutes from "./routes/image.js";
import videoRoutes from "./routes/video.js";
import businessRoutes from "./routes/business.js";
import contentRoutes from "./routes/content.js";
import codeRoutes from "./routes/code.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/api/chat", chatRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/business-ideas", businessRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/code", codeRoutes);

// 404 for unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ error: "not_found", message: `No API route for ${req.method} ${req.originalUrl}` });
});

app.listen(PORT, () => {
  console.log(`Smart Creator AI backend running on http://localhost:${PORT}`);
});
