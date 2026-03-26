import { api } from "./api";

export const getStarredFiles = async () =>{
    const res = await api.get("/stars");
    return res.data.data;
};

export const toggleStar = async (id, isStarred) =>{
    if(isStarred){
        await api.delete(`/stars/file/${id}`);
    }else{
        await api.post(`/stars`, { resource_type: "file", resource_id: id });
    }
};

export const removeStar = async (id) =>{
    await api.delete(`/stars/file/${id}`);
};