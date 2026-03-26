import { Upload, Bell, Settings, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import SearchBar from "../search/SearchBar";
import toast from "react-hot-toast";

const Navbar = ({ onPreview, openFolder, onMenuClick }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // User initials for avatar
    const initials = user?.email
        ? user.email.slice(0, 2).toUpperCase()
        : "SL";

    return (
        <header className="h-16 shrink-0 relative z-[100] glass-panel-nav border-b border-blue-600/9
            flex items-center justify-between px-4 sm:px-6 gap-3 sm:gap-4">

            {/* ── Mobile Menu Toggle ── */}
            <button
                onClick={onMenuClick}
                className="lg:hidden w-9 h-9 rounded-[9px] flex items-center justify-center
                    text-slate-500 hover:bg-blue-600/7 hover:text-blue-600
                    transition-all duration-150 cursor-pointer"
            >
                <Menu size={20} />
            </button>

            {/* ── Search ── */}
            <div className="flex-1 max-w-[700px] min-w-0">
                <SearchBar onPreview={onPreview} openFolder={openFolder} />
            </div>

            {/* ── Right Side ── */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">

                {/* Settings — hide on tiny */}
                <button
                    title="Settings"
                    onClick={() => navigate("/settings")}
                    className="hidden xs:flex w-9 h-9 sm:w-9 sm:h-9 rounded-[9px] items-center justify-center
                        text-slate-500 border border-transparent
                        hover:bg-blue-600/7 hover:border-blue-500/12 hover:text-blue-600
                        transition-all duration-150 cursor-pointer"
                >
                    <Settings size={16} />
                </button>

                {/* Divider */}
                <div className="w-px h-[22px] bg-blue-600/10 mx-1" />

                {/* User avatar + email */}
                <div className="flex items-center gap-2 px-1.5 py-1 rounded-[10px]
                    border border-transparent cursor-pointer
                    hover:bg-blue-600/6 hover:border-blue-500/10
                    transition-all duration-150">
                    <div className="w-[30px] h-[30px] rounded-[8px] flex-shrink-0
                        flex items-center justify-center overflow-hidden
                        bg-gradient-to-br from-[#2563eb] to-[#06b6d4]
                        text-white text-[12px] font-semibold">
                        {user?.image_url ? (
                            <img
                                src={user.image_url}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = ""; // Fallback will show initials if src is empty
                                }}
                            />
                        ) : (
                            initials
                        )}
                    </div>
                    <p className="text-[12.5px] font-medium text-slate-500
                        hidden sm:block max-w-[160px]
                        overflow-hidden text-ellipsis whitespace-nowrap">
                        {user?.email}
                    </p>
                </div>

                {/* Logout */}
                <button
                    onClick={() => {
                        toast.success("Logged out successfully");
                        logout();
                    }}
                    className="flex items-center gap-1.5 h-[34px] px-[13px]
                        rounded-[9px] border cursor-pointer
                        transition-all duration-150 group
                        border-blue-500/20 bg-gradient-to-r from-[#2563eb]/7 to-[#06b6d4]/7
                        hover:from-[#2563eb] hover:to-[#06b6d4]
                        hover:border-transparent hover:shadow-[0_2px_12px_rgba(37,99,235,0.35)]"
                >

                    <LogOut
                        size={13}
                        className="flex-shrink-0 text-blue-600
                        group-hover:text-white transition-colors duration-150"
                    />
                    <span className="hidden md:block text-[12.5px] font-semibold text-gradient-brand
                        group-hover:text-white group-hover:[background:none]
                        group-hover:[-webkit-text-fill-color:white]
                        transition-all duration-150"
                    >
                        Logout
                    </span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;