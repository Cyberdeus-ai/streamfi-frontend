import api from "@/utils/api";
import toast from "react-hot-toast";

export const createCampaign = async (campaign: object | null) => {
    try {
        const res = await api.post("/campaign", campaign);
        if(res.data.result) {
            return res.data.newCampaign;
        }
    } catch (err) {
        toast.error(`Error: ${err}`)
    }
}

export const getCampaignList = async () => {
    try {
        const res = await api.get("/campaign/list");
        if(res.data.result) {
            return res.data.campaignList;
        }
    } catch (err) {
        toast.error(`Error: ${err}`);
    }
}

export const getCampaignDetail = async (campaignId: number) => {
    try {
        const res = await api.post("/campaign/detail", {
            campaignId: campaignId
        });
        if(res.data.result) {
            return res.data.campaignDetail;
        }
    } catch(err) {
        toast.error(`Error: ${err}`);
    }
}