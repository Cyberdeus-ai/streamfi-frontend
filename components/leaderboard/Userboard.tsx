import React, { useState } from 'react';
import { FaCrown, FaCheckCircle, FaRegTimesCircle } from 'react-icons/fa';
import clsx from 'clsx';
import moment from 'moment';

interface User {
    current: number;
    onemonth: number;
    oneweek: number;
    oneyear: number;
    sixmonths: number;
    threemonths: number;
    user_id: number;
    xaccount_bot: boolean;
    xaccount_created_at: Date;
    xaccount_follower_count: number;
    xaccount_id: string;
    xaccount_is_blue_verified: boolean | null;
    xaccount_is_verified: boolean | null;
    xaccount_name: string;
    xaccount_number_of_tweets: number;
    xaccount_profile_pic_url: string | null
    xaccount_user_id: number
    xaccount_username: string
}

interface UserboardProps {
    users: User[];
}

const crownColor = ['text-yellow-300', 'text-gray-300', 'text-red-300'];

const Userboard = ({ users }: UserboardProps) => {

    const getRankIcon = (rank: number) => {
        if (rank <= 3) {
            return (
                <div className={clsx("w-8 h-8 flex items-center justify-center", crownColor[rank - 1])}>
                    <FaCrown />
                </div>
            );
        }
        return (
            <div className="w-8 h-8 flex items-center justify-center text-gray-300 font-semibold">
                {rank}
            </div>
        );
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    return (
        <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-gray-700">
            <div className="flex flex-row justify-between items-center mb-6">
                <h2 className="text-white text-xl font-bold">Engager Leaderboard</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="text-left py-2 pr-2 text-gray-400 font-medium text-lg">
                                Rank
                            </th>
                            <th className="text-left py-2 pr-2 text-gray-400 font-medium text-lg">
                                Name
                            </th>
                            <th className="text-left py-2 pr-2 text-gray-400 font-medium text-lg">
                                Current
                            </th>
                            <th className="text-left py-2 pr-2 text-gray-400 font-medium text-lg">
                                Created at
                            </th>
                            <th className="text-left py-2 pr-2 text-gray-400 font-medium text-lg">
                                Blue Verification
                            </th>
                            <th className="text-left py-2 pr-2 text-gray-400 font-medium text-lg">
                                Verification
                            </th>
                            <th className="text-left py-2 pr-2 text-gray-400 font-medium text-lg">
                                Followers
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer">
                                <td className="py-2 pr-2">
                                    {getRankIcon(index + 1)}
                                </td>
                                <td className="py-2 pr-2">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                                            {user.xaccount_profile_pic_url ? (
                                                <img src={user.xaccount_profile_pic_url} alt={user.xaccount_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-white text-sm font-semibold">
                                                    {user.xaccount_name.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{user.xaccount_name}</div>
                                            <div className="text-gray-400 text-sm">{user.xaccount_username}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-2 pr-2">
                                    <span className="text-white font-medium">{(user.current / 100).toFixed(2)}%</span>
                                </td>
                                <td className="py-2 pr-2">
                                    <span className="text-white font-medium">{moment(user.xaccount_created_at).format("YYYY-MM-DD")}</span>
                                </td>
                                <td className="py-2 pr-2">
                                    {user.xaccount_is_blue_verified ? (
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
                                    {user.xaccount_is_verified ? (
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
                                    <span className="text-white">{formatNumber(user.xaccount_follower_count)}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Userboard;