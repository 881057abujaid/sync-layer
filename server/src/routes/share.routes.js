import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getSharedFiles, shareResource } from "../controllers/share.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getSharedFiles);
router.post("/", authMiddleware, shareResource);

export default router;