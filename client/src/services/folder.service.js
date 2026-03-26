import { api } from "./api";

export const createFolder = async (data) =>{
    const res = await api.post("/folders", data);
    return res.data;
};

export const getFolders = async () =>{
    const res = await api.get("/folders", {
        params: { parent_id: null }
    });
    return res.data;
};