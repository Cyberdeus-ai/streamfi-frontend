import api from "@/utils/api";
import toast from "react-hot-toast";

export const getCampaignListByUser = async (setLoading: (state: boolean) => void) => {
    try {
        setLoading(true);
        const res = await api.get('/claim/campaignlist');
        if(res.data.result) {
            return res.data.rewardList;
        }
    } catch (err) {
        toast.error(`Error: ${err}`);
    } finally {
        setLoading(false);
    }
}