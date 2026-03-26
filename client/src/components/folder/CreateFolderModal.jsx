import { useState } from "react";
import { FolderPlus, X } from "lucide-react";
import { createFolder } from "../../services/folder.service";
import { toast } from "react-hot-toast";

const CreateFolderModal = ({ parentId, onClose, refresh }) => {
    const [name, setName]       = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        setLoading(true);
        const toastId = toast.loading("Creating folder...");
        try {
            await createFolder({ name: name.trim(), parent_id: parentId });
            refresh();
            onClose();
            toast.success(`"${name.trim()}" folder created`, { id: toastId });
        } catch (error) {
            toast.error("Could not create folder", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center modal-overlay"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-[360px] mx-4 glass-modal
                border border-white/90 rounded-[20px]
                shadow-[0_16px_48px_rgba(37,99,235,0.15)]
                p-6">

                {/* ── Header ── */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                        <div className="icon-box rounded-[9px] w-8 h-8">
                            <FolderPlus size={16} className="text-blue-600" />
                        </div>
                        <h2 className="text-[15px] font-semibold text-slate-700
                            tracking-tight">
                            New Folder
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-[7px] flex items-center
                            justify-center text-slate-400 cursor-pointer
                            border border-transparent
                            hover:bg-blue-500/7 hover:border-blue-500/12
                            hover:text-blue-600 transition-all duration-150">
                        <X size={14} />
                    </button>
                </div>

                {/* ── Form ── */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-[5px]">
                        <label className="text-[12px] font-semibold
                            text-slate-500 tracking-[0.2px]">
                            Folder name
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Project Files"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                            className="w-full h-[42px] rounded-[10px] px-3
                                text-[13.5px] text-slate-700
                                bg-white/80 border border-blue-500/15
                                placeholder:text-slate-400
                                focus:outline-none focus:border-blue-500/40
                                focus:bg-white/95
                                focus:ring-[3px] focus:ring-blue-500/8
                                transition-all duration-150"
                        />
                    </div>

                    {/* ── Actions ── */}
                    <div className="flex items-center gap-2 mt-1">

                        {/* Cancel */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-[38px] rounded-[9px] cursor-pointer
                                border border-blue-500/15 bg-slate-50/80
                                text-[13px] font-semibold text-slate-500
                                hover:bg-slate-100/80 hover:text-slate-600
                                transition-all duration-150">
                            Cancel
                        </button>

                        {/* Create */}
                        <button
                            type="submit"
                            disabled={!name.trim() || loading}
                            className="flex-1 h-[38px] rounded-[9px] cursor-pointer
                                flex items-center justify-center gap-1.5
                                bg-gradient-to-r from-[#2563eb] to-[#06b6d4]
                                text-white text-[13px] font-semibold
                                shadow-[0_2px_10px_rgba(37,99,235,0.28)]
                                hover:shadow-[0_4px_18px_rgba(37,99,235,0.4)]
                                hover:-translate-y-px active:translate-y-0
                                disabled:opacity-50 disabled:cursor-not-allowed
                                disabled:hover:translate-y-0
                                transition-all duration-150">
                            {loading ? (
                                <svg className="animate-spin" width="14" height="14"
                                    viewBox="0 0 24 24" fill="none" stroke="white"
                                    strokeWidth="2.5" strokeLinecap="round">
                                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/>
                                </svg>
                            ) : (
                                <FolderPlus size={14} />
                            )}
                            {loading ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateFolderModal;