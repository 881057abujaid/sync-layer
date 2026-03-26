import supabase from "../config/supabaseClient.js";

export const addStar = async (data) =>{
    const { data:star, error } = await supabase
    .from("stars")
    .insert(data)
    .select()
    .maybeSingle();

    if(error) throw error;
    return star;
};

export const removeStar = async ({ userId, resourceType, resourceId }) =>{
    const { error } = await supabase
    .from("stars")
    .delete()
    .eq("user_id", userId)
    .eq("resource_type", resourceType)
    .eq("resource_id", resourceId)
    .select();

    if(error) throw error;
    return true;
};

export const getStarredFiles = async (userId) =>{
    const { data, error } = await supabase
    .from("stars")
    .select(`resource_id, files(id, name, size_bytes, mime_type, created_at, updated_at)`)
    .eq("user_id", userId);

    if(error) throw error;
    return data;
};