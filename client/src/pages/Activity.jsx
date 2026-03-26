import useActivity from "../hooks/useActivity";
import DashboardLayout from "../components/layout/DashboardLayout";
import ActivityItem from "../components/activity/ActivityItem";
import { Activity as ActivityIcon } from "lucide-react";

const Activity = () => {
    const { activities } = useActivity();

    return (
        <DashboardLayout>

            {/* ── Page Title ── */}
            <h1 className="text-[20px] font-bold tracking-tight mb-5
                bg-gradient-to-r from-[#2563eb] to-[#06b6d4]
                bg-clip-text text-transparent">
                Activity
            </h1>

            {/* ── Activity Card ── */}
            <div className="bg-white/70 backdrop-blur-[28px]
                border border-white/90 rounded-[16px]
                shadow-[0_4px_24px_rgba(37,99,235,0.07)]
                overflow-hidden">

                {/* Card Header */}
                <div className="flex items-center justify-between
                    px-[18px] py-[13px]
                    border-b border-blue-500/7">
                    <span className="text-[12px] font-semibold text-slate-500
                        uppercase tracking-[0.4px]">
                        Recent Actions
                    </span>
                    {activities.length > 0 && (
                        <span className="text-[11px] font-semibold
                            px-[9px] py-[2px] rounded-full
                            border border-blue-500/12
                            bg-gradient-to-r from-blue-500/8 to-cyan-500/8
                            bg-gradient-to-r from-[#2563eb] to-[#06b6d4]
                            bg-clip-text text-transparent">
                            {activities.length} activities
                        </span>
                    )}
                </div>

                {/* Empty State */}
                {activities.length === 0 && (
                    <div className="flex flex-col items-center justify-center
                        py-12 gap-3">
                        <div className="w-11 h-11 rounded-[12px] flex items-center
                            justify-center
                            bg-gradient-to-br from-blue-500/8 to-cyan-500/8">
                            <ActivityIcon size={20} className="text-blue-400" />
                        </div>
                        <p className="text-[14px] font-medium text-slate-400">
                            No recent activity
                        </p>
                        <p className="text-[12px] text-slate-300">
                            Your actions will appear here
                        </p>
                    </div>
                )}

                {/* Activity List */}
                {activities.map((activity) => (
                    <ActivityItem
                        key={activity.id}
                        activity={activity}
                    />
                ))}
            </div>
        </DashboardLayout>
    );
};

export default Activity;