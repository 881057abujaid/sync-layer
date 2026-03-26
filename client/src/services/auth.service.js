import { api } from "./api";

export const loginUser = async (data) =>{
    const res = await api.post("/auth/login", data);
    return res.data;
};

export const registerUser = async (data, avatarFile) =>{
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (avatarFile) {
        formData.append("avatar", avatarFile);
    }

    const res = await api.post("/auth/register", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const getCurrentUser = async () =>{
    const res = await api.get("/auth/me");
    return res.data;
};