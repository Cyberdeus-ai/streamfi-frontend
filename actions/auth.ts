import api from "../utils/api";
import toast from "react-hot-toast";
import { useAuth } from "@/context";
import { setAuthToken } from "../utils/setAuthToken";

type signUpProps = {
    address?: string | null;
    twitterAccount?: string;
    accountType?: string;
}

export const signUp = async (userInfo: signUpProps) => {
    try {
        const res = await api.post("/auth/signup", userInfo);
        return res.data.result;
    } catch (err) {
       toast(`Error: ${err}`, {
            className: "error-toast"
       });
    }
}

export const signIn = async (address: string) => {
    try {
        const res = await api.post("/auth/signin", { address: address });
        return res.data.result;
    } catch (err) {
        toast(`Error: ${err}`, {
            className: "error-toast"
        });
    }
}

export const signOut = async () => {
    try {
        const { logout } = useAuth();
        logout();
        setAuthToken(null);
    } catch (err) {
        toast(`Error: ${err}`, {
            className: "error-toast"
        });
    }
}