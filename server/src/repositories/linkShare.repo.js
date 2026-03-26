import supabase from "../config/supabaseClient.js";

export const createLinkShare = async (data) =>{
    const { data: link, error } = await supabase
    .from("link_share")
    .insert(data)
    .select()
    .single();

    if(error) throw error;
    return link;
};

export const findbyToken = async (token) =>{
    const { data, error } = await supabase
    .from("link_share")
    .select()
    .eq("token", token)
    .single();

    if(error) throw error;
    return data;
};