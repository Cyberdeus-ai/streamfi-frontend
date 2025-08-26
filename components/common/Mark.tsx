import React from "react";

type EthereumLogoProps = {
    size: number;
    className: string;
}

const Mark = ({ size = 48, className = "" }: EthereumLogoProps) => {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            className={className}
            fill="none"
        >
            <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                fill="url(#ethereum-gradient-1)"
            />
            <path
                d="M2 17L12 22L22 17L12 12L2 17Z"
                fill="url(#ethereum-gradient-2)"
            />
            <path
                d="M12 6L7 8.5L12 11L17 8.5L12 6Z"
                fill="url(#ethereum-highlight)"
                opacity="0.3"
            />
            <defs>
                <linearGradient id="ethereum-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="50%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
                <linearGradient id="ethereum-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#1D4ED8" />
                    <stop offset="100%" stopColor="#1E40AF" />
                </linearGradient>
                <linearGradient id="ethereum-highlight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#E0E7FF" />
                </linearGradient>
            </defs>
        </svg>    
    );
}

export default Mark;