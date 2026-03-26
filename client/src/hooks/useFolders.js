import { useEffect, useState } from "react"
import { getFolders } from "../services/folder.service";
import toast from "react-hot-toast";

export const useFolders = (parentId) =>{
    const [folders, setFolders] = useState([]);

    const fetchFolders = async () =>{
        try {
            const data = await getFolders(parentId);
            setFolders(data);
        } catch (error) {
            console.error("Error loading folders", error);
            toast.error("Could not load Folders");
        }
    };

    useEffect(() =>{
        fetchFolders();
    }, [parentId]);

    return {
        folders,
        refresh: fetchFolders,
    };
};