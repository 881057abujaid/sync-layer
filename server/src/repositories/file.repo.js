import supabase from "../config/supabaseClient.js";

export const createFile = async (data) =>{
    const { data: file, error } = await supabase
    .from("files")
    .insert(data)
    .select()
    .maybeSingle();

    if(error) throw error;
    return file;
};

export const getUserFiles = async (userId, folderId = null, options = {}) =>{
    let query = supabase
    .from("files")
    .select("*")
    .eq("owner_id", userId)
    .eq("is_deleted", false);

    if (folderId) {
        query = query.eq("folder_id", folderId);
    } else {
        query = query.is("folder_id", null);
    }

    // Filter
    if(options.type){
        query = query.ilike("mime_type", `${options.type}%`);
    }

    // Sort
    if(options.sortBy){
        query = query.order(options.sortBy, { ascending: options.sortOrder === "asc" });
    }

    const { data, error } = await query;

    if(error) throw error;
    return data;
};

export const getFileById = async (id) =>{
    const { data, error } = await supabase
    .from("files")
    .select("*")
    .eq("id", id)
    .maybeSingle();

    if(error) throw error;
    return data;
};

export const findByName = async (userId, name, folderId) =>{
    let query = supabase
    .from("files")
    .select("*")
    .eq("owner_id", userId)
    .eq("name", name)
    .eq("is_deleted", false);


    if(folderId){
        query = query.eq("folder_id", folderId);
    } else {
        query = query.is("folder_id", null);
    }

    const { data, error } = await query.maybeSingle();

    if(error) throw error;
    return data;
};

export const moveFileToTrash = async (fileId) =>{
    const { data, error } = await supabase
    .from("files")
    .update({
        is_deleted: true,
        deleted_at: new Date()
    })
    .eq("id", fileId)
    .select()
    .maybeSingle();

    if(error) throw error;
    return data;
};

export const getTrashFiles = async (userId) =>{
    const { data, error } = await supabase
    .from("files")
    .select("*")
    .eq("owner_id", userId)
    .eq("is_deleted", true);

    if(error) throw error;
    return data;
};

export const restoreFileFromTrash = async (fileId) =>{
    const { data, error} = await supabase
    .from("files")
    .update({
        is_deleted: false,
        deleted_at: null
    })
    .eq("id", fileId)
    .select()
    .maybeSingle();

    if(error) throw error;
    return data;
};

export const deleteFileRecord = async (fileId) =>{
    const { data, error } = await supabase
    .from("files")
    .delete()
    .eq("id", fileId)
    .select()
    .maybeSingle();

    if(error) throw error;
    return data;
};

export const renameFile = async (fileId, newName) =>{
    const { data, error } = await supabase
    .from("files")
    .update({ name: newName })
    .eq("id", fileId)
    .select()
    .maybeSingle();

    if(error) throw error;
    return data;
};

export const moveFile = async (fileId, folderId) =>{
    const { data, error } = await supabase
    .from("files")
    .update({ folder_id: folderId })
    .eq("id", fileId)
    .select()
    .maybeSingle();

    if(error) throw error;
    return data;
}

export const deleteOldTrashFiles = async () =>{
    const { data, error } = await supabase
    .from("files")
    .delete()
    .eq("is_deleted", true)
    .lt("updated_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if(error) throw error;
    return data;
};

export const createFileVersion = async (data) =>{
    const { data: version, error } = await supabase
    .from("file_versions")
    .insert(data)
    .select()
    .maybeSingle();

    if(error) throw error;
    return version;
};

export const updateFile = async (fileId, data) =>{
    const { data: file, error } = await supabase
    .from("files")
    .update(data)
    .eq("id", fileId)
    .select()
    .maybeSingle();

    if(error) throw error;
    return file;
};