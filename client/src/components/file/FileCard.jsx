import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, FileText, ImageIcon, Video, Music, Archive, File } from "lucide-react";
import FileMenu from "./FileMenu";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const getFileIcon = (mime = "") => {
    if (mime.startsWith("text"))
        return { icon: FileText, style: "bg-slate-500/8 text-slate-500",    label: "Text"    };
    if (mime.includes("pdf"))
        return { icon: FileText, style: "bg-red-500/8 text-red-500",        label: "PDF"     };
    if (mime.startsWith("image"))
        return { icon: ImageIcon, style: "bg-violet-500/8 text-violet-500", label: "Image"   };
    if (mime.startsWith("video"))
        return { icon: Video,    style: "bg-blue-500/8 text-blue-600",      label: "Video"   };
    if (mime.startsWith("audio"))
        return { icon: Music,    style: "bg-emerald-500/8 text-emerald-500",label: "Audio"   };
    if (mime.includes("zip") || mime.includes("rar") || mime.includes("tar"))
        return { icon: Archive,  style: "bg-amber-500/8 text-amber-500",    label: "Archive" };
    return   { icon: File,      style: "bg-slate-500/8 text-slate-500",     label: "File"    };
};

const formatSize = (bytes = 0) => {
    if (bytes < 1024)         return `${bytes} B`;
    if (bytes < 1024 * 1024)  return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 ** 3)    return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
    return                           `${(bytes / 1024 ** 3).toFixed(1)} GB`;
};

const FileCard = ({ file, refresh, onPreview }) => {
    const [menu, setMenu]     = useState(false);
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
    const btnRef              = useRef(null);
    const { icon: Icon, style, label } = getFileIcon(file.mime_type || "");

    // ── Mobile tap support ────────────────────────────────
    const tapTimer = useRef(null);
    const tapCount = useRef(0);

    const handleTap = (e) => {
        tapCount.current += 1;
        if(tapCount.current === 2) {
            clearTimeout(tapTimer.current);
            tapCount.current = 0;
            onPreview(file);
            return;
        }
        tapTimer.current = setTimeout(() =>{
            tapCount.current = 0;
        }, 300);
    };
    const handleContextMenu = (e) => {
        e.preventDefault();
        setMenuPos({
            top: e.clientY,
            left: e.clientX - 176,
        });
        setMenu(true);
    };

    const handleMenuClick = (e) => {
        e.stopPropagation();
        const rect = btnRef.current.getBoundingClientRect();
        setMenuPos({
            top:  rect.bottom + 6,
            left: rect.right - 176,
        });
        setMenu((prev) => !prev);
    };

    return (
        <div
            className="relative bg-white/70 backdrop-blur-[28px]
                border border-white/90 rounded-[14px] p-3 sm:p-[14px]
                cursor-pointer
                hover:shadow-[0_8px_28px_rgba(37,99,235,0.13)]
                hover:-translate-y-1 hover:border-blue-500/15
                transition-all duration-[180ms] active:scale-[0.98]"
            onContextMenu={handleContextMenu}
            onDoubleClick={() => onPreview(file)}
            onClick={handleTap}
        >
            {/* ── Top row: icon + menu button ── */}
            <div className="flex items-start justify-between mb-2.5 sm:mb-3">
                <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-[10px] sm:rounded-[11px]
                    flex items-center justify-center flex-shrink-0 ${style}`}>
                    <Icon size={18} strokeWidth={1.8} className="sm:hidden" />
                    <Icon size={22} strokeWidth={1.8} className="hidden sm:block" />
                </div>

                <button
                    ref={btnRef}
                    onClick={handleMenuClick}
                    className="w-7 h-7 sm:w-[26px] sm:h-[26px] rounded-[7px]
                        flex items-center justify-center flex-shrink-0 cursor-pointer
                        text-slate-400 border border-transparent
                        hover:bg-blue-500/7 hover:border-blue-500/12
                        hover:text-blue-600 transition-all duration-150">
                    <MoreVertical size={14} />
                </button>
            </div>

            {/* ── Name & size ── */}
            <p className="text-[11px] sm:text-[13px] font-semibold
                text-slate-700 truncate mb-[3px]">
                {file.name}
            </p>
            <p className="text-[11px] text-slate-400">
                {formatSize(file.size_bytes)}
            </p>

            {/* ── Footer ── */}
            <div className="flex items-center justify-between mt-2 sm:mt-2.5
                pt-2 sm:pt-2.5 border-t border-blue-500/6">
                <span className={`text-[10px] sm:text-[10.5px] font-medium
                    px-[6px] sm:px-[7px] py-[2px]
                    rounded-[5px] border ${style} border-current/20`}>
                    {label}
                </span>
                <span className="text-[10px] sm:text-[10.5px] text-slate-400">
                    {dayjs(file.created_at).fromNow()}
                </span>
            </div>

            {menu && createPortal(
                <FileMenu
                    file={file}
                    refresh={refresh}
                    onClose={() => setMenu(false)}
                    position={menuPos}
                />,
                document.body
            )}
        </div>
    );
};

export default FileCard;