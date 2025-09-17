"use client";

import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { signInWithToken } from "@/actions/auth";
import { setAuthToken } from "@/utils/setAuthToken";
import { useRouter } from "next/navigation";

interface User {
    id?: string;
    address?: string;
    twitterAccount?: string;
    profile_pic_url?: string;
    username?: string;
    tokenBalance?: number;
    campaignCount?: number;
    accountType?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    loadingState: (loading: boolean) => void;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    loading: false,
    loadingState: () => { },
    login: () => { },
    logout: () => { },
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const login = (user: User) => {
        setUser(user);
        setIsAuthenticated(true);
    }
    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("accessToken");
        setAuthToken(null);
    }
    const loadingState = (loading: boolean) => {
        setLoading(loading);
    }

    useEffect(() => {
        const fetch = async () => {
            try {
                loadingState(true);
                if (localStorage.getItem("accessToken")) {
                    const data = await signInWithToken();
                    login(data.user);
                    setAuthToken(data.token);
                    router.push("/leaderboard");
                }
                return;
            } catch (err) {
                toast.error(`Error: ${err}`);
            } finally {
                loadingState(false);
            }
        }
        fetch();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, loadingState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}