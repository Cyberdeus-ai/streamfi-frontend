import api from "../utils/api";
import toast from "react-hot-toast";
import { useAuth } from "@/context";
import { setAuthToken } from "../utils/setAuthToken";

export const signOut = async () => {
    try {
        const { logout } = useAuth();
        logout();
        setAuthToken(null);
    } catch (err) {
        toast(`Error: ${err}`);
    }
}