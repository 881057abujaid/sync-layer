import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Clock, RotateCcw, Download, History, X, CheckCircle2 } from "lucide-react";
import { api } from "../../services/api";
import { downloadVersion } from "../../services/file.service";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "react-hot-toast";

dayjs.extend(relativeTime);

const VersionModal = ({ file, onClose, refresh }) => {
    const [versions, setVersions]         = useState([]);
    const [fetching, setFetching]         = useState(true);
    const [restoringId, setRestoringId]   = useState(null);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const res = await api.get(`/files/${file.id}/versions`);
            setVersions(res.data.data || []);
        } catch (error) {
            toast.error("Could not load version history");
        } finally {
            setFetching(false);
        }
    };

    const handleRestore = async (versionId) => {
        setRestoringId(versionId);
        const toastId = toast.loading("Restoring version...");
        try {
            await api.post(`/files/${file.id}/restore/${versionId}`);
            refresh();
            onClose();
            toast.success("Version restored successfully", { id: toastId });
        } catch (error) {
            toast.error("Restore failed", { id: toastId });
        } finally {
            setRestoringId(null);
        }
    };

    const handleDownload = (id) => {
        const toastId = toast.loading("Downloading version...");
        try {
            downloadVersion(id);
            toast.success("Version downloaded successfully", { id: toastId });
        } catch (error) {
            toast.error("Download failed", { id: toastId });
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center
                bg-black/25 backdrop-blur-[4px]"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-[400px] max-h-[85vh] flex flex-col
                bg-white/85 backdrop-blur-[32px]
                border border-white/90 rounded-[20px]
                shadow-[0_16px_48px_rgba(37,99,235,0.15)]">

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-5 py-4
                    border-b border-blue-500/8 flex-shrink-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-[9px] flex items-center
                            justify-center flex-shrink-0
                            bg-gradient-to-br from-[#2563eb]/10 to-[#06b6d4]/8">
                            <History size={15} className="text-blue-600" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-[15px] font-semibold text-slate-700">
                                Version History
                            </h2>
                            <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
                                {file?.name}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-[7px] flex items-center
                            justify-center text-slate-400 cursor-pointer
                            border border-transparent flex-shrink-0
                            hover:bg-red-500/7 hover:border-red-400/15
                            hover:text-red-400 transition-all duration-150">
                        <X size={14} />
                    </button>
                </div>

                {/* ── Timeline ── */}
                <div className="overflow-y-auto flex-1 px-5 py-4">

                    {/* Loading */}
                    {fetching && (
                        <div className="flex items-center justify-center py-10">
                            <svg className="animate-spin text-blue-400"
                                width="22" height="22" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor"
                                strokeWidth="2.5" strokeLinecap="round">
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/>
                            </svg>
                        </div>
                    )}

                    {!fetching && (
                        <div className="relative flex flex-col gap-3">

                            {/* Vertical timeline line */}
                            <div className="absolute left-[7px] top-4 bottom-4
                                w-px bg-blue-500/10" />

                            {/* ── Current Version ── */}
                            <div className="flex items-start gap-3">
                                <div className="flex flex-col items-center
                                    flex-shrink-0 mt-[3px]">
                                    <div className="w-[14px] h-[14px] rounded-full
                                        bg-gradient-to-br from-emerald-400 to-emerald-500
                                        border-2 border-white z-10
                                        shadow-[0_0_0_2px_rgba(16,185,129,0.2)]
                                        flex items-center justify-center">
                                        <CheckCircle2 size={8} className="text-white" strokeWidth={3} />
                                    </div>
                                </div>
                                <div className="flex-1 bg-emerald-500/5 border
                                    border-emerald-400/15 rounded-[12px] px-3.5 py-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[13px] font-semibold text-emerald-600">
                                                Current (v{file.version || 1})
                                            </p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                Latest version
                                            </p>
                                        </div>
                                        <span className="text-[10px] font-semibold px-2 py-0.5
                                            rounded-full bg-emerald-500/10
                                            border border-emerald-400/20 text-emerald-600">
                                            Active
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* ── Past Versions ── */}
                            {versions.length === 0 && (
                                <div className="flex flex-col items-center
                                    justify-center py-8 gap-2 ml-6">
                                    <History size={22} className="text-blue-200" />
                                    <p className="text-[12.5px] text-slate-400">
                                        No previous versions
                                    </p>
                                </div>
                            )}

                            {versions.map((v, index) => {
                                const isLast      = index === versions.length - 1;
                                const isRestoring = restoringId === v.id;

                                return (
                                    <div key={v.id} className="flex items-start gap-3">

                                        {/* Dot */}
                                        <div className="flex-shrink-0 mt-[3px]">
                                            <div className="w-[14px] h-[14px] rounded-full
                                                bg-gradient-to-br from-[#2563eb]/40 to-[#06b6d4]/40
                                                border-2 border-white z-10
                                                shadow-[0_0_0_2px_rgba(37,99,235,0.1)]" />
                                        </div>

                                        {/* Card */}
                                        <div className="flex-1 bg-white/60 border
                                            border-blue-500/10 rounded-[12px] px-3.5 py-3
                                            hover:border-blue-500/20 hover:bg-white/80
                                            transition-all duration-150">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="text-[13px] font-semibold text-slate-600">
                                                        Version {v.version_number}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400
                                                        flex items-center gap-1 mt-0.5">
                                                        <Clock size={10} className="flex-shrink-0" />
                                                        {dayjs(v.created_at).fromNow()} ·{" "}
                                                        {dayjs(v.created_at).format("MMM D, YYYY")}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-1.5
                                                    flex-shrink-0">
                                                    {/* Restore */}
                                                    <button
                                                        onClick={() => handleRestore(v.id)}
                                                        disabled={isRestoring}
                                                        className="flex items-center gap-1 h-7
                                                            px-2.5 rounded-[7px] cursor-pointer
                                                            border border-blue-500/20
                                                            bg-gradient-to-r from-[#2563eb]/7 to-[#06b6d4]/7
                                                            text-[11px] font-semibold
                                                            transition-all duration-150 group
                                                            hover:from-[#2563eb] hover:to-[#06b6d4]
                                                            hover:border-transparent
                                                            hover:shadow-[0_2px_8px_rgba(37,99,235,0.25)]
                                                            disabled:opacity-50 disabled:cursor-not-allowed">
                                                        {isRestoring ? (
                                                            <svg className="animate-spin"
                                                                width="11" height="11"
                                                                viewBox="0 0 24 24" fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2.5"
                                                                strokeLinecap="round">
                                                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/>
                                                            </svg>
                                                        ) : (
                                                            <RotateCcw size={11}
                                                                className="text-blue-600 flex-shrink-0
                                                                    group-hover:text-white transition-colors" />
                                                        )}
                                                        <span className="bg-gradient-to-r from-[#2563eb]
                                                            to-[#06b6d4] bg-clip-text text-transparent
                                                            group-hover:[-webkit-text-fill-color:white]
                                                            group-hover:[background:none]">
                                                            {isRestoring ? "..." : "Restore"}
                                                        </span>
                                                    </button>

                                                    {/* Download */}
                                                    <button
                                                        onClick={() => handleDownload(v.id)}
                                                        className="w-7 h-7 rounded-[7px] flex items-center
                                                            justify-center cursor-pointer
                                                            border border-blue-500/15
                                                            bg-white/60 text-slate-500
                                                            hover:bg-blue-500/7 hover:border-blue-500/20
                                                            hover:text-blue-600
                                                            transition-all duration-150">
                                                        <Download size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default VersionModal;