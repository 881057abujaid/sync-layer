import * as fileService from "../services/file.service.js";
import { validate as isValidUUID } from "uuid";

export const uploadFile = async (req, res) =>{
    try {
        const file = req.file;
        if(!file) {
            return res.status(400).json({
                error: "File is missing"
            });
        }

        const folderId = req.body.folder_id;
        if(folderId && !isValidUUID(folderId)){
            throw new Error("Invalid folder ID");
        }
        const safeFolderId = folderId && folderId !== "null" ? folderId : null;

        const savedFile = await fileService.uploadFile({
            file,
            userId: req.user.userId,
            folderId: safeFolderId,
            fileId: req.body.file_id
        });

        res.status(201).json({
            status: "success",
            message: "File uploaded successfully",
            data: savedFile
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message
        });
    }
};

export const getFiles = async (req, res) =>{
    try {
        const folderId = req.query.folder_id || null;

        const options = {
            type: req.query.type,
            sortBy: req.query.sortBy,
            order: req.query.order
        };
        
        const files = await fileService.getFiles(req.user.userId, folderId, options);
        const folders = await fileService.getFolders(req.user.userId, folderId);
        res.json({
            files,
            folders
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error.message
        });
    }
};

export const downloadFile = async (req,res) =>{
    try {
        const url = await fileService.getDownloadUrl(
            req.params.id,
            req.user.userId
        );

        res.json({
            status: "success",
            downloadUrl: url
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error.message || "Failed to get download URL"
        });
    }
};

export const moveFileToTrash = async (req, res) =>{
    try {
        const result = await fileService.moveFileToTrash(
            req.params.id,
            req.user.userId
        );

        res.json({
            status: "success",
            message: "File move to trash successfully",
            data: result
        })
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error.message
        });
    }
};

export const getTrashFiles = async (req, res) =>{
    try {
        const files = await fileService.getTrashFiles(req.user.userId);

        res.json({
            status: "success",
            data: files
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error.message
        });
    }
};

export const restoreFileFromTrash = async (req, res) =>{
    try {
        const file = await fileService.restoreFileFromTrash(
            req.params.id,
            req.user.userId
        );

        res.json({
            status: "success",
            message: "File restored",
            data: file
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error.message
        });
    }
};

export const permanentlyDeleteFile = async (req, res) =>{
    try {
        const result = await fileService.permanentlyDeleteFile(
            req.params.id,
            req.user.userId
        );

        res.json({
            status: "success",
            message: "File permanently deleted",
            data: result
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error.message
        });
    }
};

export const renameFile = async (req, res) =>{
    try {
        const file = await fileService.renameFile(
            req.params.id,
            req.user.userId,
            req.body.name
        );

        res.json({
            status: "success",
            data: file
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error.message
        });
    }
};

export const moveFile = async (req, res) =>{
    try {
        const file = await fileService.moveFile(
            req.params.id,
            req.user.userId,
            req.body.folder_id
        );

        res.json({
            status: "success",
            data: file
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error.message
        });
    }
};