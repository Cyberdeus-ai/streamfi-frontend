import api from "@/utils/api";
import toast from "react-hot-toast";

export const getBadUserList = async (setLoading: (state: boolean) => void) => {
    try {
        setLoading(true);
        const res = await api.get("/oversight");
        if (res.data.result) {
            return res.data.userList;
        }
    } catch (err) {
        toast.error(`Error: ${err}`);
    } finally {
        setLoading(false);
    }
}