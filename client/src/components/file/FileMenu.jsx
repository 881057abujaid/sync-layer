import { Download, Star, Trash2, X, Share2, Edit3, Move, History } from "lucide-react";
import * as fileService from "../../services/file.service";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
import RenameModal from "./RenameModal";
import ShareModal from "./ShareModal";
import MoveModal from "./MoveModal";
import VersionModal from "./VersionModal";

const menuItems = [
    { label: "Download",        icon: Download, style: "text-slate-600 hover:bg-blue-500/6 hover:text-blue-600",     action: "download"  },
    { label: "Star",            icon: Star,     style: "text-slate-600 hover:bg-amber-500/6 hover:text-amber-500",   action: "star"      },
    { label: "Share",           icon: Share2,   style: "text-slate-600 hover:bg-purple-500/6 hover:text-purple-600", action: "share"     },
    { label: "Rename",          icon: Edit3,    style: "text-slate-600 hover:bg-indigo-500/6 hover:text-indigo-600", action: "rename"    },
    { label: "Move",            icon: Move,     style: "text-slate-600 hover:bg-green-500/6 hover:text-green-600",   action: "move"      },
    { label: "Delete",          icon: Trash2,   style: "text-red-400 hover:bg-red-500/6 hover:text-red-500",         action: "delete",   divider: true },
    { label: "Version History", icon: History,  style: "text-slate-600 hover:bg-pink-500/6 hover:text-pink-600",    action: "versions"  },
];

const FileMenu = ({ file, onClose, refresh, position }) => {
    const menuRef = useRef(null);
    const [showRename,   setShowRename]   = useState(false);
    const [showShare,    setShowShare]    = useState(false);
    const [showMove,     setShowMove]     = useState(false);
    const [showVersions, setShowVersions] = useState(false);

    const menuStyle = {
        position:  "fixed",
        top:       position.top,
        left:      position.left,
        zIndex:    9999,
        opacity:   0,
        animation: "fadeIn 0.1s ease forwards",
    };

    // ── Outside click close ───────────────────────────────
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showRename || showShare || showMove || showVersions) return;
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose, showRename, showShare, showMove, showVersions]);

    // ── Position fix ─────────────────────────────────────
    useEffect(() => {
        if (!menuRef.current) return;
        const rect    = menuRef.current.getBoundingClientRect();
        const menuH   = rect.height;
        const menuW   = rect.width; // typo fix: widtth → width ✅
        const padding = 8;

        let top  = position.top;
        let left = position.left;

        if (top  + menuH > window.innerHeight - padding) top  = window.innerHeight - menuH - padding;
        if (top  < padding)                               top  = padding;
        if (left + menuW > window.innerWidth  - padding) left = window.innerWidth  - menuW - padding;
        if (left < padding)                               left = padding;

        menuRef.current.style.top  = `${top}px`;
        menuRef.current.style.left = `${left}px`;
    }, []);

    // ── Handlers ─────────────────────────────────────────
    const handleDownload = async () => {
        const toastId = toast.loading("Downloading...");
        try {
            await fileService.downloadFile(file.id);
            toast.success(`"${file.name}" downloaded!`, { id: toastId });
        } catch (error) {
            toast.error("Download failed", { id: toastId });
        } finally {
            onClose();
        }
    };

    const handleDelete = async () => {
        const toastId = toast.loading("Deleting...");
        try {
            await fileService.deleteFile(file.id);
            refresh();
            toast.success(`"${file.name}" moved to trash`, { id: toastId });
        } catch (error) {
            toast.error("Delete failed", { id: toastId });
        } finally {
            onClose();
        }
    };

    const handleStar = async () => {
        const toastId = toast.loading("Updating...");
        try {
            await fileService.starFile(file.id);
            refresh();
            toast.success(`"${file.name}" starred!`, { id: toastId });
        } catch (error) {
            toast.error("Could not star file", { id: toastId });
        } finally {
            onClose();
        }
    };

    const handleShare    = () => setShowShare(true);
    const handleRename   = () => setShowRename(true);
    const handleMove     = () => setShowMove(true);
    const handleVersions = () => setShowVersions(true);

    const actionMap = {
        download: handleDownload,
        star:     handleStar,
        share:    handleShare,
        rename:   handleRename,
        move:     handleMove,
        delete:   handleDelete,
        versions: handleVersions,
    };

    return (
        <>
            <div
                ref={menuRef}
                style={menuStyle}
                className="w-44 bg-white/90 backdrop-blur-[20px]
                    border border-white/90 rounded-[12px]
                    shadow-[0_8px_28px_rgba(37,99,235,0.12)]
                    overflow-hidden py-1">

                {/* File name header */}
                <div className="flex items-center justify-between
                    px-3 py-2 border-b border-blue-500/6">
                    <p className="text-[11px] font-semibold text-slate-400
                        truncate max-w-[120px]">
                        {file.name}
                    </p>
                    <button
                        onClick={onClose}
                        className="w-4 h-4 flex items-center justify-center
                            text-slate-300 hover:text-slate-500
                            transition-colors flex-shrink-0">
                        <X size={11} />
                    </button>
                </div>

                {/* Menu Items */}
                {menuItems.map(({ label, icon: Icon, style, action, divider }) => (
                    <div key={action}>
                        {divider && <div className="h-px bg-blue-500/6 my-1" />}
                        <button
                            onClick={actionMap[action]}
                            className={`flex items-center gap-2.5 w-full
                                text-left px-3 py-[7px] text-[12.5px] font-medium
                                border border-transparent cursor-pointer
                                transition-all duration-150 ${style}`}>
                            <Icon size={13} className="flex-shrink-0" />
                            {label}
                        </button>
                    </div>
                ))}
            </div>

            {/* ── Modals — portal ── */}
            {showRename && createPortal(
                <RenameModal
                    file={file}
                    onClose={() => { setShowRename(false); onClose(); }}
                    refresh={refresh}
                />,
                document.body
            )}
            {showShare && createPortal(
                <ShareModal
                    file={file}
                    onClose={() => { setShowShare(false); onClose(); }}
                    refresh={refresh}
                />,
                document.body
            )}
            {showMove && createPortal(
                <MoveModal
                    file={file}
                    onClose={() => { setShowMove(false); onClose(); }}
                    refresh={refresh}
                />,
                document.body
            )}
            {showVersions && createPortal(
                <VersionModal
                    file={file}
                    onClose={() => { setShowVersions(false); onClose(); }}
                    refresh={refresh}
                />,
                document.body
            )}
        </>
    );
};

export default FileMenu;