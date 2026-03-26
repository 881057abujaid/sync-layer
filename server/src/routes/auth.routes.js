import express from "express";
import { register, login, getCurrentUser, updateProfile, changePassword, deleteAccount } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.get("/me", authMiddleware, getCurrentUser);
router.put("/profile", authMiddleware, upload.single("avatar"), updateProfile);
router.put("/password", authMiddleware, changePassword);
router.delete("/account", authMiddleware, deleteAccount);

export default router;