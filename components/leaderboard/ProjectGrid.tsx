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
    const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
    const [selectedTimeframe, setSelectedTimeframe] = useState('24H');

    const projects: Project[] = [
        { name: 'MONAD', percentage: 9.39, isPositive: false, isCrown: true, crownType: 'gold' },
        { name: 'BOUNDLESS', percentage: 3.71, isPositive: true },
        { name: 'LOMBARD', percentage: 3.12, isPositive: false },
        { name: 'PORTALT...', percentage: 2.86, isPositive: false },
        { name: 'ANOMA', percentage: 4.90, isPositive: true, rank: 2, crownType: 'silver' },
        { name: 'BILLIONS', percentage: 2.82, isPositive: false },
        { name: 'MITOSIS', percentage: 2.48, isPositive: true },
        { name: 'SOMNIA', percentage: 2.38, isPositive: true },
        { name: 'UNION', percentage: 2.36, isPositive: true },
        { name: 'MAVRYK', percentage: 2.69, isPositive: true },
        { name: 'MEGAETH', percentage: 2.30, isPositive: false },
        { name: 'FALCON', percentage: 2.13, isPositive: false },
        { name: 'MET', percentage: 2.03, isPositive: false },
        { name: 'SURF', percentage: 1.89, isPositive: false },
        { name: 'LINEA', percentage: 2.01, isPositive: false },
        { name: 'CAMP', percentage: 1.67, isPositive: false },
        { name: 'POLYMARKET', percentage: 4.69, isPositive: true },
        { name: 'ABSTRACT', percentage: 1.13, isPositive: false },
    ];

    const timeframes = ['24H', '48H', '7D', '30D', '3M', '6M', '12M'];
    const rankings = ['Top20', 'Top21-Top50', 'Top51-Top100'];

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex bg-gray-700 rounded-lg p-1">
                    {rankings.map((ranking) => (
                        <button
                            key={ranking}
                            onClick={() => setSelectedRanking(ranking)}
                            className={`px-3 py-2 text-sm rounded-md transition-colors ${selectedRanking === ranking
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                                }`}
                        >
                            {ranking}
                        </button>
                    ))}
                </div>

                <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="All Languages">All Languages</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                </select>

                <div className="flex bg-gray-700 rounded-lg p-1">
                    {timeframes.map((timeframe) => (
                        <button
                            key={timeframe}
                            onClick={() => setSelectedTimeframe(timeframe)}
                            className={`px-3 py-2 text-sm rounded-md transition-colors ${selectedTimeframe === timeframe
                                    ? 'bg-green-600 text-white'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
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
