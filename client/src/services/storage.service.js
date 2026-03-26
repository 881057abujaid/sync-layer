import { api } from "./api";

export const getStorageUsage = async () => {
    const res = await api.get("/storage/usage");
    return res.data.data;
};

export const getStorageBreakdown = async () => {
    const res = await api.get("/storage/breakdown");
    return res.data.data;
};