import React, { useState } from 'react';

interface ProjectData {
    name: string;
    current: number;
    change1D: number;
    change7D: number;
    change30D: number;
    change3M: number;
}

const TopGainerTable: React.FC = () => {
    const [metricType, setMetricType] = useState<'absolute' | 'relative'>('absolute');

    const projects: ProjectData[] = [
        { name: 'ANOMA', current: 4.89, change1D: 205, change7D: 189, change30D: 156, change3M: 89 },
        { name: 'POLYMARKET', current: 4.69, change1D: 197, change7D: 178, change30D: 145, change3M: 78 },
        { name: 'MAVRYK', current: 2.69, change1D: 190, change7D: 167, change30D: 134, change3M: 67 },
        { name: 'BOUNDLESS', current: 3.71, change1D: 183, change7D: 156, change30D: 123, change3M: 56 },
        { name: 'LOMBARD', current: 3.12, change1D: 176, change7D: 145, change30D: 112, change3M: 45 },
        { name: 'PORTALT...', current: 2.86, change1D: 169, change7D: 134, change30D: 101, change3M: 34 },
        { name: 'BILLIONS', current: 2.82, change1D: 162, change7D: 123, change30D: 90, change3M: 23 },
        { name: 'MITOSIS', current: 2.48, change1D: 155, change7D: 112, change30D: 79, change3M: 12 },
    ];

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
                        <tr className="text-gray-500 text-sm border-b border-gray-200">
                            <th className="text-left pb-2">Project</th>
                            <th className="text-right pb-2">Current</th>
                            <th className="text-right pb-2">Δ1D</th>
                            <th className="text-right pb-2">Δ7D</th>
                            <th className="text-right pb-2">Δ30D</th>
                            <th className="text-right pb-2">Δ3M</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {projects.map((project, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-2 text-gray-800 font-medium">{project.name}</td>
                                <td className="py-2 text-right text-gray-800">{project.current}%</td>
                                <td className="py-2 text-right text-green-600">+{project.change1D}bps</td>
                                <td className="py-2 text-right text-green-600">+{project.change7D}bps</td>
                                <td className="py-2 text-right text-green-600">+{project.change30D}bps</td>
                                <td className="py-2 text-right text-green-600">+{project.change3M}bps</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopGainerTable;
