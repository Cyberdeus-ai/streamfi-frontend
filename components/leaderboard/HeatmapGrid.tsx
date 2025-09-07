import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaCrown } from 'react-icons/fa';
import { useAuth } from '@/context';
import HeatmapCard from './HeatmapCard';
import { getScoreList } from '@/actions/score';

const timeframes = ['7D', '30D', '3M', '6M', '12M'];
const crownType = ['gold', 'silver', 'bronze'];

type HeatmapGridProps = {
    campaignId: number
}

const HeatmapGrid = ({ campaignId }: HeatmapGridProps) => {
    const [top20Users, setTop20Users] = useState<any>([]);
    const [selectedTimeframe, setSelectedTimeframe] = useState<number>(0);

    const { loadingState } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                loadingState(true);
                const scoreList = await getScoreList(campaignId, selectedTimeframe);
                setTop20Users(scoreList.map((score: any, index: number) => {
                    return {
                        name: score.xaccount_username,
                        percentage: score.score_percentage / 100,
                        isPositive: score.score_percentage - score.score[0].score_percentage ? true : false,
                        rank: index + 1,
                        isCrown: index < 3 ? true : false,
                        crownType: crownType[index],
                        scores: score.score.map((s: any) => Number(s.score_percentage))
                    }
                }));
            } catch (err) {
                toast.error(`Error: ${err}`);
            } finally {
                loadingState(false);
            }
        };

        if (campaignId) {
            fetchData();
        }
    }, [campaignId, selectedTimeframe]);

    return (
        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
            <div className="flex flex-row flex-wrap justify-between items-center mb-6">
                <h2 className="text-gray-800 text-xl font-bold">Top20</h2>
                <div className="flex flex-row justify-center bg-gray-100 rounded-lg p-1 shadow-sm">
                    {timeframes.map((timeframe, index) => (
                        <div
                            key={timeframe}
                            onClick={() => setSelectedTimeframe(index)}
                            className={`px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${selectedTimeframe === index
                                ? 'bg-green-600 text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                                }`}
                        >
                            {timeframe}
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative h-[600px] w-full">
                <div className="h-full w-full flex flex-col gap-3">
                    {/* Top row - Top 3 (largest cards) */}
                    <div className="flex justify-center gap-4 h-48">
                        {top20Users.slice(0, 3).map((user: any, index: number) => (
                            <HeatmapCard key={index} data={user} />
                        ))}
                    </div>
                    
                    {/* Second row - Ranks 4-6 (medium cards) */}
                    <div className="flex justify-center gap-4 h-40">
                        {top20Users.slice(3, 6).map((user: any, index: number) => (
                            <HeatmapCard key={index + 3} data={user} />
                        ))}
                    </div>
                    
                    {/* Third row - Ranks 7-12 (smaller cards) */}
                    <div className="flex justify-center gap-3 h-32">
                        {top20Users.slice(6, 12).map((user: any, index: number) => (
                            <HeatmapCard key={index + 6} data={user} />
                        ))}
                    </div>
                    
                    {/* Bottom row - Ranks 13-20 (smallest cards) */}
                    <div className="flex justify-center gap-2 h-24 flex-wrap">
                        {top20Users.slice(12, 20).map((user: any, index: number) => (
                            <HeatmapCard key={index + 12} data={user} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeatmapGrid;
