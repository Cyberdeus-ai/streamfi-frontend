import api from "@/utils/api";
import toast from "react-hot-toast";

export const getScoreList = async (campaignId: any, period: number) => {
    try {
        const res = await api.post("/score/list", {
            campaignId: campaignId,
            period: period
        });
        if (res.data.result) {
            return res.data.top20ScoreList;
        }
    } catch (err) {
        toast.error(`Error: ${err}`);
    }
}

export const getGainScoreList = async (campaignId: any) => {
    try {
        const res = await api.post("/score/toplist", {
            campaignId: campaignId
        });
        return res.data;
    } catch (err) {
        toast.error(`Error: ${err}`);
    }
}