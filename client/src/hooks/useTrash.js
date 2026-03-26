import { useEffect, useState } from "react";
import { getTrashFiles } from "../services/trash.service";
import toast from "react-hot-toast";

export const useTrash = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTrash = async () => {
        setLoading(true);
        try {
            const data = await getTrashFiles();
            setFiles(data || []);
        } catch (error) {
            console.error("Error fetching trash files", error);
            toast.error("Could not load Trash Files");
            setFiles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrash();
    }, []);

    return {
        files,
        loading,
        refresh: fetchTrash
    };
};