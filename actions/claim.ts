import api from "@/utils/api";
import toast from "react-hot-toast";

export const getCampaignListByUser = async () => {
    try {
        const res = await api.get('/claim/campaignlist');
        if(res.data.result) {
            return res.data.rewardList;
        }
    } catch (err) {
        toast.error(`Error: ${err}`);
    }
}