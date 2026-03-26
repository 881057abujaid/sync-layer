import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoutes = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center
            bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-[14px] flex items-center
                    justify-center
                    bg-gradient-to-br from-[#2563eb] to-[#06b6d4]
                    shadow-[0_4px_16px_rgba(37,99,235,0.3)]">
                    <svg className="animate-spin" width="22" height="22"
                        viewBox="0 0 24 24" fill="none" stroke="white"
                        strokeWidth="2.5" strokeLinecap="round">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/>
                    </svg>
                </div>
                <p className="text-[13px] font-medium text-slate-400">
                    Loading...
                </p>
            </div>
        </div>
    );

    if (!user) return <Navigate to="/login" replace />;

    return children;
};

export default ProtectedRoutes;