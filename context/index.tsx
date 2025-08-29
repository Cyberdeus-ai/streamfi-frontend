"use client";

import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { signInWithToken } from "@/actions/auth";
import { setAuthToken } from "@/utils/setAuthToken";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: object | null;
    isAuthenticated: boolean;
    login: (user: object) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<object | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const router = useRouter();

    const login = (user: object) => {
        setUser(user);
        setIsAuthenticated(true);
    }
    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("accessToken");
        setAuthToken(null);
    }

    useEffect(() => {
        const fetch = async () => {
            try {
                if(localStorage.getItem("accessToken")) {
                    const data = await signInWithToken();
                    login(data.user);
                    setAuthToken(data.token);
                    router.push("/leaderboard");
                }
                return;
            } catch (err) {
                toast.error(`Error: ${err}`);
            }
        }
        fetch();    
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}