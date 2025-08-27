import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Button from "@/components/common/Button";
import CampaignModal from '@/components/leaderboard/CampaignModal';
import { useAuth } from '@/context';
import CampaignItem from '@/components/leaderboard/CampaignItem';
import { getCampaignList } from '@/actions/campaign';

type Campaign = {
    startDate?: Date;
    endDate?: Date;
    hashtags?: string;
    tickers?: string;
    handles?: string;
    rewardPool?: string;
    bigAccounts?: string;
}

export default function Leaderboard() {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [campaignList, setCampaignList] = useState<Campaign[]>([]);

    const { isAuthenticated } = useAuth();

    useEffect(() => {
        async function fetchData() {
            const data = await getCampaignList();
            setCampaignList(data);
        }
        fetchData();
    }, [])

    const onToggleHandler = () => {
        setCollapsed((prev) => !prev);
    }

    const onCloseModal = () => {
        setIsModalOpen(false);
    }

    const onSetupClick = () => {
        setIsModalOpen(true);
    }

    return (
        <div className="flex h-screen bg-white">
            <Sidebar collapsed={collapsed} onToggle={onToggleHandler} />
            <div className="flex-1 overflow-auto">
                
                <Header title="Leaderboard" />
                <div className="p-6 space-y-6">
                    <div className="flex flex-row items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Campaigns</h2>
                        {
                            isAuthenticated && (
                                <div className="w-50">
                                    <Button
                                        className=""
                                        title="Campaign Setup"
                                        onClick={onSetupClick}
                                        variant="secondary"
                                    />
                                </div>
                            )
                        }
                    </div>
                    <div className="rounded-md bg-white p-2 rounded-md shadow-md">
                        <div className="grid grid-cols-6 gap-x-2 gap-y-1">
                            {
                                campaignList.map((c, index) => {
                                    return (
                                        <CampaignItem key={index} title={c.handles??`Twitter Campaign_${index+1}`} url={`/twitter${index%3+1}.png`}/>
                                    )
                                })
                            }   
                        </div>
                    </div>
                </div>
            </div>
            <CampaignModal
                list={campaignList}
                setList={setCampaignList}
                isOpen={isModalOpen}
                onClose={onCloseModal}
            />
        </div>
    );
}