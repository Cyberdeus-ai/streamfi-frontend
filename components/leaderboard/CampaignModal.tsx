import React, { useState } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import moment from 'moment';
import { createCampaign } from "@/actions/campaign";

type CampaignModalProps = {
    isOpen: boolean;
    onClose: () => void;
    list: Campaign[];
    setList: React.Dispatch<React.SetStateAction<Campaign[]>>;
}

type Campaign = {
    startDate?: Date;
    endDate?: Date;
    hashtags?: string;
    tickers?: string;
    handles?: string;
    rewardPool?: string;
    bigAccounts?: string;
}

const CampaignModal = ({ isOpen, onClose, list, setList }: CampaignModalProps) => {
    const [campaign, setCampaign] = useState<Campaign | null>(null)

    const onCampaignChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCampaign({
            ...campaign,
            [name]: value
        })
    }

    const onOkBtnClicked = async () => {
        if (campaign) {
            const data = await createCampaign(campaign);
            setList(prevList => [...prevList, data]);
            setCampaign(null);
            onClose();
        }
    }

    const onCancelBtnClicked = () => {
        setCampaign(null);
        onClose();
    }
  
    return (
        <Modal
            title="Campaign Setup"
            isOpen={isOpen}
            onClose={onClose}
            onOk={onOkBtnClicked}
            onCancel={onCancelBtnClicked}
        >
            <div className="flex flex-col">
                <div className="flex flex-row justify-between items-center">
                    <Input
                        label="Start date"
                        name="startDate"
                        type="date"
                        placeholder="XXXX-XX-XX" 
                        value={moment(campaign?.startDate??null).format('YYYY-MM-DD')}
                        onChange={onCampaignChanged}
                    />
                    <Input
                        label="End date"
                        name="endDate"
                        type="date"
                        placeholder="XXXX-XX-XX" 
                        value={moment(campaign?.endDate??null).format('YYYY-MM-DD')}
                        onChange={onCampaignChanged}
                    />  
                </div>
                <div className="w-full">
                    <Input
                        label="Hashtags"
                        name="hashtags"
                        type="text"
                        placeholder="####" 
                        value={campaign?.hashtags??""}
                        onChange={onCampaignChanged}
                    />
                </div>
                <div className="w-full">
                    <Input
                        label="Tickers"
                        name="tickers"
                        type="text"
                        placeholder="****" 
                        value={campaign?.tickers??""}
                        onChange={onCampaignChanged}
                    />
                </div>
                <div className="w-full">
                    <Input
                        label="Handles"
                        name="handles"
                        type="text"
                        placeholder="yourname@twitter.com" 
                        value={campaign?.handles??""}
                        onChange={onCampaignChanged}
                    />
                </div>
                <div className="w-full">
                    <Input
                        label="Reward pool"
                        name="rewardPool"
                        type="text"
                        placeholder="23.12" 
                        value={campaign?.rewardPool??""}
                        onChange={onCampaignChanged}
                    />
                </div>
                <div className="w-full">
                    <Input
                        label="Big accounts"
                        name="bigAccounts"
                        type="text"
                        placeholder="abcdef@twitter.com" 
                        value={campaign?.bigAccounts??""}
                        onChange={onCampaignChanged}
                    />
                </div>
            </div>
        </Modal>
    );
}  

export default CampaignModal;