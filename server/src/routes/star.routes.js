import express from "express";
import { starResource, getStarredFiles, removeStar } from "../controllers/star.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, starResource);
router.get("/", authMiddleware, getStarredFiles);
router.delete("/:resource_type/:resource_id", authMiddleware, removeStar);

export default router;