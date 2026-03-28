import { Shield, FileText, Headphones } from "lucide-react";

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="h-auto py-4 sm:h-11 shrink-0 glass-panel-nav border-t border-blue-600/9
            flex flex-col sm:flex-row items-center justify-between
            px-4 sm:px-6 gap-3 sm:gap-4">

            {/* ── Left: Brand + Copyright ── */}
            <div className="flex items-center gap-2">
                <div className="w-[22px] h-[22px] rounded-[6px] flex-shrink-0
                    flex items-center justify-center
                    bg-gradient-to-br from-[#2563eb] to-[#06b6d4]">
                    <img
                        src="/logo.png"
                        alt="Sync Layer"
                        className="w-20 h-20 object-contain brightness-0 invert"
                    />
                </div>

                <span className="text-[12.5px] font-semibold text-gradient-brand">
                    Sync Layer
                </span>

                <div className="w-px h-3 bg-blue-500/15 mx-1" />

                <span className="text-[11.5px] text-slate-400 font-normal">
                    © {year} All rights reserved
                </span>
            </div>

            {/* ── Center: System Status — hidden on very small ── */}
            <div className="hidden md:flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse
                    bg-gradient-to-br from-[#2563eb] to-[#06b6d4]" />
                <span className="text-[11.5px] font-medium text-slate-500">
                    Made with ❤️ by Abujaid Raja
                </span>
            </div>

            {/* ── Right: Links ── */}
            <div className="flex items-center gap-0.5">
                {[
                    { label: "Privacy", icon: Shield     },
                    { label: "Terms",   icon: FileText   },
                    { label: "Support", icon: Headphones },
                ].map(({ label, icon: Icon }, i, arr) => (
                    <div key={label} className="flex items-center">
                        <a
                            href="#"
                            className="flex items-center gap-1 text-[11.5px] font-medium
                                text-slate-400 px-[9px] py-1 rounded-[6px]
                                border border-transparent
                                hover:text-blue-600 hover:bg-blue-600/6
                                hover:border-blue-500/12
                                transition-all duration-150">
                            <Icon size={11} />
                            {label}
                        </a>
                        {i < arr.length - 1 && (
                            <span className="text-slate-300 text-[10px] px-0.5">·</span>
                        )}
                    </div>
                ))}
            </div>
        </footer>
    );
};

export default Footer;