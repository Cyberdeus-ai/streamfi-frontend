import React from "react";
import { useRouter } from "next/router";

type HeaderProps = {
    title: string;
}

const Header = ({ title }: HeaderProps) => {
    return (
        <div>
            <div className="relative bg-gradient-to-r from-blue-900 to-purple-900 p-8 my-4 rounded-md">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full">
                        <svg width="100%" height="100%" viewBox="0 0 1200 200" className="w-full h-full">
                            <defs>
                                <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#1E40AF" />
                                    <stop offset="100%" stopColor="#7C3AED" />
                                </linearGradient>
                            </defs>
                            <rect x="0" y="150" width="100" height="50" fill="url(#bg-gradient)" opacity="0.3" />
                            <rect x="150" y="140" width="80" height="60" fill="url(#bg-gradient)" opacity="0.2" />
                            <rect x="300" y="160" width="120" height="40" fill="url(#bg-gradient)" opacity="0.4" />
                            <rect x="500" y="130" width="90" height="70" fill="url(#bg-gradient)" opacity="0.3" />
                            <rect x="700" y="150" width="110" height="50" fill="url(#bg-gradient)" opacity="0.2" />
                            <rect x="900" y="140" width="100" height="60" fill="url(#bg-gradient)" opacity="0.3" />
                            <rect x="1100" y="160" width="80" height="40" fill="url(#bg-gradient)" opacity="0.4" />
                            <circle cx="200" cy="100" r="3" fill="#60A5FA" opacity="0.8" />
                            <circle cx="400" cy="80" r="2" fill="#A78BFA" opacity="0.6" />
                            <circle cx="600" cy="120" r="4" fill="#60A5FA" opacity="0.7" />
                            <circle cx="800" cy="90" r="3" fill="#A78BFA" opacity="0.5" />
                            <circle cx="1000" cy="110" r="2" fill="#60A5FA" opacity="0.8" />
                        </svg>
                    </div>
                </div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
                </div>
            </div>
        </div>
    )
}

export default Header;