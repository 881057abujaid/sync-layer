import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FolderInput, Folder, FolderOpen, Home, X, ChevronRight } from "lucide-react";
import * as fileService from "../../services/file.service";
import { toast } from "react-hot-toast";
import { api } from "../../services/api";

// ── Tree builder ──────────────────────────────────────────
const buildTree = (folders, parentId = null) => {
    return folders
        .filter((f) => f.parent_id === parentId)
        .map((f) => ({
            ...f,
            children: buildTree(folders, f.id),
        }));
};

// ── Recursive Tree Node ───────────────────────────────────
const TreeNode = ({ node, selected, onSelect, depth = 0 }) => {
    const [open, setOpen] = useState(false);
    const hasChildren = node.children?.length > 0;
    const isSelected  = selected === node.id;

    return (
        <div>
            <div
                style={{ paddingLeft: `${8 + depth * 16}px` }}
                className={`flex items-center gap-1.5 pr-2 py-[7px]
                    rounded-[9px] cursor-pointer border
                    transition-all duration-150 group
                    ${isSelected
                        ? "bg-gradient-to-r from-[#2563eb]/11 to-[#06b6d4]/9 border-blue-500/20"
                        : "border-transparent hover:bg-blue-500/5 hover:border-blue-500/10"
                    }`}>

                {/* ── Chevron toggle ── */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (hasChildren) setOpen((prev) => !prev);
                    }}
                    className={`w-4 h-4 flex items-center justify-center
                        flex-shrink-0 rounded-[4px] transition-all duration-150
                        ${hasChildren
                            ? "text-slate-400 hover:text-blue-500 hover:bg-blue-500/8"
                            : "opacity-0 pointer-events-none"
                        }`}>
                    <ChevronRight
                        size={12}
                        className={`transition-transform duration-150
                            ${open ? "rotate-90" : ""}`}
                    />
                </button>

                {/* ── Folder row ── */}
                <div
                    className="flex items-center gap-2 flex-1 min-w-0"
                    onClick={() => onSelect(node.id)}>

                    {open && hasChildren
                        ? <FolderOpen size={14} className={`flex-shrink-0
                            ${isSelected ? "text-blue-500" : "text-blue-400"}`} />
                        : <Folder size={14} className={`flex-shrink-0
                            ${isSelected ? "text-blue-500" : "text-slate-400"}`} />
                    }

                    <span className={`text-[12.5px] font-medium truncate
                        ${isSelected ? "text-blue-600" : "text-slate-600"}`}>
                        {node.name}
                    </span>

                    {/* Children count badge */}
                    {hasChildren && !open && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5
                            rounded-full bg-blue-500/8 text-blue-400
                            border border-blue-500/10 flex-shrink-0 ml-auto">
                            {node.children.length}
                        </span>
                    )}

                    {/* Checkmark */}
                    {isSelected && (
                        <span className="w-4 h-4 rounded-full flex-shrink-0 ml-auto
                            bg-gradient-to-br from-[#2563eb] to-[#06b6d4]
                            flex items-center justify-center">
                            <svg width="8" height="8" viewBox="0 0 24 24"
                                fill="none" stroke="white"
                                strokeWidth="3.5" strokeLinecap="round"
                                strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </span>
                    )}
                </div>
            </div>

            {/* ── Children — collapsible ── */}
            {hasChildren && open && (
                <div className="relative ml-[18px]">
                    {/* Vertical line */}
                    <div className="absolute left-[10px] top-0 bottom-0
                        w-px bg-blue-500/10" />
                    {node.children.map((child) => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            selected={selected}
                            onSelect={onSelect}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// ── Main Component ────────────────────────────────────────
const MoveModal = ({ file, onClose, refresh }) => {
    const [folders, setFolders]   = useState([]);
    const [selected, setSelected] = useState(undefined);
    const [loading, setLoading]   = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => { loadFolders(); }, []);

    const loadFolders = async () => {
        try {
            const res = await api.get("/folders/all");
            setFolders(res.data || []);
        } catch (error) {
            toast.error("Could not load folders");
        } finally {
            setFetching(false);
        }
    };

    const handleMove = async () => {
        if (selected === undefined) return;
        setLoading(true);
        const toastId = toast.loading("Moving file...");
        try {
            await fileService.moveFile(file.id, selected);
            refresh();
            onClose();
            toast.success(`"${file.name}" moved successfully`, { id: toastId });
        } catch (error) {
            toast.error("Move failed", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const tree = buildTree(folders);

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center
                bg-black/25 backdrop-blur-[4px]"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-[340px] bg-white/85 backdrop-blur-[32px]
                border border-white/90 rounded-[20px]
                shadow-[0_16px_48px_rgba(37,99,235,0.15)]
                p-6">

                {/* ── Header ── */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-[9px] flex items-center
                            justify-center flex-shrink-0
                            bg-gradient-to-br from-[#2563eb]/10 to-[#06b6d4]/8">
                            <FolderInput size={15} className="text-blue-600" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-[15px] font-semibold text-slate-700">
                                Move File
                            </h2>
                            <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
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

                {/* ── Tree ── */}
                <div className="flex flex-col gap-[5px] mb-4">
                    <label className="text-[12px] font-semibold text-slate-500">
                        Select destination
                    </label>

                    <div className="max-h-[220px] overflow-y-auto
                        rounded-[12px] border border-blue-500/10
                        bg-white/60 p-2 flex flex-col gap-0.5">

                        {/* Loading */}
                        {fetching && (
                            <div className="flex items-center justify-center py-6">
                                <svg className="animate-spin text-blue-400"
                                    width="20" height="20" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor"
                                    strokeWidth="2.5" strokeLinecap="round">
                                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/>
                                </svg>
                            </div>
                        )}

                        {/* ── Root ── */}
                        {!fetching && (
                            <>
                                <div
                                    onClick={() => setSelected(null)}
                                    className={`flex items-center gap-2 px-2 py-[7px]
                                        rounded-[9px] cursor-pointer border
                                        transition-all duration-150
                                        ${selected === null
                                            ? "bg-gradient-to-r from-[#2563eb]/11 to-[#06b6d4]/9 border-blue-500/20"
                                            : "border-transparent hover:bg-blue-500/5 hover:border-blue-500/10"
                                        }`}>
                                    <div className="w-4 h-4 flex-shrink-0" />
                                    <Home size={14} className={selected === null
                                        ? "text-blue-500 flex-shrink-0"
                                        : "text-slate-400 flex-shrink-0"} />
                                    <span className={`text-[12.5px] font-semibold flex-1
                                        ${selected === null ? "text-blue-600" : "text-slate-600"}`}>
                                        Home (Root)
                                    </span>
                                    {selected === null && (
                                        <span className="w-4 h-4 rounded-full
                                            bg-gradient-to-br from-[#2563eb] to-[#06b6d4]
                                            flex items-center justify-center flex-shrink-0">
                                            <svg width="8" height="8" viewBox="0 0 24 24"
                                                fill="none" stroke="white"
                                                strokeWidth="3.5" strokeLinecap="round"
                                                strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"/>
                                            </svg>
                                        </span>
                                    )}
                                </div>

                                {/* ── Folder Tree ── */}
                                {tree.map((node) => (
                                    <TreeNode
                                        key={node.id}
                                        node={node}
                                        selected={selected}
                                        onSelect={setSelected}
                                        depth={0}
                                    />
                                ))}

                                {/* Empty */}
                                {tree.length === 0 && (
                                    <p className="text-[12px] text-slate-400
                                        text-center py-3">
                                        No folders yet
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* ── Actions ── */}
                <div className="flex items-center gap-2">
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

                    <button
                        type="button"
                        onClick={handleMove}
                        disabled={selected === undefined || loading}
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
                            <FolderInput size={14} />
                        )}
                        {loading ? "Moving..." : "Move"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default MoveModal;