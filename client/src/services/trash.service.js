import { api } from "./api";

export const getTrashFiles = async () =>{
    const res = await api.get("/files/trash");
    return res.data.data;
};

export const restoreTrashFile = async (id) =>{
    await api.post(`/files/${id}/restore`);
};

export const deleteTrashFile = async (id) =>{
    await api.delete(`/files/${id}/permanent`);
};