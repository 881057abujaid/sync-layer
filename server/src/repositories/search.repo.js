import supabase from "../config/supabaseClient.js";

export const searchFiles = async (userId, query) =>{
    const { data, error } = await supabase
    .from("files")
    .select("*")
    .eq("owner_id", userId)
    .eq("is_deleted", false)
    .ilike("name", `%${query}%`)
    .order("created_at", { ascending: false })
    .limit(10);

    if(error) throw error;
    return data;
};

export const searchFolders = async (userId, query) =>{
    const { data, error } = await supabase
    .from("folders")
    .select("*")
    .eq("owner_id", userId)
    .eq("is_deleted", false)
    .ilike("name", `%${query}%`)
    .order("created_at", { ascending: false })
    .limit(10);

    if(error) throw error;
    return data;
};