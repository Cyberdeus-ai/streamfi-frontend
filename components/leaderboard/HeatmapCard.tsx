import React from 'react';
import { FaCrown } from 'react-icons/fa';

interface Heatmap {
    name: string;
    percentage: number;
    isPositive: boolean;
    rank?: number;
    isCrown?: boolean;
    crownType?: 'gold' | 'silver' | 'bronze';
    scores: number[]
}

type HeatmapCardProps = {
    data: Heatmap,
}

const HeatmapCard = ({ data }: HeatmapCardProps) => {
    const getCardSize = (rank: number) => {
        if (rank <= 3) {
            return {
                width: 'w-80',
                height: 'h-48',
                textSize: 'text-lg',
                percentageSize: 'text-2xl',
                chartHeight: 'h-24'
            };
        } else if (rank <= 6) {
            return {
                width: 'w-64',
                height: 'h-40',
                textSize: 'text-base',
                percentageSize: 'text-xl',
                chartHeight: 'h-20'
            };
        } else if (rank <= 12) {
            return {
                width: 'w-48',
                height: 'h-32',
                textSize: 'text-sm',
                percentageSize: 'text-lg',
                chartHeight: 'h-16'
            };
        } else {
            return {
                width: 'w-32',
                height: 'h-24',
                textSize: 'text-xs',
                percentageSize: 'text-sm',
                chartHeight: 'h-12'
            };
        }
    };

    const cardSize = getCardSize(data.rank || 20);

    const getCrownColor = (type: string) => {
        switch (type) {
            case 'gold': return 'text-yellow-500';
            case 'silver': return 'text-gray-400';
            case 'bronze': return 'text-amber-600';
            default: return 'text-yellow-500';
        }
    };

    return (
        <div
            className={`relative ${cardSize.width} ${cardSize.height} rounded-lg shadow-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                data.isPositive 
                    ? 'bg-green-300 border-green-500 hover:bg-green-500' 
                    : 'bg-red-300 border-red-500 hover:bg-red-500'
            }`}
        >
            {data.isCrown && data.crownType && (
                <div className="absolute -top-2 -left-2 z-20">
                    <FaCrown className={`w-8 h-8 ${getCrownColor(data.crownType)} drop-shadow-lg`} />
                </div>
            )}
            
            {!data.isCrown && data.rank && (
                <div className="absolute -top-2 -left-2 z-20 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-300">
                    <span className="text-gray-800 text-sm font-bold">{data.rank}</span>
                </div>
            )}

            <div className="p-4 h-full flex flex-col justify-between">
                <div className="flex flex-col space-y-2">
                    <h4 className={`text-white font-bold ${cardSize.textSize} truncate leading-tight`}>
                        {data.name}
                    </h4>
                    <span className={`text-white font-bold ${cardSize.percentageSize}`}>
                        {data.isPositive ? '+' : ''}{(data.percentage * 100).toFixed(2)}%
                    </span>
                </div>

                {(data.rank || 20) <= 12 && (
                    <div className={`${cardSize.chartHeight} w-full mt-2`}>
                        <svg width="100%" height="100%" viewBox="0 0 100 60" className="w-full h-full">
                            <path
                                d={data.scores.map((value, index) => {
                                    const x = (index / (data.scores.length - 1)) * 100;
                                    const y = 60 - (value / 100) * 60;
                                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                                }).join(' ')}
                                stroke="rgba(255,255,255,0.9)"
                                strokeWidth="2"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d={data.scores.map((value, index) => {
                                    const x = (index / (data.scores.length - 1)) * 100;
                                    const y = 60 - (value / 100) * 60;
                                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                                }).join(' ') + ' L 100 60 L 0 60 Z'}
                                fill="rgba(255,255,255,0.2)"
                            />
                        </svg>
                    </div>
                )}
            </div>

            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity rounded-lg"></div>
        </div>
    );
};

export default HeatmapCard;
