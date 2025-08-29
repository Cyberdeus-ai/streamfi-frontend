import api from "../utils/api";
import toast from "react-hot-toast";

type signUpProps = {
    address?: string | null;
    twitterAccount?: string;
    accountType?: string;
}

export const getNonce = async () => {
    try {
        const res = await api.get("/auth/nonce");
        return res.data;
    } catch (err) {
        toast.error(`Error: ${err}`);
    }
}

export const verify = async (message: any, signature: any, nonce: any, address: any) => {
    try {
        const res = await api.post('/auth/verify', {
            message: message,
            signature: signature,
            nonce: nonce,
            address: address
        });
        return res.data;
    } catch (err) {
        toast.error(`Error: ${err}`);
    }
}

export const signUp = async (userInfo: signUpProps) => {
    try {
        const res = await api.post("/auth/signup", userInfo);
        return res.data.result;
    } catch (err) {
       toast.error(`Error: ${err}`);
    }
}

export const signIn = async (address: string) => {
    try {
        const res = await api.post("/auth/signin", { address: address });
        return res.data;
    } catch (err) {
        toast.error(`Error: ${err}`);
    }
}

export const signInWithToken = async () => {
    try {
        const res = await api.get("/auth/signin-with-token");
        return res.data;
    } catch (err) {
        toast.error(`Error: ${err}`);
    }        
}