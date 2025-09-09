import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import moment from "moment";
import { useAuth } from "@/context";
import HeatmapGrid from "@/components/leaderboard/HeatmapGrid";
import TopGainerTable from "@/components/leaderboard/TopGainerTable";
import TopLoserTable from "@/components/leaderboard/TopLoserTable";
import Userboard from "@/components/leaderboard/Userboard";
import { getGainScoreList } from "@/actions/score";

type DetailProps = {
    campaignInfo: any
}

const Detail = ({ campaignInfo }: DetailProps) => {
    const [gainers, setGainers] = useState<any>([]);
    const [losers, setLosers] = useState<any>([]);
    const [users, setUsers] = useState<any>([]);

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

    if (!campaignInfo) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-gray-800 text-md">Campaign not found</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-lg font-bold text-gray-800 mb-2">
                            {`#${campaignInfo.hashtags?.join(', #')} $${campaignInfo.tickers?.join(", $")}  @${campaignInfo.handles?.join(", @")}`}
                        </h1>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500">Campaign ID</div>
                        <div className="text-md font-semibold text-gray-800">{campaignInfo.id}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-500">Posts</div>
                        <div className="text-md font-semibold text-gray-800">
                            {campaignInfo.tweet || 'N/A'}
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-500">Status</div>
                        {
                            new Date(campaignInfo.end_date).getTime() - new Date().getTime() > 0 ?
                                (<div className="text-md font-semibold text-green-600">Active</div>) :
                                (<div className="text-md font-semibold text-red-600">Inactive</div>)
                        }
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-500">During</div>
                        <div className="text-md font-semibold text-gray-800">
                            {campaignInfo.start_date && campaignInfo.end_date ?
                                `${moment(campaignInfo.start_date).format('YYYY-MM-DD')} ~ ${moment(campaignInfo.end_date).format('YYYY-MM-DD')}` :
                                'Undefined'
                            }
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-500">Quotes</div>
                        <div className="text-md font-semibold text-gray-800">
                            {campaignInfo.quote || 'N/A'}
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-500">Replies</div>
                        <div className="text-md font-semibold text-gray-800">
                            {campaignInfo.reply || 'N/A'}
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-500">RTs</div>
                        <div className="text-md font-semibold text-gray-800">
                            {campaignInfo.retweet || 'N/A'}
                        </div>
                    </div>
                </div>
            </div>

            {/* <div>
                <HeatmapGrid campaignId={campaignInfo.id} />
            </div> */}
            {
                users && users.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <TopGainerTable gainers={gainers} />
                            <TopLoserTable losers={losers} />
                        </div>
                        <div>
                            <Userboard users={users} />
                        </div>

                    </>
                )
            }
        </div>
    );
};

export default Detail;