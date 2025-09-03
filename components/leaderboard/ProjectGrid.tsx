import React, { useState } from 'react';
import ProjectCard from './ProjectCard';

interface Project {
    name: string;
    percentage: number;
    isPositive: boolean;
    rank?: number;
    isCrown?: boolean;
    crownType?: 'gold' | 'silver' | 'bronze';
}

const ProjectGrid: React.FC = () => {
    const [selectedRanking, setSelectedRanking] = useState('Top20');
    const [selectedTimeframe, setSelectedTimeframe] = useState('24H');

    const projects: Project[] = [
        { name: 'MONAD', percentage: 9.39, isPositive: false, isCrown: true, crownType: 'gold' },
        { name: 'ANOMA', percentage: 4.90, isPositive: true, rank: 2, isCrown: true, crownType: 'silver' },
        { name: 'BILLIONS', percentage: 2.82, isPositive: false },
        { name: 'MITOSIS', percentage: 2.48, isPositive: true },
        { name: 'ABSTRACT', percentage: 1.13, isPositive: false },
    ];

    const timeframes = ['24H', '48H', '7D', '30D', '3M', '6M', '12M'];
    const rankings = ['Top20', 'Top21-Top50', 'Top51-Top100'];

    return (
        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex bg-gray-100 rounded-lg p-1 shadow-sm">
                    {rankings.map((ranking) => (
                        <button
                            key={ranking}
                            onClick={() => setSelectedRanking(ranking)}
                            className={`px-3 py-2 text-sm rounded-md transition-colors ${selectedRanking === ranking
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                                }`}
                        >
                            {ranking}
                        </button>
                    ))}
                </div>

                <div className="flex bg-gray-100 rounded-lg p-1 shadow-sm">
                    {timeframes.map((timeframe) => (
                        <button
                            key={timeframe}
                            onClick={() => setSelectedTimeframe(timeframe)}
                            className={`px-3 py-2 text-sm rounded-md transition-colors ${selectedTimeframe === timeframe
                                    ? 'bg-green-600 text-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                                }`}
                        >
                            {timeframe}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {projects.map((project, index) => (
                    <ProjectCard
                        key={index}
                        name={project.name}
                        percentage={project.percentage}
                        isPositive={project.isPositive}
                        rank={project.rank}
                        isCrown={project.isCrown}
                        crownType={project.crownType}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProjectGrid;
