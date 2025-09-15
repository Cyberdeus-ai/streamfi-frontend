import React from 'react';

type GainerProps = {
    gainers: any
}

const TopGainerTable = ({ gainers }: GainerProps) => {

    return (
        <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Top Gainer</h3>
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
                                <td className="py-2 pr-2 text-left text-green-600">{`${gainer.oneweek.toFixed(2)}%`}</td>
                                <td className="py-2 pr-2 text-left text-green-600">{`${gainer.onemonth.toFixed(2)}%`}</td>
                                <td className="py-2 pr-2 text-left text-green-600">{`${gainer.threemonths.toFixed(2)}%`}</td>
                                <td className="py-2 pr-2 text-left text-green-600">{`${gainer.sixmonths.toFixed(2)}%`}</td>
                                <td className="py-2 pr-2 text-left text-green-600">{`${gainer.oneyear.toFixed(2)}%`}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopGainerTable;
