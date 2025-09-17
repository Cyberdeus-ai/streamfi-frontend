import React, { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import { useAuth } from '@/context';
import moment from 'moment';
import { getCampaignList } from '@/actions/campaign';
import CampaignModal from '@/components/leaderboard/CampaignModal';

type CampaignProps = {
    onSetFlag: (flag: boolean) => void;
    onSetCampaignInfo: (info: any) => void
};

const Campaigns = ({ onSetFlag, onSetCampaignInfo }: CampaignProps) => {
    const [campaignList, setCampaignList] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const { isAuthenticated, user, loadingState } = useAuth();

    useEffect(() => {
        async function fetchData() {
            try {
                loadingState(true);
                const data = await getCampaignList();
                setCampaignList(data);
            } catch (_) { } finally {
                loadingState(false);
            }
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
                    isAuthenticated && user?.accountType === "Admin" && (
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
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-gray-600 text-sm border-b border-gray-200">
                                <th className="text-left pb-2 pr-2 pl-2">Name</th>
                                <th className="text-left pb-2 pr-2">Hashtags</th>
                                <th className="text-left pb-2 pr-2 hidden sm:table-cell">Tickers</th>
                                <th className="text-left pb-2 pr-2 hidden md:table-cell">Handles</th>
                                <th className="text-left pb-2 pr-2 hidden xl:table-cell">Owner</th>
                                <th className="text-left pb-2 pr-2 hidden 2xl:table-cell">Reward pool</th>
                                <th className="text-left pb-2 pr-2">Start date</th>
                                <th className="text-left pb-2 pr-2">End date</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {campaignList && campaignList.length > 0 ? campaignList.map((campaign: any, index: number) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-100 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => { onSetCampaignInfo(campaign); onSetFlag(true); }}
                                >
                                    <td className="py-2 pr-2 pl-2 text-gray-800 font-medium">
                                        {campaign.name}
                                    </td>
                                    <td className="py-2 pr-2 text-left text-gray-800">{`#${campaign.hashtags.join(", #")}`}</td>
                                    <td className="py-2 pr-2 text-left text-gray-800 hidden sm:table-cell">{`$${campaign.tickers.join(", $")}`}</td>
                                    <td className="py-2 pr-2 text-left text-gray-800 hidden md:table-cell">{`@${campaign.handles.join(", @")}`}</td>
                                    <td className="py-2 pr-2 text-gray-800 font-medium hidden xl:table-cell">
                                        <div className="flex items-center space-x-3">
                                            <div>
                                                <div className="text-gray-800 font-medium">{campaign.xa_name}</div>
                                                <div className="text-gray-600 text-sm">@{campaign.xa_username}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2 pr-2 text-left text-gray-800 hidden 2xl:table-cell">{campaign.reward_pool}</td>
                                    <td className="py-2 pr-2 text-left text-gray-800">{moment(campaign.start_date).format("YYYY-MM-DD")}</td>
                                    <td className="py-2 pr-2 text-left text-gray-800">{moment(campaign.end_date).format("YYYY-MM-DD")}</td>
                                </tr>
                            )) : (
                                <tr className="flex items-center justify-center h-[40vh]">No Campaign Found!</tr>
                            )}
                        </tbody>
                    </table>
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