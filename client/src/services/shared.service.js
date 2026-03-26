import { api } from "./api";

export const getSharedFiles = async () =>{
    const res = await api.get("/shares");
    return res.data.data;
};

export const shareFile = async (resourceId, email, role) =>{
    const res = await api.post("/shares", {
        resource_type: "file",
        resource_id: resourceId,
        email,
        role
    });
    return res.data.data;
};

export const revokeShare = async (shareId) =>{
    const res = await api.delete(`/shares/${shareId}`);
    return res.data.data;
};