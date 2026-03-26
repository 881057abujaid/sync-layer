import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
    Upload, Trash2, RotateCcw, Pencil,
    Share2, FolderInput, Download
} from "lucide-react";

dayjs.extend(relativeTime);

const actionConfig = {
    upload:   { label: "uploaded",   icon: Upload,      style: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-blue-600"   },
    delete:   { label: "deleted",    icon: Trash2,      style: "bg-red-500/8 text-red-500"          },
    restore:  { label: "restored",   icon: RotateCcw,   style: "bg-emerald-500/8 text-emerald-500"  },
    rename:   { label: "renamed",    icon: Pencil,      style: "bg-amber-500/8 text-amber-500"      },
    share:    { label: "shared",     icon: Share2,      style: "bg-violet-500/8 text-violet-500"    },
    move:     { label: "moved",      icon: FolderInput, style: "bg-cyan-500/10 text-cyan-600"       },
    download: { label: "downloaded", icon: Download,    style: "bg-emerald-500/8 text-emerald-500"  },
};

const ActivityItem = ({ activity }) => {
    const config = actionConfig[activity.action] ?? {
        label: activity.action,
        icon: Upload,
        style: "bg-blue-500/8 text-blue-500",
    };
    const Icon = config.icon;

    return (
        <div className="flex items-center gap-3 sm:gap-3.5 px-4 sm:px-[18px] py-3 sm:py-[13px]
            border-b border-blue-500/6 last:border-none
            hover:bg-blue-500/[0.02] transition-colors duration-150">

            {/* Action Icon */}
            <div className={`w-9 h-9 rounded-[10px] flex items-center
                justify-center flex-shrink-0 ${config.style}`}>
                <Icon size={16} />
            </div>

            {/* Body */}
            <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-medium text-slate-600
                    truncate">
                    You {config.label}{" "}
                    <span className="font-semibold
                        bg-gradient-to-r from-[#2563eb] to-[#06b6d4]
                        bg-clip-text text-transparent">
                        {activity.context?.name}
                    </span>
                </p>
                <div className="mt-[3px]">
                    <span className="inline-flex items-center text-[11px]
                        font-medium text-blue-600 px-[7px] py-[1px]
                        rounded-[5px] border border-blue-500/10
                        bg-blue-500/6">
                        {activity.resource_type}
                    </span>
                </div>
            </div>

            {/* Timestamp */}
            <span className="text-[11px] text-slate-400 whitespace-nowrap
                flex-shrink-0">
                {dayjs(activity.created_at).fromNow()}
            </span>
        </div>
    );
};

export default ActivityItem;