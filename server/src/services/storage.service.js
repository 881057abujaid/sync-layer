import supabase, { supabaseAdmin } from "../config/supabaseClient.js";
import * as storageRepo from "../repositories/storage.repo.js";

export const uploadFileToStorage = async (file, path) => {
    const { data, error } = await supabaseAdmin.storage
        .from("files")
        .upload(path, file.buffer, {
            contentType: file.mimetype
        });

    if (error) throw error;
    return data.path;
};

export const uploadAvatarToStorage = async (file, userId) => {
    // Ensure bucket exists (Best effort, ignore if already exists or no permission)
    try {
        await supabaseAdmin.storage.createBucket("avatars", { public: true });
    } catch (e) {
        // Ignore error
    }

    const fileExt = file.originalname.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const path = `${fileName}`;

    const { data, error } = await supabaseAdmin.storage
        .from("avatars")
        .upload(path, file.buffer, {
            contentType: file.mimetype,
            upsert: true
        });

    if (error) {
        console.error("Supabase Storage Error (avatars):", error);
        throw error;
    }

    // Get public URL
    const { data: publicData } = supabaseAdmin.storage
        .from("avatars")
        .getPublicUrl(data.path);

    return publicData.publicUrl;
};

export const generateSignedUrl = async (path) =>{
    const { data, error } = await supabaseAdmin.storage
    .from("files")
    .createSignedUrl(path, 300); // 5 minutes expiry

    if(error) throw error;
    return data.signedUrl;
};

export const getStorageBreakdown = async (userId) => {
    return await storageRepo.getStorageBreakdown(userId);
};