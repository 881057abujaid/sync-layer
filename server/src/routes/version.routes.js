import express from "express";
import { downloadVersion } from "../controllers/version.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:id/download", authMiddleware, downloadVersion);

export default router;
