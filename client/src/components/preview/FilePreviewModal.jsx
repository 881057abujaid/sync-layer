import { useState } from "react";
import { X, Download, FileX, FileText, ImageIcon, Video, Music, Archive } from "lucide-react";
import toast from "react-hot-toast";

// ── Preview type resolver ─────────────────────────────────
const getPreviewType = (mime = "") => {
    if (mime.startsWith("image"))           return "image";
    if (mime === "application/pdf")         return "pdf";
    if (mime.startsWith("text"))            return "text";
    if (mime.startsWith("video"))           return "video";
    if (mime.startsWith("audio"))           return "audio";
    return "unsupported";
};

const getFileIcon = (mime = "") => {
    if (mime.startsWith("image"))   return ImageIcon;
    if (mime.includes("pdf"))       return FileText;
    if (mime.startsWith("video"))   return Video;
    if (mime.startsWith("audio"))   return Music;
    if (mime.includes("zip"))       return Archive;
    return FileX;
};

// ── Component ─────────────────────────────────────────────
const FilePreviewModal = ({ file, onClose }) => {
    const [loading, setLoading] = useState(true);

    if (!file) return null;

    const url         = file?.downloadUrl;
    const mime        = file?.mime_type || "";
    const previewType = getPreviewType(mime);
    const Icon        = getFileIcon(mime);

    // ── Download handler ──────────────────────────────────────
    const handleDownload = () => {
        toast.success(`Downloading "${file?.name}"`); // ← add karo
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center modal-overlay"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-[85%] h-[85%] max-w-5xl flex flex-col glass-modal rounded-[20px] shadow-[0_24px_64px_rgba(0,0,0,0.2)] border border-white/90 overflow-hidden">

                {/* ── Header ── */}
                <div className="flex items-center justify-between
                    px-5 py-3.5 border-b border-blue-500/8 flex-shrink-0">

                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="icon-box rounded-[9px] w-8 h-8">
                            <Icon size={15} className="text-blue-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[13.5px] font-semibold
                                text-slate-700 truncate">
                                {file?.name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                                {mime || "Unknown type"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Download */}
                        <a
                            href={url}
                            download={file?.name}
                            target="_blank"
                            onClick={handleDownload}
                            rel="noreferrer"
                            className="flex items-center gap-1.5 h-8 px-3
                                rounded-[8px] cursor-pointer
                                border border-blue-500/20
                                bg-gradient-to-r from-[#2563eb]/7 to-[#06b6d4]/7
                                text-[12px] font-semibold
                                transition-all duration-150 group
                                hover:from-[#2563eb] hover:to-[#06b6d4]
                                hover:border-transparent
                                hover:shadow-[0_2px_10px_rgba(37,99,235,0.3)]">
                            <Download
                                size={12}
                                className="text-blue-600 group-hover:text-white
                                    transition-colors flex-shrink-0"
                            />
                            <span className="text-gradient-brand
                                group-hover:[-webkit-text-fill-color:white]
                                group-hover:[background:none]">
                                Download
                            </span>
                        </a>

                        {/* Close */}
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-[8px] flex items-center
                                justify-center cursor-pointer text-slate-400
                                border border-transparent
                                hover:bg-red-500/7 hover:border-red-400/15
                                hover:text-red-400 transition-all duration-150">
                            <X size={15} />
                        </button>
                    </div>
                </div>

                {/* ── Preview Body ── */}
                <div className="flex-1 overflow-auto relative
                    flex items-center justify-center bg-slate-50/50">

                    {/* Loading spinner */}
                    {loading && previewType !== "unsupported" && (
                        <div className="absolute inset-0 flex items-center
                            justify-center z-10 bg-white/60 backdrop-blur-sm">
                            <svg className="animate-spin text-blue-500"
                                width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor"
                                strokeWidth="2.5" strokeLinecap="round">
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/>
                            </svg>
                        </div>
                    )}

                    {/* Image */}
                    {previewType === "image" && (
                        <img
                            src={url}
                            alt={file?.name}
                            className="max-w-full max-h-full object-contain p-4"
                            onLoad={() => setLoading(false)}
                        />
                    )}

                    {/* PDF / Text / Video / Audio */}
                    {["pdf", "text", "video", "audio"].includes(previewType) && (
                        <iframe
                            src={url}
                            title={file?.name}
                            className="w-full h-full border-none"
                            onLoad={() => setLoading(false)}
                        />
                    )}

                    {/* Unsupported */}
                    {previewType === "unsupported" && (
                        <div className="flex flex-col items-center gap-4 p-8">
                            <div className="w-14 h-14 rounded-[16px] flex items-center
                                justify-center
                                bg-gradient-to-br from-[#2563eb]/8 to-[#06b6d4]/8">
                                <FileX size={26} className="text-blue-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-[14px] font-semibold text-slate-500 mb-1">
                                    Preview not available
                                </p>
                                <p className="text-[12px] text-slate-400">
                                    This file type cannot be previewed
                                </p>
                            </div>
                            <a
                                href={url}
                                download={file?.name}
                                target="_blank"
                                rel="noreferrer"
                                onClick={handleDownload}
                                className="flex items-center gap-2 h-9 px-4
                                    rounded-[9px] cursor-pointer
                                    bg-gradient-to-r from-[#2563eb] to-[#06b6d4]
                                    text-white text-[13px] font-semibold
                                    shadow-[0_2px_10px_rgba(37,99,235,0.28)]
                                    hover:shadow-[0_4px_18px_rgba(37,99,235,0.4)]
                                    hover:-translate-y-px transition-all duration-150">
                                <Download size={14} />
                                Download File
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilePreviewModal;