import * as folderRepo from "../repositories/folder.repo.js";

export const createFolder = async ({ name, parent_id, owner_id }) =>{
    const folder = await folderRepo.createFolder({
        name,
        parent_id,
        owner_id
    });
    return folder;
};

export const getFolders = async (userId) =>{
    return await folderRepo.getUserFolders(userId);
};

export const getAllFolders = async (userId) =>{
    return await folderRepo.getAllUserFolders(userId);
};