import { api } from "./api";

export const searchResources = async (query) =>{
    console.log(query);
    const res = await api.get("/search", {params: {q: query}});
    console.log(res.data);
    return res.data.data;
}