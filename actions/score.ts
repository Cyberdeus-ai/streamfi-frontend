import api from "@/utils/api";
import toast from "react-hot-toast";

export const getScoreList = async (campaignId: number) => {
    try {
        const res = await api.post("/score/list", {
            campaignId: campaignId
        });
        if(res.data.result) {
            return res.data.campaignDetail;
        }
    } catch(err) {
        toast.error(`Error: ${err}`);
    }
}