import { RotateCcw, Trash2, AlertCircle, File, FileText, ImageIcon, Archive } from "lucide-react";
import { useTrash } from "../hooks/useTrash";
import { restoreTrashFile, deleteTrashFile } from "../services/trash.service";
import DashboardLayout from "../components/layout/DashboardLayout";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
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
    if (["pdf"].includes(ext))        return FileText;
    if (["png","jpg","jpeg","gif","webp","svg"].includes(ext)) return ImageIcon;
    if (["zip","rar","tar","gz"].includes(ext)) return Archive;
    return File;
};

// ── Component ─────────────────────────────────────────────
const Trash = () => {
    const { files, loading, refresh } = useTrash(); // bug fix: useTrash() not useTrash ✅

    const handleRestore = async (id) => {
        const toastId = toast.loading("Restoring file...");
        try {
            await restoreTrashFile(id);
            toast.success("File restored successfully", { id: toastId });
            refresh();
        } catch (error) {
            toast.error("Failed to restore file", { id: toastId });
        }
    };

    const handleDelete = async (id) => {
        const toastId = toast.loading("Deleting file...");
        try {
            await deleteTrashFile(id);
            toast.success("File deleted successfully", { id: toastId });
            refresh();
        } catch (error) {
            toast.error("Failed to delete file", { id: toastId });
        }
    };

    return (
        <DashboardLayout>

            {/* ── Page Header ── */}
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-[20px] font-bold tracking-tight
                    bg-gradient-to-r from-[#2563eb] to-[#06b6d4]
                    bg-clip-text text-transparent">
                    Trash
                </h1>
                {files?.length > 0 && (
                    <span className="text-[11px] font-semibold px-[10px] py-[3px]
                        rounded-full border border-red-400/15 bg-red-500/6
                        text-red-500">
                        {files.length} {files.length === 1 ? "file" : "files"}
                    </span>
                )}
            </div>

            {/* ── Warning Banner ── */}
            {files?.length > 0 && (
                <div className="flex items-center gap-2.5 px-3.5 py-2.5
                    rounded-[10px] mb-4
                    bg-red-500/5 border border-red-400/12">
                    <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                    <p className="text-[12px] font-medium text-red-400">
                        Files in trash will be permanently deleted after 30 days
                    </p>
                </div>
            )}

            {/* ── Loading ── */}
            {loading && (
                <div className="flex items-center justify-center py-14">
                    <svg className="animate-spin text-blue-500" width="22" height="22"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2.5" strokeLinecap="round">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/>
                    </svg>
                </div>
            )}

            {/* ── Empty State ── */}
            {!loading && files?.length === 0 && (
                <div className="flex flex-col items-center justify-center
                    py-14 gap-3 rounded-[16px]
                    bg-white/70 backdrop-blur-[28px]
                    border border-white/90
                    shadow-[0_4px_24px_rgba(37,99,235,0.06)]">
                    <div className="w-12 h-12 rounded-[14px] flex items-center
                        justify-center bg-red-500/8">
                        <Trash2 size={22} className="text-red-400" />
                    </div>
                    <p className="text-[14px] font-medium text-slate-400">
                        Trash is empty
                    </p>
                    <p className="text-[12px] text-slate-300">
                        Deleted files will appear here
                    </p>
                </div>
            )}

            {/* ── File List ── */}
            {!loading && files?.length > 0 && (
                <div className="bg-white/70 backdrop-blur-[28px]
                    border border-white/90 rounded-[16px]
                    shadow-[0_4px_24px_rgba(37,99,235,0.07)]
                    overflow-hidden">

                    {files.map((file) => {
                        const Icon = getFileIcon(file.name);

                        return (
                            <div key={file.id}
                                className="flex items-center gap-3.5
                                    px-[18px] py-[13px]
                                    border-b border-blue-500/6 last:border-none
                                    hover:bg-red-500/[0.02]
                                    transition-colors duration-150">

                                {/* Icon */}
                                <div className="w-[38px] h-[38px] rounded-[10px]
                                    flex items-center justify-center flex-shrink-0
                                    bg-red-500/7 text-red-400">
                                    <Icon size={18} strokeWidth={1.8} />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13.5px] font-semibold
                                        text-slate-600 truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-[11.5px] text-slate-400 mt-[2px]">
                                        Deleted {dayjs(file.deleted_at).fromNow()}
                                        {file.size ? ` · ${formatBytes(file.size)}` : ""}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0">

                                    {/* Restore */}
                                    <button
                                        onClick={() => handleRestore(file.id)}
                                        className="flex items-center gap-[5px]
                                            h-[30px] px-[11px] rounded-[7px] cursor-pointer
                                            border border-blue-500/20
                                            bg-gradient-to-r from-[#2563eb]/7 to-[#06b6d4]/7
                                            text-[11.5px] font-semibold
                                            transition-all duration-150 group
                                            hover:from-[#2563eb] hover:to-[#06b6d4]
                                            hover:border-transparent
                                            hover:shadow-[0_2px_10px_rgba(37,99,235,0.3)]">
                                        <RotateCcw
                                            size={11}
                                            className="text-blue-600 flex-shrink-0
                                                group-hover:text-white transition-colors"
                                        />
                                        <span className="bg-gradient-to-r from-[#2563eb]
                                            to-[#06b6d4] bg-clip-text text-transparent
                                            group-hover:[-webkit-text-fill-color:white]
                                            group-hover:[background:none]">
                                            Restore
                                        </span>
                                    </button>

                                    {/* Delete */}
                                    <button
                                        onClick={() => handleDelete(file.id)}
                                        className="flex items-center gap-[5px]
                                            h-[30px] px-[11px] rounded-[7px] cursor-pointer
                                            border border-red-400/20 bg-red-500/6
                                            text-[11.5px] font-semibold text-red-500
                                            transition-all duration-150
                                            hover:bg-red-500 hover:text-white
                                            hover:border-transparent
                                            hover:shadow-[0_2px_10px_rgba(239,68,68,0.3)]">
                                        <Trash2 size={11} className="flex-shrink-0" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </DashboardLayout>
    );
};

export default Trash;