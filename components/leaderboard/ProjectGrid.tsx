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

type ProjectGridProps = {
    projects: Project[],
    selectedTimeframe: number,
    setSelectedTimeframe: (value: number) => void,
}

const timeframes = ['7D', '30D', '3M', '6M', '12M'];

const ProjectGrid = ({ projects, selectedTimeframe, setSelectedTimeframe }: ProjectGridProps) => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
            <div className="flex flex-row justify-end gap-4 mb-6">
                <div className="flex bg-gray-100 rounded-lg p-1 shadow-sm">
                    {timeframes.map((timeframe, index) => (
                        <button
                            key={timeframe}
                            onClick={() => setSelectedTimeframe(index)}
                            className={`px-3 py-2 text-sm rounded-md transition-colors ${selectedTimeframe === index
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
