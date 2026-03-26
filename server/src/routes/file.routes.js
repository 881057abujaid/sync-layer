import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import upload from "../config/multer.js";
import { getFileVersions, uploadVersion, restoreVersion } from "../controllers/version.controller.js";
import { uploadFile, getFiles, downloadFile, moveFileToTrash, getTrashFiles, restoreFileFromTrash, permanentlyDeleteFile, renameFile, moveFile } from "../controllers/file.controller.js";

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("file"), uploadFile);
router.get("/", authMiddleware, getFiles);
router.get("/:id/download", authMiddleware, downloadFile);
router.delete("/:id", authMiddleware, moveFileToTrash);
router.get("/trash", authMiddleware, getTrashFiles);
router.post("/:id/restore", authMiddleware, restoreFileFromTrash);
router.delete("/:id/permanent", authMiddleware, permanentlyDeleteFile);
router.post("/:fileId/version", authMiddleware, uploadVersion);
router.get("/:fileId/versions", authMiddleware, getFileVersions);
router.post("/:fileId/restore/:versionId", authMiddleware, restoreVersion);
router.patch("/:id/rename", authMiddleware, renameFile);
router.patch("/:id/move", authMiddleware, moveFile);

export default router;