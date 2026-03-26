import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getActivities } from "../controllers/activity.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getActivities);

export default router;