import { useState } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";

const useUpload = () =>{
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    const uploadFile = async (file, folderId) =>{
        const formData = new FormData();
        formData.append("file", file);

        if(folderId){
            formData.append("folder_id", folderId);
        }
        setLoading(true);

        const toastId = toast.loading(`Uploading ${file.name}...`);
        try {
            await api.post("/files/upload", formData, {
                headers: {
                    "Content-Type": "multipart/from-data"
                },
                onUploadProgress: (event) =>{
                    const percent = Math.round((event.loaded * 100) / event.total);
                    setProgress(percent);
                }
            });
            toast.success(`${file.name} uploaded successfully!`, {id: toastId});
        } catch (error) {
            toast.error(`Failed to upload ${file.name}`, {id: toastId});
            throw error;
        } finally {
            setLoading(false);
            setProgress(0);
        }
    };
    return {
        uploadFile,
        progress,
        loading
    };
};

export default useUpload;