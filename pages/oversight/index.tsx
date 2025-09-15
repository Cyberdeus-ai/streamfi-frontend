import { getCampaignList } from '@/actions/campaign';
import { getBadUserList } from '@/actions/oversight';
import { useAuth } from '@/context';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { FaCheckCircle, FaRegTimesCircle } from 'react-icons/fa';

export default function Oversight() {
    const [campaigns, setCampaigns] = useState<any>([]);
    const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
    const [users, setUsers] = useState<any>([]);

    const { loadingState } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            const campaignList = await getCampaignList(loadingState);
            setCampaigns(campaignList);
            const userList = await getBadUserList(loadingState);
            setUsers(userList);
            setSelectedCampaign(campaigns[0]);
        }
        fetchData();
    }, []);

    return (
        <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-gray-700">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="text-left py-2 pr-2 text-gray-400 font-medium text-lg">
                                No
                            </th>
                            <th className="text-left py-2 pr-2 text-gray-400 font-medium text-lg">
                                Name
                            </th>
                            <th className="text-left py-2 pr-2 text-gray-400 font-medium text-lg">
                                Created At
                            </th>
                            <th className="text-left py-2 pr-2 text-gray-400 font-medium text-lg">
                                Bot detection
                            </th>
                            <th className="text-left py-2 pr-2 text-gray-400 font-medium text-lg">
                                Sockpuppet filters
                            </th>
                            <th className="text-left py-2 pr-2 text-gray-400 font-medium text-lg">
                                Wallet status
                            </th>
                            <th className="text-left py-2 pr-2 text-gray-400 font-medium text-lg">
                                Ban
                            </th>
                            <th className="text-left py-2 pr-2 text-gray-400 font-medium text-lg">
                                Stream status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: any, index: number) => (
                            <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer">
                                <td className="py-2 pr-2">
                                    <span className="text-white font-medium">{index + 1}</span>
                                </td>
                                <td className="py-2 pr-2">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                                            {user.profile_pic_url ? (
                                                <img src={user.profile_pic_url} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-white text-sm font-semibold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{user.name}</div>
                                            <div className="text-gray-400 text-sm">{user.username}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-2 pr-2">
                                    <span className="text-white font-medium">{moment(user.created_at).format("YYYY-MM-DD")}</span>
                                </td>
                                <td className="py-2 pr-2">
                                    <span className="text-white font-medium">{user.bot_detection}</span>
                                </td>
                                <td className="py-2 pr-2">
                                    <span className="text-white font-medium">{user.sockpuppet_filters}</span>
                                </td>
                                <td className="py-2 pr-2">
                                    {user.wallet_status ? (
                                        <div className='flex flex-row text-xl text-green-300'>
                                            <FaCheckCircle /><span className="ml-2 mt-[-4px] text-green-300 font-medium">adjust</span>
                                        </div>
                                    ) : (
                                        <div className='flex flex-row text-xl text-red-300'>
                                            <FaRegTimesCircle /><span className="ml-2 mt-[-4px] text-red-300 font-medium">freeze</span>
                                        </div>
                                    )}
                                </td>
                                <td className="py-2 pr-2">
                                    {user.is_ban ? (
                                        <div className='text-xl text-green-300'>
                                            <FaCheckCircle />
                                        </div>
                                    ) : (
                                        <div className='text-xl text-red-300'>
                                            <FaRegTimesCircle />
                                        </div>
                                    )}
                                </td>
                                <td className="py-2 pr-2">
                                    {user.stream_status ? (
                                        <div className='flex flex-row text-xl text-green-300'>
                                            <FaCheckCircle /><span className="ml-2 mt-[-4px] text-green-300 font-medium">progress</span>
                                        </div>
                                    ) : (
                                        <div className='flex flex-row text-xl text-red-300'>
                                            <FaRegTimesCircle /><span className="ml-2 mt-[-4px] text-red-300 font-medium">stop</span>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}