import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { User, Mail, Lock, UserPlus } from "lucide-react";
import * as authService from "../../services/auth.service";
import { useNavigate, Link } from "react-router-dom";
import logo from "/logo.png";

// ── Validation Schema ─────────────────────────────────────
const schema = yup.object({
    name: yup
        .string()
        .min(2, "Name must be at least 2 characters")
        .required("Name is required"),
    email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
    password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Must contain at least one uppercase letter")
        .matches(/[0-9]/, "Must contain at least one number")
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords do not match")
        .required("Please confirm your password"),
});

const Register = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const password = watch("password", "");

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const onSubmit = async (data) => {
        const toastId = toast.loading("Creating your account...");
        try {
            await authService.registerUser({
                name:     data.name,
                email:    data.email,
                password: data.password,
            }, avatarFile);
            toast.success("Account created! Please sign in.", { id: toastId });
            navigate("/login");
        } catch (error) {
            const msg = error?.response?.data?.error || "Registration failed";
            toast.error(msg, { id: toastId });
        }
    };

    // Password strength
    const getStrength = (pwd) => {
        if (!pwd) return 0;
        if (pwd.length < 4)  return 1;
        if (pwd.length < 7)  return 2;
        if (pwd.length < 10) return 3;
        return 4;
    };

    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
    const strengthColor = [
        "", "bg-red-400", "bg-amber-400",
        "bg-blue-400", "bg-emerald-400"
    ];
    const strength = getStrength(password);

    const inputClass = (hasError) =>
        `w-full h-[42px] rounded-[10px] pl-[38px] pr-3
        text-[13.5px] text-slate-700 bg-white/80 border
        placeholder:text-slate-400
        focus:outline-none focus:bg-white/95
        focus:ring-[3px] transition-all duration-150
        ${hasError
            ? "border-red-400/50 focus:border-red-400 focus:ring-red-400/8"
            : "border-blue-500/15 focus:border-blue-500/40 focus:ring-blue-500/8"
        }`;

    return (
        <div className="h-screen flex items-center justify-center overflow-hidden
            bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative">

            {/* ── Background Orbs ── */}
            <div className="absolute top-[-80px] right-[-80px] w-[320px] h-[320px]
                rounded-full pointer-events-none
                bg-[radial-gradient(circle,rgba(37,99,235,0.12),transparent_70%)]" />
            <div className="absolute bottom-[-60px] left-[-60px] w-[280px] h-[280px]
                rounded-full pointer-events-none
                bg-[radial-gradient(circle,rgba(6,182,212,0.1),transparent_70%)]" />

            {/* ── Glass Card ── */}
            <div className="w-[380px] relative z-10
                bg-white/70 backdrop-blur-[32px]
                border border-white/90 rounded-[20px]
                shadow-[0_8px_32px_rgba(37,99,235,0.08)]
                px-8 py-9">

                {/* Logo */}
                <div className="flex flex-col items-center gap-2.5 mb-7">
                    <div className="w-12 h-12 rounded-[14px] flex items-center
                        justify-center
                        bg-gradient-to-br from-[#2563eb] to-[#06b6d4]
                        shadow-[0_4px_16px_rgba(37,99,235,0.3)]">
                        <img src={logo} alt="Sync Layer"
                            className="w-20 h-20 object-contain brightness-0 invert" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-[22px] font-bold tracking-tight
                            bg-gradient-to-r from-[#2563eb] to-[#06b6d4]
                            bg-clip-text text-transparent">
                            Create Account
                        </h1>
                        <p className="text-[13px] text-slate-400 mt-0.5">
                            Join Sync Layer — your cloud storage
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-3">

                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center gap-2 mb-2">
                        <div className="relative group">
                            <div className="w-[70px] h-[70px] rounded-[18px] overflow-hidden
                                border-2 border-blue-500/20 bg-blue-50/50
                                flex items-center justify-center transition-all duration-200
                                group-hover:border-blue-500/40">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="text-blue-500/40" size={30} />
                                )}
                            </div>
                            <label className="absolute inset-0 cursor-pointer flex items-center justify-center
                                bg-black/40 text-white opacity-0 group-hover:opacity-100
                                rounded-[18px] transition-opacity duration-200">
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
                        <p className="text-[11px] text-slate-400 font-medium">Profile Picture (Optional)</p>
                    </div>

                    {/* Name */}
                    <div className="flex flex-col gap-[5px]">
                        <label className="text-[12px] font-semibold
                            text-slate-500 tracking-[0.2px]">
                            Full name
                        </label>
                        <div className="relative">
                            <User size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2
                                    text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="John Smith"
                                {...register("name")}
                                className={inputClass(errors.name)}
                            />
                        </div>
                        {errors.name && (
                            <p className="text-[11.5px] text-red-400 font-medium">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-[5px]">
                        <label className="text-[12px] font-semibold
                            text-slate-500 tracking-[0.2px]">
                            Email address
                        </label>
                        <div className="relative">
                            <Mail size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2
                                    text-slate-400 pointer-events-none" />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                {...register("email")}
                                className={inputClass(errors.email)}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-[11.5px] text-red-400 font-medium">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-[5px]">
                        <label className="text-[12px] font-semibold
                            text-slate-500 tracking-[0.2px]">
                            Password
                        </label>
                        <div className="relative">
                            <Lock size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2
                                    text-slate-400 pointer-events-none" />
                            <input
                                type="password"
                                placeholder="Min 8 characters"
                                {...register("password")}
                                className={inputClass(errors.password)}
                            />
                        </div>

                        {/* Strength bar */}
                        {password.length > 0 && (
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i}
                                            className={`h-1 w-8 rounded-full
                                                transition-all duration-300
                                                ${strength >= i
                                                    ? strengthColor[strength]
                                                    : "bg-slate-200"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-[11px] text-slate-400">
                                    {strengthLabel[strength]}
                                </span>
                            </div>
                        )}

                        {errors.password && (
                            <p className="text-[11.5px] text-red-400 font-medium">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col gap-[5px]">
                        <label className="text-[12px] font-semibold
                            text-slate-500 tracking-[0.2px]">
                            Confirm password
                        </label>
                        <div className="relative">
                            <Lock size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2
                                    text-slate-400 pointer-events-none" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                {...register("confirmPassword")}
                                className={inputClass(errors.confirmPassword)}
                            />
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-[11.5px] text-red-400 font-medium">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-11 mt-1 rounded-[10px] cursor-pointer
                            flex items-center justify-center gap-2
                            bg-gradient-to-r from-[#2563eb] to-[#06b6d4]
                            text-white text-[14px] font-semibold
                            shadow-[0_2px_12px_rgba(37,99,235,0.3)]
                            hover:shadow-[0_4px_20px_rgba(37,99,235,0.45)]
                            hover:-translate-y-px active:translate-y-0
                            disabled:opacity-60 disabled:cursor-not-allowed
                            disabled:hover:translate-y-0
                            transition-all duration-150">
                        {isSubmitting ? (
                            <svg className="animate-spin" width="15" height="15"
                                viewBox="0 0 24 24" fill="none" stroke="white"
                                strokeWidth="2.5" strokeLinecap="round">
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/>
                            </svg>
                        ) : (
                            <UserPlus size={15} />
                        )}
                        {isSubmitting ? "Creating..." : "Create Account"}
                    </button>

                    {/* Login link */}
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-px bg-blue-500/8" />
                        <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                            Already have an account?
                        </span>
                        <div className="flex-1 h-px bg-blue-500/8" />
                    </div>

                    <p className="text-center text-[12px] text-slate-400">
                        <Link to="/login"
                            className="text-blue-500 font-semibold
                                hover:text-blue-600 transition-colors">
                            Sign in →
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;