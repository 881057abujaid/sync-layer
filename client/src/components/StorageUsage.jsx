import { useEffect, useState } from "react";
import { HardDrive, TrendingUp, Zap } from "lucide-react";
import { getStorageUsage } from "../services/storage.service";
import toast from "react-hot-toast";

// ── Bytes → human readable ────────────────────────────────
const formatBytes = (bytes = 0) => {
    if (bytes < 1024)       return `${bytes} B`;
    if (bytes < 1024 ** 2)  return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 ** 3)  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
    if (bytes < 1024 ** 4)  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
    return                          `${(bytes / 1024 ** 4).toFixed(1)} TB`;
};

const getBarColor = (percent) => {
    if (percent >= 90) return "from-red-500 to-red-400";
    if (percent >= 70) return "from-amber-500 to-amber-400";
    return "from-[#2563eb] to-[#06b6d4]";
};

const getBadgeStyle = (percent) => {
    if (percent >= 90) return "bg-red-500/8 text-red-500 border-red-400/15";
    if (percent >= 70) return "bg-amber-500/8 text-amber-500 border-amber-400/15";
    return "bg-blue-500/6 text-blue-600 border-blue-400/15";
};

const StorageUsage = () => {
    const [storage, setStorage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const data = await getStorageUsage();
            setStorage(data);

            // ── Storage Warning Toast ────────────────────────────────
            const percent = Math.round((data.storage_used / data.storage_limit) * 100);

            if (percent >= 90) {
                toast.error("Storage almost full! Delete files to free up space.", {
                    duration: 5000,
                    id: "storage-warning",
                });
            } else if (percent >= 70) {
                toast.error("Storage running low! Consider cleaning up.", {
                    duration: 4000,
                    id: "storage-warning",
                });
            }
        } catch (error) {
            console.error("Error loading storage", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="h-[72px] mb-4 rounded-[14px] glass-panel animate-pulse" />
    );

    if (!storage) return null;

    const percent    = Math.min(
        Math.round((storage.storage_used / storage.storage_limit) * 100), 100
    );
    const barColor   = getBarColor(percent);
    const badgeStyle = getBadgeStyle(percent);

    return (
        <div className="flex items-center gap-4 px-4 py-3 mb-2 rounded-[14px] glass-panel">

            {/* ── Icon ── */}
            <div className="icon-box rounded-[10px] w-9 h-9">
                <HardDrive size={17} className="text-blue-600" />
            </div>

            {/* ── Bar + Labels ── */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-[6px]">
                    <p className="text-[12px] font-semibold text-slate-500">
                        Storage
                    </p>
                    <div className="flex items-center gap-1.5">
                        {percent >= 70 && (
                            <span className={`flex items-center gap-1
                                text-[10px] font-semibold px-2 py-0.5
                                rounded-full border ${badgeStyle}`}>
                                {percent >= 90
                                    ? <><Zap size={9} /> Almost full</>
                                    : <><TrendingUp size={9} /> Running low</>
                                }
                            </span>
                        )}
                        <span className={`text-[10px] font-semibold
                            px-2 py-0.5 rounded-full border ${badgeStyle}`}>
                            {percent}%
                        </span>
                    </div>
                </div>

                {/* Bar */}
                <div className="w-full h-[5px] bg-blue-500/10 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full bg-gradient-to-r
                            ${barColor} transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                    />
                </div>

                {/* Meta */}
                <p className="text-[11px] text-slate-400 mt-1">
                    {formatBytes(storage.storage_used)} of{" "}
                    {formatBytes(storage.storage_limit)} used
                </p>
            </div>
        </div>
    );
};

export default StorageUsage;