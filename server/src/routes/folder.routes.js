import express from "express";

import { createFolder, getFolders, getAllFolders } from "../controllers/folder.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createFolder);
router.get("/", authMiddleware, getFolders);
router.get("/all", authMiddleware, getAllFolders);

export default router;