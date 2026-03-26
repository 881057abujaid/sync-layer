import express from "express";
import { getStorageBreakdown } from "../controllers/storage.controller.js";
import { getStorageUsage } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/breakdown", authMiddleware, getStorageBreakdown);
router.get("/usage", authMiddleware, getStorageUsage);

export default router;