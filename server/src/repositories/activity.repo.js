import supabase from "../config/supabaseClient.js";

export const createActivity = async (data) => {
    const { data: activity, error } = await supabase
    .from("activities")
    .insert(data)
    .select()
    .maybeSingle();

    if(error) throw error;

    return activity;
};

export const getActivities = async (userId) =>{
    const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("actor_id", userId)
    .order("created_at", { ascending: false });

    if(error) throw error;
    return data;
};