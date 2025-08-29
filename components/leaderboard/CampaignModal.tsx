import React, { useState } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import TagInput from "../common/TagInput";
import moment from 'moment';
import { createCampaign } from "@/actions/campaign";

type CampaignModalProps = {
    isOpen: boolean;
    onClose: () => void;
    setList: React.Dispatch<React.SetStateAction<Campaign[]>>;
}

type Campaign = {
    startDate?: Date;
    endDate?: Date;
    hashtags?: string[];
    tickers?: string[];
    handles?: string[];
    rewardPool?: number;
    bigAccounts?: string[];
}

const CampaignModal = ({ isOpen, onClose, setList }: CampaignModalProps) => {
    const [campaign, setCampaign] = useState<Campaign | null>(null)

    const onInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCampaign({
            ...campaign,
            [name]: value
        })
    }

    const onTagInputChanged = (name:string, values: string[]) => {
        setCampaign({
            ...campaign,
            [name]: values
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
                        onChange={onInputChanged}
                    />
                    <Input
                        label="End date"
                        name="endDate"
                        type="date"
                        placeholder="XXXX-XX-XX" 
                        value={moment(campaign?.endDate??null).format('YYYY-MM-DD')}
                        onChange={onInputChanged}
                    />  
                </div>
                <div className="w-full">
                    <TagInput
                        label="Hashtags"
                        name="hashtags"
                        value={campaign?.hashtags || []}
                        onChange={onTagInputChanged}
                        placeholder="Enter to add more..."
                    />
                </div>
                <div className="w-full">
                    <TagInput
                        label="Tickers"
                        name="tickers"
                        value={campaign?.tickers || []}
                        onChange={onTagInputChanged}
                        placeholder="Enter to add more..."
                    />
                </div>
                <div className="w-full">
                    <TagInput
                        label="Handles"
                        name="handles"
                        value={campaign?.handles || []}
                        onChange={onTagInputChanged}
                        placeholder="Enter to add more..."
                    />
                </div>
                <div className="w-full">
                    <Input
                        label="Reward pool"
                        name="rewardPool"
                        type="number"
                        placeholder="Enter a number" 
                        value={campaign?.rewardPool?.toString()??""}
                        onChange={onInputChanged}
                    />
                </div>
                <div className="w-full">
                    <TagInput
                        label="Big accounts"
                        name="bigAccounts"
                        value={campaign?.bigAccounts || []}
                        onChange={onTagInputChanged}
                        placeholder="Enter to add more..."
                    />
                </div>
            </div>
        </Modal>
    );
}  

export default CampaignModal;