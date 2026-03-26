import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoutes from "../components/ProtectedRoutes";
import Dashboard from "../pages/Dashboard";
import Activity from "../pages/Activity";
import Shared from "../pages/Shared";
import Starred from "../pages/Starred";
import Trash from "../pages/Trash";
import Settings from "../pages/auth/Settings";

const AppRoutes = () =>{
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                    <ProtectedRoutes>
                        <Dashboard />
                    </ProtectedRoutes>} 
                />
                <Route
                    path="/activity"
                    element={
                        <ProtectedRoutes>
                            <Activity />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/shared"
                    element={
                        <ProtectedRoutes>
                            <Shared />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/starred"
                    element={
                        <ProtectedRoutes>
                            <Starred />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/trash"
                    element={
                        <ProtectedRoutes>
                            <Trash />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoutes>
                            <Settings />
                        </ProtectedRoutes>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;