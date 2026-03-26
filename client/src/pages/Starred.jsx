import { useEffect, useState } from "react";
import {
    Star, FileText, ImageIcon,
    Archive, File
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getStarredFiles, toggleStar } from "../services/star.service";
import DashboardLayout from "../components/layout/DashboardLayout";
import toast from "react-hot-toast";

dayjs.extend(relativeTime);

// ── Helpers ───────────────────────────────────────────────
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

// ── Component ─────────────────────────────────────────────
const Starred = () => {
    const [files, setFiles] = useState([]);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const data = await getStarredFiles();
            setFiles(data);
        } catch (error) {
            toast.error("Failed to load starred files");
        }
    };

    const handleUnstar = async (id) => {
        const toastId = toast.loading("Removing star...");
        try {
            await toggleStar(id, true);
            toast.success("Star removed successfully", { id: toastId });
            load();
        } catch (error) {
            toast.error("Failed to remove star", { id: toastId });
        }
    };

    return (
        <DashboardLayout>

            {/* ── Page Header ── */}
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-[20px] font-bold tracking-tight
                    bg-gradient-to-r from-[#2563eb] to-[#06b6d4]
                    bg-clip-text text-transparent">
                    Starred Files
                </h1>
                {files.length > 0 && (
                    <span className="text-[11px] font-semibold px-[10px] py-[3px]
                        rounded-full border border-blue-500/12
                        bg-gradient-to-r from-blue-500/6 to-cyan-500/6
                        bg-gradient-to-r from-[#2563eb] to-[#06b6d4]
                        bg-clip-text text-transparent">
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
                        bg-gradient-to-br from-amber-500/10 to-amber-400/6">
                        <Star size={22} className="text-amber-400" />
                    </div>
                    <p className="text-[14px] font-medium text-slate-400">
                        No starred files yet
                    </p>
                    <p className="text-[12px] text-slate-300">
                        Star your important files to find them quickly
                    </p>
                </div>
            )}

            {/* ── Grid ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {files.map(item => {
                    const { icon: Icon, style } = getFileIcon(item.files.name);
                    const file = item.files;

                    return (
                        <div key={file.id}
                            className="relative flex flex-col
                                bg-white/70 backdrop-blur-[28px]
                                border border-white/90 rounded-[14px] p-4
                                shadow-[0_2px_12px_rgba(37,99,235,0.05)]
                                hover:shadow-[0_6px_24px_rgba(37,99,235,0.12)]
                                hover:-translate-y-0.5
                                transition-all duration-150 cursor-pointer">

                            {/* Star badge */}
                            <Star
                                size={14}
                                className="absolute top-3 right-3
                                    fill-amber-400 text-amber-400"
                            />

                            {/* File icon */}
                            <div className={`w-11 h-11 rounded-[12px] mb-3
                                flex items-center justify-center ${style}`}>
                                <Icon size={22} strokeWidth={1.8} />
                            </div>

                            {/* Name & size */}
                            <p className="text-[13px] font-semibold text-slate-700
                                truncate pr-4 mb-1">
                                {file.name}
                            </p>
                            <p className="text-[11px] text-slate-400 mb-3">
                                {formatBytes(file.size_bytes)}
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-[11px] text-slate-400">
                                    {dayjs(file.created_at).fromNow()}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleUnstar(file.id);
                                    }}
                                    className="flex items-center gap-1 px-[9px] py-1
                                        rounded-[7px] cursor-pointer
                                        border border-amber-400/20
                                        bg-amber-400/6 text-amber-500
                                        text-[11px] font-semibold
                                        hover:bg-amber-400/14
                                        hover:border-amber-400/35
                                        transition-all duration-150">
                                    <Star size={10} className="fill-amber-400 text-amber-400" />
                                    Unstar
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </DashboardLayout>
    );
};

export default Starred;