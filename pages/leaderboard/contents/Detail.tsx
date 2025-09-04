import React, { useState, useEffect } from "react";
import { useAuth } from "@/context";
import ProjectGrid from "@/components/leaderboard/ProjectGrid";
import TopGainerTable from "@/components/leaderboard/TopGainerTable";
import TopLoserTable from "@/components/leaderboard/TopLoserTable";
import { getScoreList } from "@/actions/score";

type DetailProps = {
    campaignInfo: any
}

const Detail = ({ campaignInfo }: DetailProps) => {
    const [projects, setProjects] = useState<any>([]);
    const [selectedRanking, setSelectedRanking] = useState<number>(0);
    const [selectedTimeframe, setSelectedTimeframe] = useState<number>(0);
    
    const { loading, loadingState } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                loadingState(true);
                const scoreList = await getScoreList(campaignInfo.id, selectedTimeframe);
                console.log(scoreList);
                const totalScore = scoreList.reduce((total: any, item: any) => {
                    return Number(total) + Number(item.score);
                });
                setProjects(scoreList.map((score: any) => {
                    return {
                        name: score.user.username,
                        percentage: Number(score.score) / Number(totalScore) * 100,
                        isPositive: 1 - Math.random() > 0.5,
                    }
                }));
            } catch (error) {
                console.error('Error fetching campaign details:', error);
            } finally {
                loadingState(false);
            }
        };

        if (campaignInfo.id) {
            fetchData();
        }
    }, [campaignInfo.id]);

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
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Performance</h2>
                <ProjectGrid
                    projects={projects}
                    selectedRanking={selectedRanking}
                    setSelectedRanking={setSelectedRanking}
                    selectedTimeframe={selectedTimeframe}
                    setSelectedTimeframe={setSelectedTimeframe}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopGainerTable />
                <TopLoserTable />
            </div>

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