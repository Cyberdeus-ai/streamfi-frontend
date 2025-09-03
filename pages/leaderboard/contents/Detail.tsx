import React, { useState, useEffect } from "react";
import ProjectGrid from "@/components/leaderboard/ProjectGrid";
import TopGainerTable from "@/components/leaderboard/TopGainerTable";
import TopLoserTable from "@/components/leaderboard/TopLoserTable";
import { getCampaignList } from "@/actions/campaign";

type DetailProps = {
    campaignId: number
}

interface Campaign {
    id: number;
    title?: string;
    tickers?: string[];
    description?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
}

const Detail = ({ campaignId }: DetailProps) => {
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaignDetails = async () => {
            try {
                setLoading(true);
                const campaignList = await getCampaignList();
                if (campaignList) {
                    const selectedCampaign = campaignList.find((c: any) => c.id === campaignId);
                    setCampaign(selectedCampaign || null);
                }
            } catch (error) {
                console.error('Error fetching campaign details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (campaignId) {
            fetchCampaignDetails();
        }
    }, [campaignId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-gray-800 text-lg">Loading campaign details...</div>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-gray-800 text-lg">Campaign not found</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Campaign Header */}
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            {campaign.title || campaign.tickers?.join(', ') || `Campaign ${campaignId}`}
                        </h1>
                        {campaign.description && (
                            <p className="text-gray-600">{campaign.description}</p>
                        )}
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500">Campaign ID</div>
                        <div className="text-lg font-semibold text-gray-800">{campaignId}</div>
                    </div>
                </div>
                
                {/* Campaign Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-500">Tickers</div>
                        <div className="text-lg font-semibold text-gray-800">
                            {campaign.tickers?.join(', ') || 'N/A'}
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-500">Status</div>
                        <div className="text-lg font-semibold text-green-600">
                            {campaign.status || 'Active'}
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-500">Duration</div>
                        <div className="text-lg font-semibold text-gray-800">
                            {campaign.startDate && campaign.endDate 
                                ? `${new Date(campaign.startDate).toLocaleDateString()} - ${new Date(campaign.endDate).toLocaleDateString()}`
                                : 'Ongoing'
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Project Performance Grid */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Performance</h2>
                <ProjectGrid />
            </div>

            {/* Performance Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopGainerTable />
                <TopLoserTable />
            </div>

            {/* Additional Campaign Metrics */}
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Campaign Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100">
                        <div className="text-2xl font-bold text-blue-600">24</div>
                        <div className="text-sm text-gray-500">Total Projects</div>
                    </div>
                    <div className="text-center bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100">
                        <div className="text-2xl font-bold text-green-600">+12.5%</div>
                        <div className="text-sm text-gray-500">Avg Performance</div>
                    </div>
                    <div className="text-center bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100">
                        <div className="text-2xl font-bold text-yellow-600">8</div>
                        <div className="text-sm text-gray-500">Top Performers</div>
                    </div>
                    <div className="text-center bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100">
                        <div className="text-2xl font-bold text-purple-600">1.2M</div>
                        <div className="text-sm text-gray-500">Total Volume</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Detail;