import supabase from "../config/supabaseClient.js";

export const getLatestVersion = async (fileId) =>{
    const { data, error } = await supabase
    .from("file_versions")
    .select("*")
    .eq("file_id", fileId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

    if(error) throw error;
    return data;
};

export const createVersion = async (data) =>{
    const { data: version, error } = await supabase
    .from("file_versions")
    .insert(data)
    .select()
    .single();

    if(error) throw error;
    return version;
};

export const getFileVersions = async (fileId) =>{
    const { data, error } = await supabase
    .from("file_versions")
    .select("*")
    .eq("file_id", fileId)
    .order("version_number", { ascending: false });

    if(error) throw error;
    return data;
};

export const getVersionById = async (id) =>{
    const { data, error } = await supabase
    .from("file_versions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

    if(error) throw error;
    return data;
};