import { useEffect, useState } from "react";
import {
    FileText, ImageIcon, Archive,
    File, Download, Share2
} from "lucide-react";
import { getSharedFiles } from "../services/shared.service";
import * as fileService from "../services/file.service";
import DashboardLayout from "../components/layout/DashboardLayout";
import toast from "react-hot-toast";

// ── Helpers ──────────────────────────────────────────────
const formatBytes = (bytes = 0) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (name = "") => {
    const ext = name.split(".").pop().toLowerCase();
    if (["pdf"].includes(ext))
        return { icon: FileText, style: "bg-red-500/10 text-red-500" };
    if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext))
        return { icon: ImageIcon, style: "bg-violet-500/10 text-violet-500" };
    if (["zip", "rar", "tar", "gz"].includes(ext))
        return { icon: Archive, style: "bg-amber-500/10 text-amber-500" };
    return {
        icon: File,
        style: "bg-gradient-to-br from-blue-500/10 to-cyan-500/8 text-blue-600",
    };
};

const ownerInitials = (name = "") =>
    name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "??";

// ── Component ─────────────────────────────────────────────
const Shared = () => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            const res = await getSharedFiles();
            if (Array.isArray(res)) {
                const mapped = res.map(share => ({
                    id: share.files?.id,
                    shareId: share.id,
                name: share.files?.name || "Unknown File",
                mime_type: share.files?.mime_type,
                size_bytes: share.files?.size_bytes || 0,
                role: share.role,
                sharedAt: share.created_at,
                owner: (Array.isArray(share.owner) ? share.owner[0] : share.owner) || { name: "Unknown" }
            }));
            setFiles(mapped);
        }
    } catch (error) {
        toast.error("Failed to load shared files");
    }
    };

    const downloadFile = async (id) => {
        if (!id) return;
        const toastId = toast.loading("Downloading...");
        try {
            await fileService.downloadFile(id);
            toast.success("Downloaded successfully", { id: toastId });
        } catch (error) {
            toast.error("Failed to download", { id: toastId });
        }
    };

    return (
        <DashboardLayout>

            {/* ── Page Header ── */}
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-[20px] font-bold tracking-tight
                    bg-gradient-to-r from-[#2563eb] to-[#06b6d4]
                    bg-clip-text text-transparent">
                    Shared with me
                </h1>
                {files.length > 0 && (
                    <span className="text-[11px] font-semibold px-[10px] py-[3px]
                        rounded-full border border-blue-500/18 bg-blue-600/6 text-gradient-brand">
                        {files.length} {files.length === 1 ? "file" : "files"}
                    </span>
                )}
            </div>

            {/* ── Empty State ── */}
            {files.length === 0 && (
                <div className="flex flex-col items-center justify-center
                    py-14 gap-3 rounded-[16px]
                    bg-white/70 backdrop-blur-[28px]
                    border border-white/90
                    shadow-[0_4px_24px_rgba(37,99,235,0.06)]">
                    <div className="w-12 h-12 rounded-[14px] flex items-center
                        justify-center
                        bg-gradient-to-br from-blue-500/8 to-cyan-500/8">
                        <Share2 size={22} className="text-blue-400" />
                    </div>
                    <p className="text-[14px] font-medium text-slate-400">
                        No files shared with you yet
                    </p>
                    <p className="text-[12px] text-slate-300">
                        Files shared by others will appear here
                    </p>
                </div>
            )}

            {/* ── File List ── */}
            <div className="flex flex-col gap-[10px]">
                {files.map((file) => {
                    const { icon: Icon, style } = getFileIcon(file.name);
                    const initials = ownerInitials(file.owner?.name || "");

                    return (
                        <div key={file.id}
                            className="flex items-center justify-between gap-3.5
                                px-4 py-[14px] rounded-[14px]
                                bg-white/70 backdrop-blur-[28px]
                                border border-white/90
                                shadow-[0_2px_12px_rgba(37,99,235,0.05)]
                                hover:shadow-[0_4px_20px_rgba(37,99,235,0.1)]
                                hover:-translate-y-px
                                transition-all duration-150">

                            {/* Left — icon + info */}
                            <div className="flex items-center gap-3.5 min-w-0">
                                <div className={`w-[42px] h-[42px] rounded-[11px]
                                    flex items-center justify-center
                                    flex-shrink-0 ${style}`}>
                                    <Icon size={20} strokeWidth={1.8} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[13.5px] font-semibold
                                        text-slate-700 truncate">
                                        {file.name}
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-[3px]">
                                        <div className="w-4 h-4 rounded-[4px] flex-shrink-0
                                            flex items-center justify-center
                                            bg-gradient-to-br from-[#2563eb] to-[#06b6d4]
                                            text-white text-[8px] font-bold">
                                            {initials}
                                        </div>
                                        <span className="text-[11.5px] text-slate-400">
                                            Shared by{" "}
                                            <span className="font-medium text-slate-500">
                                                {file.owner?.name || "Unknown"}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right — size + download */}
                            <div className="flex items-center gap-2.5 flex-shrink-0">
                                <span className="text-[12px] font-medium text-slate-400
                                    hidden sm:block">
                                    {formatBytes(file.size_bytes)}
                                </span>
                                <button
                                    onClick={() => downloadFile(file.id)}
                                    className="flex items-center gap-1.5 h-8 px-[13px]
                                        rounded-[8px] cursor-pointer
                                        border border-blue-500/20
                                        bg-gradient-to-r from-[#2563eb]/7 to-[#06b6d4]/7
                                        transition-all duration-150 group
                                        hover:from-[#2563eb] hover:to-[#06b6d4]
                                        hover:border-transparent
                                        hover:shadow-[0_2px_12px_rgba(37,99,235,0.3)]
                                        hover:-translate-y-px">
                                    <Download
                                        size={12}
                                        className="text-blue-600 flex-shrink-0
                                            group-hover:text-white transition-colors"
                                    />
                                    <span className="text-[12.5px] font-semibold text-gradient-brand
                                        group-hover:text-white group-hover:[background:none]
                                        group-hover:[-webkit-text-fill-color:white]
                                        transition-all duration-150">
                                        Download
                                    </span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </DashboardLayout>
    );
};

export default Shared;