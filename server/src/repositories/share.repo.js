import supabase from "../config/supabaseClient.js";

export const createShare = async (data) =>{
    const { data: share, error } = await supabase
    .from("shares")
    .insert(data)
    .select()
    .single();

    if(error) throw error;
    return share;
};

export const getSharedFiles = async (userId) =>{
    const { data: files, error } = await supabase
    .from("shares")
    .select(`id, role, resource_id, created_at, files(id, name, mime_type, size_bytes), owner:users!created_by(id, name, email)`)
    .eq("grantee_user_id", userId);

    if(error) throw error;
    return files;
};

export const checkAccess = async (fileId, userId) =>{
    const { data, error } = await supabase
    .from("shares")
    .select("id")
    .eq("resource_id", fileId)
    .eq("grantee_user_id", userId)
    .maybeSingle();

    if(error && error.code !== "PGRST116") throw error;
    return !!data;
};