import supabase from "../config/supabaseClient.js";

export const getActivities = async (req, res) =>{
    const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("actor_id", req.user.userId)
    .order("created_at", { ascending: false })
    .limit(50);

    if(error){
        return res.status(400).json({
            error: error.message
        });
    }

    res.json({
        status: "success",
        data
    });
};