import supabase, { supabaseAdmin } from "../config/supabaseClient.js";
import bcrypt from "bcrypt";

export const createUser = async (data) =>{
    const { data: user, error } = await supabase
    .from("users")
    .insert(data)
    .select()
    .maybeSingle();

    if(error) throw error;
    return user;
};

export const findUserByEmail = async (email) =>{
    const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

    if(error) throw error;
    return data;
};

export const findUserById = async (id) =>{
    const { data, error } = await supabase
    .from("users")
    .select("id, email, name, image_url, created_at")
    .eq("id", id)
    .maybeSingle();

    if(error) throw error;
    return data;
};

export const getUserStorage = async (userId) =>{
    const { data, error } = await supabase
    .from("users")
    .select("storage_limit, storage_used")
    .eq("id", userId)
    .maybeSingle();

    if(error) throw error;
    return data;
};

export const increaseStorageUsage = async (userId, size) =>{
    const { data, error } = await supabase
    .rpc("increment_storage_used", {
        p_user_id: userId,
        p_file_size: size
    });

    if(error) throw error;
    return data;
};

export const decreaseStorageUsage = async (userId, size) =>{
    const { data, error } = await supabase
    .rpc("decrement_storage_used", {
        p_user_id: userId,
        p_file_size: size
    });

    if(error) throw error;
    return data;
};

export const updateUserProfile = async (userId, { name, email, image_url }) =>{
    const { data, error } = await supabase
    .from("users")
    .update({ name, email, image_url })
    .eq("id", userId)
    .select()
    .maybeSingle();

    if(error) throw error;
    return data;
};

export const updatePassword = async (userId, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const { error } = await supabase
    .from("users")
    .update({ password_hash: hashedPassword })
    .eq("id", userId);

    if (error) throw error;
    return true;
};

export const verifyCurrentPassword = async (userId, currentPassword) => {
    const { data, error } = await supabase
    .from("users")
    .select("password_hash")
    .eq("id", userId)
    .maybeSingle();

    if(error || !data) throw new Error("User not found");

    const valid = await bcrypt.compare(currentPassword, data.password_hash);

    if(!valid) throw new Error("Current password is incorrect");
    return true;
};

export const deleteUserAccount = async (userId) => {
    await supabase
    .from("files")
    .delete()
    .eq("owner_id", userId);

    await supabase
    .from("folders")
    .delete()
    .eq("owner_id", userId);

    await supabase
    .from("shares")
    .delete()
    .eq("grantee_user_id", userId);

    await supabase
    .from("stars")
    .delete()
    .eq("user_id", userId);

    await supabase
    .from("activities")
    .delete()
    .eq("actor_id", userId);

    const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", userId);

    if (error) throw error;
    return true;
};
