import { useState, useEffect } from "react";
import {
    User, Lock, HardDrive, AlertTriangle,
    Save, Eye, EyeOff, CheckCircle2
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StorageUsage from "../../components/StorageUsage";
import useAuth from "../../hooks/useAuth";
import { api } from "../../services/api";
import toast from "react-hot-toast";

// ── Section Sidebar Item ──────────────────────────────────
const SidebarItem = ({ icon: Icon, label, active, onClick, danger }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 w-full px-[10px] py-2
            rounded-[9px] text-[12.5px] font-medium border cursor-pointer
            transition-all duration-150
            ${danger
                ? "text-red-400 border-transparent hover:bg-red-500/6 hover:border-red-400/12"
                : active
                    ? "bg-gradient-to-r from-[#2563eb]/10 to-[#06b6d4]/8 text-blue-600 border-blue-500/18"
                    : "text-slate-500 border-transparent hover:bg-blue-500/6 hover:text-blue-600"
            }`}>
        <Icon size={13} className="flex-shrink-0" />
        {label}
    </button>
);

// ── Section Card ──────────────────────────────────────────
const SectionCard = ({ icon: Icon, title, danger, children }) => (
    <div className={`bg-white/70 backdrop-blur-[28px] rounded-[14px] p-5
        border shadow-[0_2px_12px_rgba(37,99,235,0.05)]
        ${danger
            ? "border-red-400/12 bg-white/60"
            : "border-white/90"
        }`}>
        <div className="flex items-center gap-2 mb-4">
            <Icon size={14} className={danger ? "text-red-400" : "text-blue-600"} />
            <h3 className={`text-[13.5px] font-semibold
                ${danger ? "text-red-400" : "text-slate-700"}`}>
                {title}
            </h3>
        </div>
        {children}
    </div>
);

// ── Field ─────────────────────────────────────────────────
const Field = ({ label, children }) => (
    <div className="flex flex-col gap-[5px]">
        <label className="text-[11.5px] font-semibold text-slate-500">
            {label}
        </label>
        {children}
    </div>
);

const inputClass = `w-full h-[40px] rounded-[9px] px-3
    text-[13px] text-slate-700
    bg-white/80 border border-blue-500/15
    placeholder:text-slate-400
    focus:outline-none focus:border-blue-500/40
    focus:bg-white/95 focus:ring-[3px] focus:ring-blue-500/8
    transition-all duration-150`;

// ── Save Button ───────────────────────────────────────────
const SaveButton = ({ loading, done, label = "Save Changes" }) => (
    <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-1.5 h-9 px-4 mt-2
            rounded-[9px] cursor-pointer
            bg-gradient-to-r from-[#2563eb] to-[#06b6d4]
            text-white text-[12.5px] font-semibold
            shadow-[0_2px_10px_rgba(37,99,235,0.25)]
            hover:shadow-[0_4px_16px_rgba(37,99,235,0.38)]
            hover:-translate-y-px active:translate-y-0
            disabled:opacity-60 disabled:cursor-not-allowed
            disabled:hover:translate-y-0
            transition-all duration-150">
        {loading ? (
            <svg className="animate-spin" width="13" height="13"
                viewBox="0 0 24 24" fill="none" stroke="white"
                strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/>
            </svg>
        ) : done ? (
            <CheckCircle2 size={13} />
        ) : (
            <Save size={13} />
        )}
        {loading ? "Saving..." : done ? "Saved!" : label}
    </button>
);

// ── Main Component ────────────────────────────────────────
const Settings = () => {
    const { user, logout } = useAuth();
    const [activeSection, setActiveSection] = useState("profile");
    const [breakdown, setBreakdown] = useState(null);

    // Profile state
    const [name, setName]           = useState(user?.name      || "");
    const [email, setEmail]         = useState(user?.email     || "");
    const [imageUrl, setImageUrl]   = useState(user?.image_url || "");
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileDone,    setProfileDone]    = useState(false);

    // Password state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword,     setNewPassword]     = useState("");
    const [showCurrent,     setShowCurrent]     = useState(false);
    const [showNew,         setShowNew]         = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordDone,    setPasswordDone]    = useState(false);
    const [passwordError,   setPasswordError]   = useState("");

    // Delete state
    const [deleteConfirm, setDeleteConfirm] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        if(activeSection === "storage"){
            api.get("/storage/breakdown")
            .then(res =>{
                setBreakdown(res.data.data);
            })
            .catch(() => toast.error("Could not load storage breakdown"));
        }
    }, [activeSection]);

    // ── Handlers ─────────────────────────────────────────
    const handleProfileSave = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            if (avatarFile) {
                formData.append("avatar", avatarFile);
            }

            await api.put("/auth/profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setProfileDone(true);
            toast.success("Profile updated successfully!");
            setTimeout(() => setProfileDone(false), 2500);
        } catch (error) {
            const msg = error?.response?.data?.error || "Failed to update profile";
            toast.error(msg);
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordSave = async (e) => {
        e.preventDefault();
        setPasswordError("");
        if (newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters");
            return;
        }
        setPasswordLoading(true);
        try {
            await api.put("/auth/password", { currentPassword, newPassword });
            setPasswordDone(true);
            toast.success("Password updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setTimeout(() => setPasswordDone(false), 2500);
        } catch (error) {
            const msg = error?.response?.data?.error || "Failed to update password";
            setPasswordError(msg);
            toast.error(msg);
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirm !== "DELETE") return;
        setDeleteLoading(true);
        const toastId = toast.loading("Deleting account...");
        try {
            await api.delete("/auth/account");
            toast.success("Account deleted!", { id: toastId });
            logout();
        } catch (error) {
            toast.error("Failed to delete account", { id: toastId });
        } finally {
            setDeleteLoading(false);
        }
    };

    // ── Initials ──────────────────────────────────────────
    const initials = (name || email || "SL")
        .split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

    const sections = [
        { id: "profile",  icon: User,         label: "Profile"      },
        { id: "password", icon: Lock,         label: "Password"     },
        { id: "storage",  icon: HardDrive,    label: "Storage"      },
        { id: "danger",   icon: AlertTriangle, label: "Danger Zone", danger: true },
    ];

    const formatBytes = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
    };

    const storageCards = [
        { label: "Images",     color: "bg-violet-500/10 text-violet-600",   value: formatBytes(breakdown?.images || 0) },
        { label: "Videos",     color: "bg-blue-500/10 text-blue-600",       value: formatBytes(breakdown?.videos || 0) },
        { label: "Documents",  color: "bg-emerald-500/10 text-emerald-600", value: formatBytes(breakdown?.documents || 0) },
        { label: "Others",     color: "bg-orange-500/10 text-orange-600",   value: formatBytes(breakdown?.others || 0) },
    ];

    return (
        <DashboardLayout>
            <h1 className="text-[20px] font-bold tracking-tight mb-5
                bg-gradient-to-r from-[#2563eb] to-[#06b6d4]
                bg-clip-text text-transparent">
                Settings
            </h1>

            <div className="flex gap-5">

                {/* ── Settings Sidebar ── */}
                <aside className="w-[168px] flex-shrink-0 flex flex-col
                    bg-white/70 backdrop-blur-[28px]
                    border border-white/90 rounded-[14px]
                    shadow-[0_2px_12px_rgba(37,99,235,0.05)]
                    p-2 self-start">
                    {sections.map(({ id, icon, label, danger }) => (
                        <div key={id}>
                            {id === "danger" && (
                                <div className="h-px bg-red-400/10 my-1.5" />
                            )}
                            <SidebarItem
                                icon={icon}
                                label={label}
                                active={activeSection === id}
                                danger={danger}
                                onClick={() => setActiveSection(id)}
                            />
                        </div>
                    ))}
                </aside>

                {/* ── Settings Content ── */}
                <div className="flex-1 flex flex-col gap-4 min-w-0">

                    {/* ── Profile ── */}
                    {activeSection === "profile" && (
                        <SectionCard icon={User} title="Profile">
                            {/* Avatar */}
                            <div className="flex items-center gap-3 mb-5">
                                <div className="relative group">
                                    <div className="w-14 h-14 rounded-[14px] flex-shrink-0
                                        flex items-center justify-center overflow-hidden
                                        bg-gradient-to-br from-[#2563eb] to-[#06b6d4]
                                        text-white text-[20px] font-bold
                                        shadow-[0_4px_14px_rgba(37,99,235,0.3)]">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            initials
                                        )}
                                    </div>
                                    <label className="absolute inset-0 cursor-pointer flex items-center justify-center
                                        bg-black/40 text-white opacity-0 group-hover:opacity-100
                                        rounded-[14px] transition-opacity duration-200">
                                        <span className="text-[10px] font-bold">UPLOAD</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setAvatarFile(file);
                                                    setAvatarPreview(URL.createObjectURL(file));
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                                <div>
                                    <p className="text-[13.5px] font-semibold text-slate-700">
                                        {name || "Your Name"}
                                    </p>
                                    <p className="text-[12px] text-slate-400">
                                        {email}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleProfileSave}
                                className="flex flex-col gap-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Field label="Full Name">
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your name"
                                            className={inputClass}
                                        />
                                    </Field>
                                    <Field label="Email Address">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className={inputClass}
                                        />
                                    </Field>
                                </div>
                                <SaveButton
                                    loading={profileLoading}
                                    done={profileDone}
                                />
                            </form>
                        </SectionCard>
                    )}

                    {/* ── Password ── */}
                    {activeSection === "password" && (
                        <SectionCard icon={Lock} title="Change Password">
                            <form onSubmit={handlePasswordSave}
                                className="flex flex-col gap-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Current Password">
                                        <div className="relative">
                                            <input
                                                type={showCurrent ? "text" : "password"}
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className={`${inputClass} pr-10`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrent((p) => !p)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2
                                                    text-slate-400 hover:text-blue-500
                                                    transition-colors cursor-pointer">
                                                {showCurrent
                                                    ? <EyeOff size={14} />
                                                    : <Eye size={14} />}
                                            </button>
                                        </div>
                                    </Field>
                                    <Field label="New Password">
                                        <div className="relative">
                                            <input
                                                type={showNew ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Min 8 characters"
                                                className={`${inputClass} pr-10`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNew((p) => !p)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2
                                                    text-slate-400 hover:text-blue-500
                                                    transition-colors cursor-pointer">
                                                {showNew
                                                    ? <EyeOff size={14} />
                                                    : <Eye size={14} />}
                                            </button>
                                        </div>
                                    </Field>
                                </div>

                                {/* Password strength */}
                                {newPassword.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div key={i}
                                                    className={`h-1 w-8 rounded-full transition-all duration-300
                                                        ${newPassword.length >= i * 3
                                                            ? i <= 1 ? "bg-red-400"
                                                            : i <= 2 ? "bg-amber-400"
                                                            : i <= 3 ? "bg-blue-400"
                                                            : "bg-emerald-400"
                                                            : "bg-slate-200"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[11px] text-slate-400">
                                            {newPassword.length < 4  ? "Weak"
                                            : newPassword.length < 7  ? "Fair"
                                            : newPassword.length < 10 ? "Good"
                                            : "Strong"}
                                        </span>
                                    </div>
                                )}

                                {passwordError && (
                                    <p className="text-[11.5px] text-red-400 font-medium">
                                        {passwordError}
                                    </p>
                                )}

                                <SaveButton
                                    loading={passwordLoading}
                                    done={passwordDone}
                                    label="Update Password"
                                />
                            </form>
                        </SectionCard>
                    )}

                    {/* ── Storage ── */}
                    {activeSection === "storage" && (
                        <SectionCard icon={HardDrive} title="Storage Usage">
                            <StorageUsage />
                            <div className="mt-3 grid grid-cols-4 gap-3">
                                {storageCards.map(({ label, color, value }) =>(
                                    <div key={label}
                                        className={`${color} rounded-[10px] px-3 py-2.5 border border-current/10`}
                                    >
                                        <p className="text-[11px] font-semiboold opacity-70">
                                            {label}
                                        </p>
                                        <p className="text-[13px] font-bold mt-0.5">
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    )}

                    {/* ── Danger Zone ── */}
                    {activeSection === "danger" && (
                        <SectionCard icon={AlertTriangle} title="Danger Zone" danger>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start justify-between
                                    gap-4 pb-4 border-b border-red-400/8">
                                    <div>
                                        <p className="text-[13px] font-semibold text-slate-600">
                                            Delete Account
                                        </p>
                                        <p className="text-[12px] text-slate-400 mt-0.5">
                                            Permanently delete your account and all associated data.
                                            This action cannot be undone.
                                        </p>
                                    </div>
                                </div>

                                <Field label={`Type "DELETE" to confirm`}>
                                    <input
                                        type="text"
                                        value={deleteConfirm}
                                        onChange={(e) => setDeleteConfirm(e.target.value)}
                                        placeholder="DELETE"
                                        className={`${inputClass} border-red-400/20
                                            focus:border-red-400/40
                                            focus:ring-red-400/8`}
                                    />
                                </Field>

                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteConfirm !== "DELETE" || deleteLoading}
                                    className="flex items-center gap-1.5 h-9 px-4
                                        w-fit rounded-[9px] cursor-pointer
                                        bg-red-500 text-white
                                        text-[12.5px] font-semibold
                                        shadow-[0_2px_10px_rgba(239,68,68,0.25)]
                                        hover:shadow-[0_4px_16px_rgba(239,68,68,0.38)]
                                        hover:-translate-y-px active:translate-y-0
                                        disabled:opacity-40 disabled:cursor-not-allowed
                                        disabled:hover:translate-y-0
                                        transition-all duration-150">
                                    {deleteLoading ? (
                                        <svg className="animate-spin" width="13" height="13"
                                            viewBox="0 0 24 24" fill="none" stroke="white"
                                            strokeWidth="2.5" strokeLinecap="round">
                                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/>
                                        </svg>
                                    ) : (
                                        <AlertTriangle size={13} />
                                    )}
                                    Delete My Account
                                </button>
                            </div>
                        </SectionCard>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;