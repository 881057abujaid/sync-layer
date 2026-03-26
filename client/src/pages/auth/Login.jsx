import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { Mail, Lock, LogIn } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import logo from "/logo.png";

// ── Validation Schema ─────────────────────────────────────
const schema = yup.object({
    email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

const Login = () => {
    const { login }  = useAuth();
    const navigate   = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        const toastId = toast.loading("Signing in...");
        try {
            await login(data);
            toast.success("Welcome back!", { id: toastId });
            navigate("/dashboard");
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Invalid email or password",
                { id: toastId }
            );
        }
    };

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
            <div className="w-full max-w-[400px] mx-4 relative z-10
                bg-white/70 backdrop-blur-[32px]
                border border-white/90 rounded-[20px]
                shadow-[0_8px_32px_rgba(37,99,235,0.08)]
                px-6 sm:px-8 py-9">

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
                            Sync Layer
                        </h1>
                        <p className="text-[13px] text-slate-400 mt-0.5">
                            Sign in to your cloud storage
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-3.5">

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
                                className={`w-full h-[42px] rounded-[10px]
                                    pl-[38px] pr-3 text-[13.5px] text-slate-700
                                    bg-white/80 border
                                    placeholder:text-slate-400
                                    focus:outline-none focus:bg-white/95
                                    focus:ring-[3px] transition-all duration-150
                                    ${errors.email
                                        ? "border-red-400/50 focus:border-red-400 focus:ring-red-400/8"
                                        : "border-blue-500/15 focus:border-blue-500/40 focus:ring-blue-500/8"
                                    }`}
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
                                placeholder="••••••••"
                                {...register("password")}
                                className={`w-full h-[42px] rounded-[10px]
                                    pl-[38px] pr-3 text-[13.5px] text-slate-700
                                    bg-white/80 border
                                    placeholder:text-slate-400
                                    focus:outline-none focus:bg-white/95
                                    focus:ring-[3px] transition-all duration-150
                                    ${errors.password
                                        ? "border-red-400/50 focus:border-red-400 focus:ring-red-400/8"
                                        : "border-blue-500/15 focus:border-blue-500/40 focus:ring-blue-500/8"
                                    }`}
                            />
                        </div>
                        {errors.password && (
                            <p className="text-[11.5px] text-red-400 font-medium">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Forgot */}
                    <div className="text-right -mt-1">
                        <a href="#"
                            className="text-[11.5px] font-medium text-blue-500
                                hover:text-blue-600 transition-colors">
                            Forgot password?
                        </a>
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
                            <LogIn size={15} />
                        )}
                        {isSubmitting ? "Signing in..." : "Sign In"}
                    </button>

                    {/* Register link */}
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-px bg-blue-500/8" />
                        <span className="text-[11px] text-slate-400 font-medium">
                            Don't have an account?
                        </span>
                        <div className="flex-1 h-px bg-blue-500/8" />
                    </div>

                    <p className="text-center text-[12px] text-slate-400">
                        <Link to="/register"
                            className="text-blue-500 font-semibold
                                hover:text-blue-600 transition-colors">
                            Create account →
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;