import api from "@/utils/api";
import toast from "react-hot-toast";

export const createCampaign = async (campaign: object | null, setLoading: (state: boolean) => void) => {
    try {
        setLoading(true);
        const res = await api.post("/campaign", campaign);
        if (res.data.result) {
            return res.data.newCampaign;
        }
    } catch (err) {
        toast.error(`Error: ${err}`)
    } finally {
        setLoading(false);
    }
}

export const getCampaignList = async (setLoading: (state: boolean) => void) => {
    try {
        setLoading(true);
        const res = await api.get("/campaign/list");
        if (res.data.result) {
            return res.data.campaignList;
        }
    } catch (err) {
        toast.error(`Error: ${err}`);
        return [];
    } finally {
        setLoading(false);
    }
}
