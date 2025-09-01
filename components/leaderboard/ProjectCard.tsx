import React from 'react';

interface ProjectCardProps {
    name: string;
    percentage: number;
    isPositive: boolean;
    rank?: number;
    isCrown?: boolean;
    crownType?: 'gold' | 'silver' | 'bronze';
}

const ProjectCard: React.FC<ProjectCardProps> = ({
    name,
    percentage,
    isPositive,
    rank,
    isCrown,
    crownType = 'gold'
}) => {
    const getCrownIcon = () => {
        if (!isCrown) return null;

        const crownColors = {
            gold: 'text-yellow-400',
            silver: 'text-gray-300',
            bronze: 'text-amber-600'
        };

        return (
            <div className={`absolute -top-2 -right-2 text-2xl ${crownColors[crownType]}`}>
                👑
            </div>
        );
    };

    const getRankIcon = () => {
        if (!rank) return null;

        const rankColors = {
            gold: 'text-yellow-400',
            silver: 'text-gray-300',
            bronze: 'text-amber-600'
        };

        return (
            <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${rank === 1 ? rankColors.gold : rank === 2 ? rankColors.silver : rankColors.bronze
                }`}>
                {rank}
            </div>
        );
    };

    const generateChartData = () => {
        const points = 20;
        const data = [];
        let value = Math.random() * 100;

        for (let i = 0; i < points; i++) {
            value += (Math.random() - 0.5) * 20;
            value = Math.max(0, Math.min(100, value));
            data.push(value);
        }

        return data;
    };

    const chartData = generateChartData();

    return (
        <div className={`relative p-4 rounded-lg ${isPositive ? 'bg-green-900/30 border border-green-700/50' : 'bg-red-900/30 border border-red-700/50'
            }`}>
            {getCrownIcon()}
            {getRankIcon()}

            <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-semibold text-sm">{name}</h4>
                <span className={`text-lg font-bold ${isPositive ? 'text-green-400' : 'text-red-400'
                    }`}>
                    {percentage}%
                </span>
            </div>

            <div className="h-16 w-full">
                <svg width="100%" height="100%" viewBox="0 0 100 60" className="w-full h-full">
                    <path
                        d={chartData.map((value, index) => {
                            const x = (index / (chartData.length - 1)) * 100;
                            const y = 60 - (value / 100) * 60;
                            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }).join(' ')}
                        stroke={isPositive ? '#10B981' : '#EF4444'}
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d={chartData.map((value, index) => {
                            const x = (index / (chartData.length - 1)) * 100;
                            const y = 60 - (value / 100) * 60;
                            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }).join(' ')}
                        stroke={isPositive ? '#10B981' : '#EF4444'}
                        strokeWidth="1"
                        fill={`url(#${isPositive ? 'green' : 'red'}-gradient)`}
                        opacity="0.3"
                    />
                    <defs>
                        <linearGradient id="green-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="red-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    );
};

export default ProjectCard;
