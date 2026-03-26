import { useState, useEffect } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";

const useFiles = (folderId, query, filters) =>{
    const [files, setFiles] = useState([]);
    const [folders, setFolders] = useState([]);

    const fetchFiles = async () =>{
        try {
            let res;
            if (query){
                res = await api.get("/search", {params: {q: query}});
                setFiles(res.data.data.files);
                setFolders(res.data.data.folders);
            }else{
                res = await api.get("/files", {params: {
                    folder_id: folderId,
                    sortBy: filters?.sortBy,
                    order: filters?.order,
                    type: filters?.type
                }});
                setFiles(res.data.files || []);
                setFolders(res.data.folders || []);
            }
        } catch (error) {
            console.error("Error loading files", error);
            toast.error("Could not load Files");
        }
    };

    useEffect(() =>{
        fetchFiles();
    }, [folderId, query, filters]);

    return {
        files,
        folders,
        refresh: fetchFiles
    };
};

export default useFiles;