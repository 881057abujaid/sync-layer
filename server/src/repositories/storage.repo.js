import supabase from "../config/supabaseClient.js";

export const getStorageBreakdown = async (userId) => {
    const { data, error } = await supabase
    .from("files")
    .select("mime_type, size_bytes")
    .eq("owner_id", userId)
    .eq("is_deleted", false);

    if(error) throw error;

    const breakdown = { images: 0, videos: 0, documents: 0, others: 0 };

    data.forEach(({ mime_type, size_bytes }) => {
        if (mime_type?.startsWith("image"))                     breakdown.images    += size_bytes;
        else if (mime_type?.includes("pdf") ||
                 mime_type?.startsWith("text"))                 breakdown.documents += size_bytes;
        else if (mime_type?.startsWith("video"))                breakdown.videos    += size_bytes;
        else                                                    breakdown.others    += size_bytes;
    });

    return breakdown;
}