import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createPunlicLink, accessPublicLink } from "../controllers/linkShare.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createPunlicLink);
router.get("/s/:token", accessPublicLink);

export default router;