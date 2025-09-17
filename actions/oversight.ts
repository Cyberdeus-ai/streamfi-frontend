import api from "@/utils/api";
import toast from "react-hot-toast";

export const getBadUserList = async () => {
    try {

        const res = await api.get("/oversight");
        if (res.data.result) {
            return res.data.userList;
        }
    } catch (err) {
        toast.error(`Error: ${err}`);
    }
}