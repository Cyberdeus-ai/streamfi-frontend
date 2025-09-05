import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/context";
import ProjectGrid from "@/components/leaderboard/ProjectGrid";
import TopGainerTable from "@/components/leaderboard/TopGainerTable";
import TopLoserTable from "@/components/leaderboard/TopLoserTable";
import { getGainScoreList, getScoreList } from "@/actions/score";

type DetailProps = {
    campaignInfo: any
}

const Detail = ({ campaignInfo }: DetailProps) => {
    const [top20Users, setTop20Users] = useState<any>([]);
    const [gainers, setGainers] = useState<any>([]);
    const [losers, setLosers] = useState<any>([]);
    const [users, setUsers] = useState<any>([]);
    const [selectedTimeframe, setSelectedTimeframe] = useState<number>(0);

    const { loadingState } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                loadingState(true);
                const data = await getGainScoreList(campaignInfo.id);
                if (data.result) {
                    setGainers(data.gainerList);
                    setLosers(data.loserList);
                    setUsers(data.userList);
                }
            } catch (err) {
                toast.error(`Error: ${err}`);
            } finally {
                loadingState(false);
            }
        }

        if (campaignInfo.id) {
            fetchData();
        }
    }, [campaignInfo])

    useEffect(() => {
        const fetchData = async () => {
            try {
                loadingState(true);
                const scoreList = await getScoreList(campaignInfo.id, selectedTimeframe);
                setTop20Users(scoreList.filter((item: any) => item.score_is_latest === true).map((score: any) => {
                    return {
                        name: score.xaccount_username,
                        percentage: score.score_percentage / 100,
                        isPositive: 1 - Math.random() > 0.5,
                        scores: score.score
                    }
                }));
                setGainers
            } catch (err) {
                toast.error(`Error: ${err}`);
            } finally {
                loadingState(false);
            }
        };

        if (campaignInfo.id) {
            fetchData();
        }
    }, [campaignInfo.id, selectedTimeframe]);

    if (!campaignInfo) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-gray-800 text-lg">Campaign not found</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            {campaignInfo.title || campaignInfo.handtags?.join(', ') || `Campaign ${campaignInfo.id}`}
                        </h1>
                        {campaignInfo.description && (
                            <p className="text-gray-600">{campaignInfo.description}</p>
                        )}
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500">Campaign ID</div>
                        <div className="text-lg font-semibold text-gray-800">{campaignInfo.id}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-500">Tickers</div>
                        <div className="text-lg font-semibold text-gray-800">
                            {campaignInfo.tickers?.join(', ') || 'N/A'}
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-500">Status</div>
                        <div className="text-lg font-semibold text-green-600">
                            {campaignInfo.status || 'Active'}
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-500">Duration</div>
                        <div className="text-lg font-semibold text-gray-800">
                            {campaignInfo.startDate && campaignInfo.endDate
                                ? `${new Date(campaignInfo.startDate).toLocaleDateString()} - ${new Date(campaignInfo.endDate).toLocaleDateString()}`
                                : 'Ongoing'
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <ProjectGrid
                    projects={top20Users}
                    selectedTimeframe={selectedTimeframe}
                    setSelectedTimeframe={setSelectedTimeframe}
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopGainerTable gainers={gainers} />
                <TopLoserTable losers={losers} />
            </div>

        </div>
    );
};

export default Detail;