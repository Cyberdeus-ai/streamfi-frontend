"use client";

import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

interface AuthContextType {
    user: object | null;
    login: (user: object) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: { id: "", name: "", email: "" },
    login: () => { },
    logout: () => { },
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<object | null>(null);

    const login = (user: object) => setUser(user);
    const logout = () => setUser(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                if(localStorage.getItem("accessToken")) {
                    const token = localStorage.getItem("accessToken") || "";
                    const userInfo = jwtDecode(token);
                    setUser(userInfo);
                }
                return;
            } catch (err) {
                toast.error(`Error: ${err}`);
            }
        }
        fetch();    
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}