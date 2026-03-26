import { NavLink } from "react-router-dom";
import { Folder, Share2, Star, Trash2, Activity } from "lucide-react";
import logo from "/logo.png";
import StorageUsage from "../StorageUsage"; // import karo

const storageLinks = [
    { to: "/dashboard", label: "My Files", icon: Folder  },
    { to: "/shared",    label: "Shared",   icon: Share2  },
    { to: "/starred",   label: "Starred",  icon: Star    },
];
const manageLinks = [
    { to: "/trash",    label: "Trash",    icon: Trash2   },
    { to: "/activity", label: "Activity", icon: Activity },
];

const navItemClass = ({ isActive }) =>
    `flex items-center gap-[10px] px-3 py-[9px] rounded-[10px]
     text-[13.5px] font-medium border transition-all duration-[150ms]
     ${isActive
        ? "bg-gradient-to-r from-blue-600/11 to-cyan-400/9 text-blue-600 border-blue-500/20"
        : "text-slate-500 border-transparent hover:bg-blue-600/7 hover:text-blue-600 hover:border-blue-500/15 hover:translate-x-0.5"
     }`;

const SectionLabel = ({ children }) => (
    <p className="text-[10px] font-semibold text-slate-400 uppercase
        tracking-[0.9px] px-3 pt-2 pb-[5px]">
        {children}
    </p>
);

const Sidebar = ({ isOpen, onClose }) => {
    return (
        <>
            {/* ── Overlay for mobile ── */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed lg:static inset-y-0 left-0 z-[120]
                w-[242px] h-screen flex flex-col
                glass-panel-nav border-r border-white/90
                transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>

            {/* ── Logo ── */}
            <div className="px-[18px] py-[18px] flex items-center gap-[11px]
                border-b border-blue-600/9">
                <div className="w-9 h-9 rounded-[10px] flex-shrink-0 flex
                    items-center justify-center
                    bg-gradient-to-br from-[#2563eb] to-[#06b6d4]
                    shadow-[0_2px_10px_rgba(37,99,235,0.25)]">
                    <img
                        src={logo}
                        alt="Sync Layer"
                        className="w-[80px] h-[80px] object-contain brightness-0 invert"
                    />
                </div>
                <h1 className="text-[15px] font-semibold tracking-tight
                    text-gradient-brand">
                    Sync Layer
                </h1>
            </div>

            {/* ── Navigation ── */}
            <nav className="flex-1 px-[10px] py-3 flex flex-col gap-0.5">
                <SectionLabel>Storage</SectionLabel>
                {storageLinks.map(({ to, label, icon: Icon }) => (
                    <NavLink key={to} to={to} className={navItemClass}>
                        <Icon size={16} className="flex-shrink-0" />
                        {label}
                    </NavLink>
                ))}

                <SectionLabel>Manage</SectionLabel>
                {manageLinks.map(({ to, label, icon: Icon }) => (
                    <NavLink key={to} to={to} className={navItemClass}>
                        <Icon size={16} className="flex-shrink-0" />
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* ── Storage Usage — dynamic, component se ── */}
            <div className="px-3 py-3 border-t border-blue-600/8">
                <StorageUsage />
            </div>
        </aside>
    </>
    );
};

export default Sidebar;