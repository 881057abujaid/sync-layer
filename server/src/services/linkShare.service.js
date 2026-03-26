import crypto from "crypto";
import bcrypt from "bcrypt";
import * as linkRepo from "../repositories/linkShare.repo.js";
import * as fileRepo from "../repositories/file.repo.js";
import { generateSignedUrl } from "./storage.service.js";

export const createPublicLink = async ({
    resourceType,
    resourceId,
    password,
    expiresAt,
    createdBy
}) =>{
    const token = crypto.randomBytes(16).toString("hex");
    let passwordHash = null;

    if(password){
        passwordHash = await bcrypt.hash(password, 10);
    };

    return await linkRepo.createLinkShare({
        resource_type: resourceType,
        resource_id: resourceId,
        token,
        password_hash: passwordHash,
        expires_at: expiresAt,
        created_by: createdBy
    });
};

export const accessPublicLink = async (token, password) =>{
    const link = await linkRepo.findbyToken(token);

    if(!link) throw new Error("Invalid link");
    if(link.expires_at && new Date() > new Date(link.expires_at)){
        throw new Error("Link expired");
    }

    if(link.password_hash){
        if(!password) throw new Error("Password required");
        const valid = await bcrypt.compare(password, link.password_hash);
        if(!valid) throw new Error("Invalid password");
    }

    if(link.resource_type === "file"){
        const file = await fileRepo.getFileById(link.resource_id);
        if(!file) throw new Error("File not found");

        const signedUrl = await generateSignedUrl(file.storage_path);

        return {
            type: "file",
            name: file.name,
            downloadUrl: signedUrl
        };
    }
    throw new Error("Folder link not implemented yet");
};