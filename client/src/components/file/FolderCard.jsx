import { Folder } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const FolderCard = ({ folder, onOpen }) => {
    return (
        <div
            onDoubleClick={() => onOpen(folder)}
            className="relative glass-panel rounded-[14px] p-[14px]
                cursor-pointer hover:shadow-[0_8px_28px_rgba(37,99,235,0.13)]
                hover:-translate-y-1 hover:border-blue-500/15
                transition-all duration-[180ms]">

            {/* ── Top row: icon ── */}
            <div className="flex items-start justify-between mb-3">
                <div className="icon-box rounded-[11px] w-11 h-11">
                    <Folder
                        size={22}
                        strokeWidth={1.8}
                        className="text-blue-600"
                    />
                </div>

                {/* Folder badge */}
                <span className="text-[10.5px] font-medium px-[7px] py-[2px]
                    rounded-[5px] border border-blue-500/12
                    bg-blue-500/6 text-blue-600">
                    Folder
                </span>
            </div>

            {/* ── Name ── */}
            <p className="text-[13px] font-semibold text-slate-700
                truncate mb-[3px]">
                {folder.name}
            </p>

            {/* ── Footer ── */}
            <div className="flex items-center justify-between mt-2.5 pt-2.5
                border-t border-blue-500/6">
                <span className="text-[11px] text-slate-400">
                    {folder.item_count ?? 0}{" "}
                    {(folder.item_count ?? 0) === 1 ? "item" : "items"}
                </span>
                <span className="text-[10.5px] text-slate-400">
                    {dayjs(folder.created_at).fromNow()}
                </span>
            </div>
        </div>
    );
};

export default FolderCard;