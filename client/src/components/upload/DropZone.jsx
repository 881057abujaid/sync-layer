import { useState } from "react";
import { Upload, CloudUpload } from "lucide-react";
import useUpload from "../../hooks/useUpload";

const DropZone = ({ folderId, refresh, children }) => {
    const [dragging, setDragging]   = useState(false);
    const [uploading, setUploading] = useState(false);
    const { uploadFile }            = useUpload();

    const handleDrop = async (e) => {
        e.preventDefault();
        setDragging(false);

        const file = e.dataTransfer.files[0];
        if (!file) return;

        setUploading(true);
        try {
            await uploadFile(file, folderId);
            refresh();
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setUploading(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        // Only trigger when leaving the entire dropzone
        // not when hovering over child elements
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setDragging(false);
        }
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className="relative min-h-full">

            {children}

            {/* ── Drag overlay ── */}
            {dragging && (
                <div className="absolute inset-0 z-50 rounded-[16px]
                    bg-gradient-to-br from-[#2563eb]/10 to-[#06b6d4]/8
                    backdrop-blur-[2px]
                    border-2 border-dashed border-blue-400/60
                    flex flex-col items-center justify-center gap-4
                    pointer-events-none">
                    <div className="w-16 h-16 rounded-[18px] flex items-center
                        justify-center
                        bg-gradient-to-br from-[#2563eb]/15 to-[#06b6d4]/12
                        border border-blue-400/20">
                        <CloudUpload size={30} className="text-blue-500" />
                    </div>
                    <div className="text-center">
                        <p className="text-[16px] font-semibold text-gradient-brand">
                            Drop to upload
                        </p>
                        <p className="text-[12px] text-slate-400 mt-1">
                            Release to start uploading
                        </p>
                    </div>
                </div>
            )}

            {/* ── Upload progress overlay ── */}
            {uploading && (
                <div className="absolute inset-0 z-50 rounded-[16px]
                    bg-white/60 backdrop-blur-[4px]
                    flex flex-col items-center justify-center gap-4
                    pointer-events-none">
                    <div className="icon-box rounded-[18px] w-16 h-16">
                        <Upload
                            size={28}
                            className="text-blue-500 animate-bounce"
                        />
                    </div>
                    <div className="text-center">
                        <p className="text-[15px] font-semibold text-gradient-brand">
                            Uploading...
                        </p>
                        <p className="text-[12px] text-slate-400 mt-1">
                            Please wait
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropZone;