import React, { useState } from 'react';

type GainerProps = {
    gainers: any
}

const TopGainerTable = ({ gainers }: GainerProps) => {
    const [metricType, setMetricType] = useState<'absolute' | 'relative'>('absolute');

    return (
        <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Top Gainer</h3>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setMetricType('absolute')}
                        className={`px-3 py-1 rounded text-sm font-medium shadow-sm ${metricType === 'absolute'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                            }`}
                    >
                        ▲ Absolute (bps)
                    </button>
                    <button
                        onClick={() => setMetricType('relative')}
                        className={`px-3 py-1 rounded text-sm font-medium shadow-sm ${metricType === 'relative'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                            }`}
                    >
                        ▲ Relative (%)
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-gray-600 text-sm border-b border-gray-200">
                            <th className="text-left pb-2 pr-2">Name</th>
                            <th className="text-left pb-2 pr-2">Current</th>
                            <th className="text-left pb-2 pr-2">Δ7D</th>
                            <th className="text-left pb-2 pr-2">Δ30D</th>
                            <th className="text-left pb-2 pr-2">Δ3M</th>
                            <th className="text-left pb-2 pr-2">Δ6M</th>
                            <th className="text-left pb-2 pr-2">Δ1Y</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {gainers.map((gainer: any, index: number) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-2 pr-2 text-gray-800 font-medium">
                                    {gainer.name}
                                    <span className='hidden lg:block'>@{gainer.username}</span>
                                </td>
                                <td className="py-2 pr-2 text-left text-gray-800">{gainer.current}%</td>
                                <td className="py-2 pr-2 text-left text-green-600">{metricType === "absolute" ? `${(gainer.oneweek * 100).toFixed(0)}bps` : `${gainer.oneweek}%`}</td>
                                <td className="py-2 pr-2 text-left text-green-600">{metricType === "absolute" ? `${(gainer.onemonth * 100).toFixed(0)}bps` : `${gainer.onemonth}%`}</td>
                                <td className="py-2 pr-2 text-left text-green-600">{metricType === "absolute" ? `${(gainer.threemonths * 100).toFixed(0)}bps` : `${gainer.threemonths}%`}</td>
                                <td className="py-2 pr-2 text-left text-green-600">{metricType === "absolute" ? `${(gainer.sixmonths * 100).toFixed(0)}bps` : `${gainer.sixmonths}%`}</td>
                                <td className="py-2 pr-2 text-left text-green-600">{metricType === "absolute" ? `${(gainer.oneyear * 100).toFixed(0)}bps` : `${gainer.oneyear}%`}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopGainerTable;
