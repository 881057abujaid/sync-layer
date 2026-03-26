import { Home, ChevronRight } from "lucide-react";

const Breadcrumb = ({ path, onNavigate }) => {
    return (
        <div className="flex items-center gap-1 mb-4 flex-wrap">

            {/* ── Root ── */}
            <button
                onClick={() => onNavigate(null)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[7px]
                    text-[12.5px] font-medium transition-all duration-150 cursor-pointer
                    border border-transparent
                    ${path.length === 0
                        ? "bg-gradient-to-r from-[#2563eb] to-[#06b6d4] bg-clip-text text-transparent font-semibold"
                        : "text-slate-400 hover:text-blue-600 hover:bg-blue-500/6 hover:border-blue-500/12"
                    }`}
            >
                <Home
                    size={12}
                    className={path.length === 0 ? "text-blue-500" : "text-slate-400"}
                />
                My Files
            </button>

            {/* ── Folder Path ── */}
            {path.map((folder, index) => {
                const isLast = index === path.length - 1;
                return (
                    <div key={folder.id} className="flex items-center gap-1">

                        {/* Separator */}
                        <ChevronRight size={13} className="text-slate-300 flex-shrink-0" />

                        {/* Folder */}
                        <button
                            onClick={() => onNavigate(folder.id)}
                            className={`px-2.5 py-1 rounded-[7px]
                                text-[12.5px] font-medium transition-all duration-150
                                cursor-pointer border border-transparent max-w-[120px]
                                sm:max-w-none truncate
                                ${isLast
                                    ? "bg-gradient-to-r from-[#2563eb] to-[#06b6d4] bg-clip-text text-transparent font-semibold"
                                    : "text-slate-400 hover:text-blue-600 hover:bg-blue-500/6 hover:border-blue-500/12"
                                }`}
                        >
                            {folder.name}
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default Breadcrumb;