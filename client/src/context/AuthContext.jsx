import { createContext, useState, useEffect } from "react";
import * as authService from "../services/auth.service";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) =>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        const initAuth = async () =>{
            const token = localStorage.getItem("token");
            if(!token){
                setLoading(false);
                return;
            }

            try {
                const data = await authService.getCurrentUser();
                setUser(data);
            } catch (error) {
                console.error(error);
                localStorage.removeItem("token");
            }
            setLoading(false);
        }
        initAuth();
    }, []);

    const login = async (credentials) =>{
        const data = await authService.loginUser(credentials);
        localStorage.setItem("token", data.token);
        const user = await authService.getCurrentUser();
        setUser(user);
    };

    const logout = () =>{
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};