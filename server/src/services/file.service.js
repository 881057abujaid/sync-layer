import * as fileRepo from "../repositories/file.repo.js";
import * as userRepo from "../repositories/user.repo.js";
import * as folderRepo from "../repositories/folder.repo.js";
import * as versionRepo from "../repositories/version.repo.js";
import { logActivity } from "./activity.service.js";
import { uploadFileToStorage, generateSignedUrl } from "./storage.service.js";
import { checkAccess } from "../repositories/share.repo.js";

export const uploadFile = async ({ file, userId, folderId }) =>{
    const existing = await fileRepo.findByName(userId, file.originalname, folderId);

    if(existing){
        // Get next version Number
        const nextVersion = (existing.version || 1)

        // Save current file as a version
        await versionRepo.createVersion({
            file_id: existing.id,
            version_number: nextVersion,
            size_bytes: existing.size_bytes,
            mime_type: existing.mime_type,
            storage_path: existing.storage_path,
            created_by: userId
        });

        // Upload new file to storage
        const path = `${userId}/${Date.now()}-${file.originalname}`;
        const newPath = await uploadFileToStorage(file, path);

        const updated = await fileRepo.updateFile(existing.id, {
            storage_path: newPath,
            size_bytes: file.size,
            mime_type: file.mimetype,
            version: nextVersion + 1
        });

        const diff = file.size - existing.size_bytes;
        if(diff > 0){
            await userRepo.increaseStorageUsage(userId, diff);
        }else{
            await userRepo.decreaseStorageUsage(userId, Math.abs(diff));
        }

        await logActivity({
            actorId: userId,
            action: "upload",
            resourceType: "file",
            resourceId: existing.id,
            context: { name: existing.name }
        });
        return updated;
    };

    const storage = await userRepo.getUserStorage(userId);
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

    if(storage.storage_used + file.size > storage.storage_limit || file.size > MAX_FILE_SIZE){
        throw new Error("Storage limit exceeded or File size exceeds 50MB");
    }

    const path = `${userId}/${Date.now()}-${file.originalname}`;
    const storagePath = await uploadFileToStorage(file, path);

    const savedFile = await fileRepo.createFile({
        name: file.originalname,
        size_bytes: file.size,
        mime_type: file.mimetype,
        storage_path: storagePath,
        owner_id: userId,
        folder_id: folderId
    });

    await userRepo.increaseStorageUsage(userId, file.size);
    await logActivity({
        actorId: userId,
        action: "upload",
        resourceType: "file",
        resourceId: savedFile.id,
        context: { name: savedFile.name }
    });
    return savedFile;
};

export const getFiles = async (userId, folderId, options) =>{
    return await fileRepo.getUserFiles(userId, folderId, options);
};

export const getFolders = async (userId, parentId) =>{
    return await folderRepo.getUserFolders(userId, parentId);
};

export const getDownloadUrl = async (fileId, userId) =>{
    const file = await fileRepo.getFileById(fileId);

    if(!file) throw new Error("File not found");
    const hasAccess = await checkAccess(fileId, userId);
    if(file.owner_id !== userId && !hasAccess) throw new Error("Unauthorized access");

    const signedUrl = await generateSignedUrl(file.storage_path);
    await logActivity({
        actorId: userId,
        action: "download",
        resourceType: "file",
        resourceId: fileId,
        context: { name: file.name }
    });
    return signedUrl;
};

export const moveFileToTrash = async (fileId, userId) =>{
    const file = await fileRepo.getFileById(fileId);

    if(!file) throw new Error("File not found");
    if(file.owner_id !== userId) throw new Error("Unauthorized access");

    const trashsedFile = await fileRepo.moveFileToTrash(fileId);
    await logActivity({
        actorId: userId,
        action: "delete",
        resourceType: "file",
        resourceId: fileId,
        context: { name: file.name }
    });
    return trashsedFile;
};

export const getTrashFiles = async (userId) =>{
    return await fileRepo.getTrashFiles(userId);
};

export const restoreFileFromTrash = async (fileId, userId) =>{
    const file = await fileRepo.getFileById(fileId);

    if(!file) throw new Error("File not found");
    if(file.owner_id !== userId) throw new Error("Unauthorized access");

    const restoreFile = await fileRepo.restoreFileFromTrash(fileId);
    await logActivity({
        actorId: userId,
        action: "restore",
        resourceType: "file",
        resourceId: fileId,
        context: { name: file.name }
    });
    return restoreFile;
};

export const permanentlyDeleteFile = async (fileId, userId) =>{
    const file = await fileRepo.getFileById(fileId);

    if(!file) throw new Error("File not found");
    if(file.owner_id !== userId) throw new Error("Unauthorized access");

    const deleteFile = await fileRepo.deleteFileRecord(fileId);
    await userRepo.decreaseStorageUsage(userId, file.size_bytes);
    await logActivity({
        actorId: userId,
        action: "delete",
        resourceType: "file",
        resourceId: fileId,
        context: { name: file.name }
    });
    return deleteFile;
};

export const renameFile = async (fileId, userId, newName) =>{
    const file = await fileRepo.getFileById(fileId);

    if(!file) throw new Error("File not found");
    if(file.owner_id !== userId) throw new Error("Unauthorized access");

    const updatedFile = await fileRepo.renameFile(fileId, newName);
    await logActivity({
        actorId: userId,
        action: "rename",
        resourceType: "file",
        resourceId: fileId,
        context: {
            old_name: file.name,
            new_name: newName
        }
    });
    return updatedFile;
};

export const moveFile = async (fileId, userId, folderId) =>{
    const file = await fileRepo.getFileById(fileId);

    if(!file) throw new Error("File not found");
    if(file.owner_id !== userId) throw new Error("Unauthorized access");

    const updateFile = await fileRepo.moveFile(fileId, folderId);

    await logActivity({
        actorId: userId,
        action: "move",
        resourceType: "file",
        resourceId: fileId,
        context: {
            name: file.name,
            to_folder: folderId
        }
    });
    return updateFile;
};

export const cleanupTrash = async () =>{
    const deletedFiles = await fileRepo.deleteOldTrashFiles();
    console.log("Trash Cleaned:", deletedFiles?.length);
};