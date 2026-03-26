import * as folderService from "../services/folder.service.js";

export const createFolder = async (req, res) =>{
    try {
        const folder = await folderService.createFolder({
            name: req.body.name,
            parent_id: req.body.parent_id || null,
            owner_id: req.user.userId
        });
        res.status(201).json({
            status: "success",
            message: "Folder created successfully",
            data: folder
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error.message
        });
    }
};

export const getFolders = async (req, res) =>{
    try {
        const folders = await folderService.getFolders(req.user.userId);
        res.json(folders);
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error.message
        });
    }
};

export const getAllFolders = async (req, res) =>{
    try {
        const folders = await folderService.getAllFolders(req.user.userId);
        res.json(folders);
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error.message
        });
    }
};