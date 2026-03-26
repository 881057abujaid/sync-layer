import supabase from "../config/supabaseClient.js";

export const createFolder = async (data) =>{
    const { data: folder, error} = await supabase
    .from("folders")
    .insert(data)
    .select()
    .maybeSingle();

    if(error) throw error;
    return folder;
};

export const getUserFolders = async (userId, parentId = null) => {
    let query = supabase
        .from("folders")
        .select(`
            *,
            files:files(count),
            subfolders:folders(count)
        `)
        .eq("owner_id", userId);

    if (parentId) {
        query = query.eq("parent_id", parentId);
    } else {
        query = query.is("parent_id", null);
    }

    const { data, error } = await query;
    if (error) throw error;

    // item_count = files count + subfolders count
    return data.map(folder => ({
        ...folder,
        item_count: (folder.files?.[0]?.count || 0) +
                    (folder.subfolders?.[0]?.count || 0)
    }));
};

export const getAllUserFolders = async (userId) =>{
    const { data, error } = await supabase
    .from("folders")
    .select("*")
    .eq("owner_id", userId)
    .eq("is_deleted", false);

    if(error) throw error;
    return data;
};