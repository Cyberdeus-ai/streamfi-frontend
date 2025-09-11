import React, { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import { useAuth } from '@/context';
import CampaignItem from '@/components/leaderboard/CampaignItem';
import { getCampaignList } from '@/actions/campaign';
import CampaignModal from '@/components/leaderboard/CampaignModal';

type CampaignProps = {
    onSetFlag: (flag: boolean) => void;
    onSetCampaignInfo: (info: any) => void
};

const Campaigns = ({ onSetFlag, onSetCampaignInfo }: CampaignProps) => {
    const [campaignList, setCampaignList] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const { isAuthenticated, loadingState } = useAuth();

    useEffect(() => {
        async function fetchData() {
            const data = await getCampaignList(loadingState);
            setCampaignList(data);
        }
        fetchData();
    }, []);

    const onSetupClick = () => {
        setIsModalOpen(true);
    }

    const onCloseModal = () => {
        setIsModalOpen(false);
    }

    return (
        <div className="py-6 space-y-6">
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
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-5">
                <div className="grid 2xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-2 gap-y-1">
                    {
                        campaignList.map((campaign: any, index: number) => {
                            return (
                                <div key={index} onClick={() => { onSetCampaignInfo(campaign); onSetFlag(true); }}>
                                    <CampaignItem
                                        key={index}
                                        tickers={campaign?.tickers}
                                        handles={campaign?.handles}
                                        url={`/twitter${index % 3 + 1}.png`} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            {isModalOpen && (
                <CampaignModal
                    setList={setCampaignList}
                    isOpen={isModalOpen}
                    onClose={onCloseModal}
                />
            )}
        </div>
    );
};

export default Campaigns;