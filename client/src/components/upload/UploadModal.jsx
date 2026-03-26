import { useRef, useState } from "react";
import { Upload, X, FileUp, CheckCircle2 } from "lucide-react";
import useUpload from "../../hooks/useUpload";

const UploadModal = ({ onClose, folderId, refresh }) => {
    const { uploadFile, progress, loading } = useUpload();
    const [selectedFile, setSelectedFile]   = useState(null);
    const [done, setDone]                   = useState(false);
    const inputRef                          = useRef(null);

    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        setDone(false);
        try {
            await uploadFile(file, folderId);
            setDone(true);
            refresh?.();
        } catch (error) {
            console.error("Upload failed", error);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file) return;
        setSelectedFile(file);
        setDone(false);
        try {
            await uploadFile(file, folderId);
            setDone(true);
            refresh?.();
        } catch (error) {
            console.error("Upload failed", error);
        }
    };

    const formatSize = (bytes = 0) => {
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center modal-overlay"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-[400px] mx-4 glass-modal rounded-[20px] shadow-[0_16px_48px_rgba(37,99,235,0.15)] p-6 border border-white/90">

                {/* ── Header ── */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                        <div className="icon-box rounded-[9px] w-8 h-8">
                            <Upload size={15} className="text-blue-600" />
                        </div>
                        <h2 className="text-[15px] font-semibold text-slate-700
                            tracking-tight">
                            Upload File
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-[7px] flex items-center
                            justify-center text-slate-400 cursor-pointer
                            border border-transparent
                            hover:bg-red-500/7 hover:border-red-400/15
                            hover:text-red-400 transition-all duration-150">
                        <X size={14} />
                    </button>
                </div>

                {/* ── Drop Zone ── */}
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => !loading && inputRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-3
                        py-8 rounded-[14px] border-2 border-dashed cursor-pointer
                        transition-all duration-150
                        ${loading
                            ? "border-blue-400/30 bg-blue-500/3 cursor-not-allowed"
                            : done
                                ? "border-emerald-400/40 bg-emerald-500/3"
                                : "border-blue-400/25 bg-blue-500/3 hover:border-blue-400/50 hover:bg-blue-500/6"
                        }`}>

                    <input
                        ref={inputRef}
                        type="file"
                        onChange={handleFile}
                        className="hidden"
                    />

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center transition-all duration-150 flex-shrink-0
                        ${done
                            ? "bg-emerald-500/10"
                            : "bg-gradient-to-br from-[#2563eb]/10 to-[#06b6d4]/8"
                        }`}>
                        {done
                            ? <CheckCircle2 size={26} className="text-emerald-500" />
                            : loading
                                ? <FileUp size={26} className="text-blue-500 animate-bounce" />
                                : <FileUp size={26} className="text-blue-500" />
                        }
                    </div>

                    {/* Text */}
                    {!selectedFile && !loading && (
                        <>
                            <p className="text-[13.5px] font-semibold text-slate-500">
                                Click or drag a file here
                            </p>
                            <p className="text-[11.5px] text-slate-400">
                                Any file type supported
                            </p>
                        </>
                    )}
                    {selectedFile && !done && (
                        <p className="text-[13px] font-medium text-slate-600 truncate
                            max-w-[260px] text-center px-2">
                            {selectedFile.name}
                        </p>
                    )}
                    {done && (
                        <p className="text-[13.5px] font-semibold text-emerald-600">
                            Upload complete!
                        </p>
                    )}
                </div>

                {/* ── Progress Bar ── */}
                {loading && (
                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-1.5">
                            <p className="text-[12px] font-medium text-slate-500 truncate
                                max-w-[260px]">
                                {selectedFile?.name}
                            </p>
                            <span className="text-[11.5px] font-semibold text-gradient-brand flex-shrink-0">
                                {progress}%
                            </span>
                        </div>
                        <div className="w-full h-[5px] bg-blue-500/10 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-300
                                    bg-gradient-to-r from-[#2563eb] to-[#06b6d4]"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1.5">
                            {formatSize(selectedFile?.size * (progress / 100))} of{" "}
                            {formatSize(selectedFile?.size)}
                        </p>
                    </div>
                )}

                {/* ── Done state meta ── */}
                {done && selectedFile && (
                    <div className="mt-4 flex items-center gap-2.5 px-3.5 py-2.5
                        rounded-[10px] bg-emerald-500/6 border border-emerald-400/15">
                        <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[12px] font-semibold text-emerald-600 truncate">
                                {selectedFile.name}
                            </p>
                            <p className="text-[11px] text-emerald-500/70">
                                {formatSize(selectedFile.size)} · Uploaded successfully
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Close button ── */}
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="mt-4 w-full h-[38px] rounded-[9px] cursor-pointer
                        border border-blue-500/15 bg-slate-50/80
                        text-[13px] font-semibold text-slate-500
                        hover:bg-slate-100/80 hover:text-slate-600
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-150">
                    {done ? "Done" : "Cancel"}
                </button>
            </div>
        </div>
    );
};

export default UploadModal;