import React, { useState } from 'react';

interface User {
    name: string;
    joinedAt: string;
    highFrequencyDuplicate: boolean;
    sockpuppetFilters: boolean;
    freezeAdjust: boolean;
    banBadActor: boolean;
    pause: boolean;
}

export default function Oversight() {
    const [selectedCampaign, setSelectedCampaign] = useState('Campaign A');
    
    const users: User[] = [
        {
            name: 'User A',
            joinedAt: '02/21/2018 ...',
            highFrequencyDuplicate: false,
            sockpuppetFilters: false,
            freezeAdjust: false,
            banBadActor: false,
            pause: false
        },
        {
            name: 'User B',
            joinedAt: '08/18/2025 ...',
            highFrequencyDuplicate: false,
            sockpuppetFilters: false,
            freezeAdjust: false,
            banBadActor: false,
            pause: false
        }
    ];

    const campaigns = ['Campaign A', 'Campaign B', 'Campaign C'];

    const handleActionToggle = (userIndex: number, action: keyof Omit<User, 'name' | 'joinedAt'>) => {
        console.log(`Toggling ${action} for user ${users[userIndex].name}`);
    };

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-end mb-6">
                    <div className="flex items-center space-x-3">
                        <label htmlFor="campaign-select" className="text-lg font-medium text-gray-900">
                            Select Campaign
                        </label>
                        <select
                            id="campaign-select"
                            value={selectedCampaign}
                            onChange={(e) => setSelectedCampaign(e.target.value)}
                            className="px-4 py-2 border-2 border-gray-900 rounded-md bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {campaigns.map((campaign) => (
                                <option key={campaign} value={campaign}>
                                    {campaign}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="bg-white border-2 border-gray-900 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-900">
                                <th className="text-left py-3 px-4 font-medium text-gray-900 border-r border-gray-900">
                                    Name
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900 border-r border-gray-900">
                                    Joined At
                                </th>
                                <th className="text-center py-3 px-4 font-medium text-gray-900 border-r border-gray-900">
                                    High Frequency/Duplicate post
                                </th>
                                <th className="text-center py-3 px-4 font-medium text-gray-900 border-r border-gray-900">
                                    Sockpuppet filters
                                </th>
                                <th className="text-center py-3 px-4 font-medium text-gray-900 border-r border-gray-900">
                                    Freeze/Adjust
                                </th>
                                <th className="text-center py-3 px-4 font-medium text-gray-900 border-r border-gray-900">
                                    Ban bad actor
                                </th>
                                <th className="text-center py-3 px-4 font-medium text-gray-900">
                                    Pause
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index} className="border-b border-gray-900">
                                    <td className="py-3 px-4 text-gray-900 border-r border-gray-900">
                                        {user.name}
                                    </td>
                                    <td className="py-3 px-4 text-gray-900 border-r border-gray-900">
                                        {user.joinedAt}
                                    </td>
                                    <td className="py-3 px-4 text-center border-r border-gray-900">
                                        <input
                                            type="checkbox"
                                            checked={user.highFrequencyDuplicate}
                                            onChange={() => handleActionToggle(index, 'highFrequencyDuplicate')}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                        />
                                    </td>
                                    <td className="py-3 px-4 text-center border-r border-gray-900">
                                        <input
                                            type="checkbox"
                                            checked={user.sockpuppetFilters}
                                            onChange={() => handleActionToggle(index, 'sockpuppetFilters')}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                        />
                                    </td>
                                    <td className="py-3 px-4 text-center border-r border-gray-900">
                                        <input
                                            type="checkbox"
                                            checked={user.freezeAdjust}
                                            onChange={() => handleActionToggle(index, 'freezeAdjust')}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                        />
                                    </td>
                                    <td className="py-3 px-4 text-center border-r border-gray-900">
                                        <input
                                            type="checkbox"
                                            checked={user.banBadActor}
                                            onChange={() => handleActionToggle(index, 'banBadActor')}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                        />
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <input
                                            type="checkbox"
                                            checked={user.pause}
                                            onChange={() => handleActionToggle(index, 'pause')}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}