import { api } from "./api";

export const downloadFile = async (id) =>{
    const res = await api.get(`/files/${id}/download`);
    const url = res.data.downloadUrl;

    if(!url) throw new Error("Download URL not found");
    window.open(url, "_blank");
};

export const deleteFile = async (id) =>{
    await api.delete(`/files/${id}`);
};

export const renameFile = async (id, name) =>{
    await api.patch(`/files/${id}/rename`, { name });
};

export const starFile = async (id) =>{
    await api.post(`/stars`, {
        resource_type: "file",
        resource_id: id
    });
};

export const moveFile = async (id, folderId) =>{
    await api.patch(`/files/${id}/move`, { folder_id: folderId });
};

export const downloadVersion = async (id) =>{
    const res = await api.get(`/versions/${id}/download`);
    const url = res.data.downloadUrl;

    if(!url) throw new Error("Download URL not found");
    window.open(url, "_blank");
};
