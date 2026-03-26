import * as versionRepo from "../repositories/version.repo.js";
import * as fileRepo from "../repositories/file.repo.js";
import { generateSignedUrl, uploadFileToStorage } from "./storage.service.js";

export const uploadNewVersion = async (fileId, file, userId) =>{
    const latest = await versionRepo.getLatestVersion(fileId);
    const nextVersion = latest ? latest.version_number + 1 : 1;
    const path = `${userId}/${Date.now()}-${file.originalname}`;

    const storagePath = await uploadFileToStorage(file, path);
    const version = await versionRepo.createVersion({
        file_id: fileId,
        version_number: nextVersion,
        storage_path: storagePath,
        size_bytes: file.size,
        mime_type: file.mimetype,
        created_by: userId
    });

    return version;
};

export const getFileVersions = async (fileId) =>{
    return await versionRepo.getFileVersions(fileId);
};

export const restoreVersion = async (fileId, versionId, userId) =>{
    const version = await versionRepo.getVersionById(versionId);

    if(!version){
        throw new Error("Version not found");
    }

    if(version.file_id !== fileId){
        throw new Error("Version does not belong to this file");
    }

    const file = await fileRepo.getFileById(fileId);
    if(!file) throw new Error("File not found");

    if(file.owner_id !== userId) throw new Error("Unauthorized access");

    // Restore old version
    const updated = await fileRepo.updateFile(fileId, {
        storage_path: version.storage_path,
        size_bytes: version.size_bytes,
        mime_type: version.mime_type,
        version: version.version_number
    });
    return updated;
};

export const getVersionDownloadUrl = async (versionId) =>{
    const version = await versionRepo.getVersionById(versionId);

    if(!version) throw new Error("Version not found");

    const url = await generateSignedUrl(version.storage_path);
    return url;
};