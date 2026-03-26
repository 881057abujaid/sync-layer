import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import folderRoutes from "./routes/folder.routes.js";
import fileRoutes from "./routes/file.routes.js";
import shareRoutes from "./routes/share.routes.js";
import linkShareRoutes from "./routes/linkShare.routes.js";
import searchRoutes from "./routes/search.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import starRoutes from "./routes/star.routes.js";
import versionRoutes from "./routes/version.routes.js";
import storageRoutes from "./routes/storage.routes.js";
import { startCleanupJob } from "./jobs/cleanup.job.js";

const app = express();
startCleanupJob();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/shares", shareRoutes);
app.use("/api/link-share", linkShareRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/stars", starRoutes);
app.use("/api/versions", versionRoutes);
app.use("/api/storage", storageRoutes);

app.get("/", (req, res) => res.send("Sync Layer API is running"));

export default app;