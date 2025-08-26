import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiFillDashboard } from "react-icons/ai";
import { GiToken, GiLog } from "react-icons/gi";
import clsx from "clsx"
import Logo from "../common/Logo";
import Toggle from "../common/Toggle";
import Profile from "../common/Profile";
import Button from "../common/Button";

type SidebarProps = {
    collapsed: boolean;
    onToggle: () => void;
};

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
    const router = useRouter();

    const onSignOutClicked = () => {
        
    }
    
    return (
        <div className={`${collapsed ? 'w-16' : 'w-64'} bg-gray-900 h-screen flex flex-col transition-all duration-300`}>
            <div className="p-4 border-b border-gray-800 text-white flex items-center justify-between">
                {!collapsed && <Logo />}
                <Toggle onToggle={onToggle} />
            </div>
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    <li>
                        <Link
                            className={
                                clsx("flex items-center text-white rounded-lg hover:bg-blue-900/20",
                                    router.pathname === "/leaderboard" && "bg-blue-900/20",
                                    collapsed ? "px-2 py-2" : "px-3 py-3"
                                )
                            }
                            href="/leaderboard"
                        >
                            <AiFillDashboard className={clsx("text-xl", !collapsed && "mr-2")} />
                            {!collapsed && <span>LeaderBoard</span>}
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={
                                clsx("flex items-center text-white rounded-lg hover:bg-blue-900/20",
                                    router.pathname === "/token" && "bg-blue-900/20",
                                    collapsed ? "px-2 py-2" : "px-3 py-3"
                                )
                            }
                            href="/token"
                        >
                            <GiToken className={clsx("text-xl", !collapsed && "mr-2")} />
                            {!collapsed && <span>Token Claim</span>}
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={
                                clsx("flex items-center text-white rounded-lg hover:bg-blue-900/20",
                                    router.pathname === "/oversight" && "bg-blue-900/20",
                                    collapsed ? "px-2 py-2" : "px-3 py-3"
                                )
                            }
                            href="/oversight"
                        >
                            <GiLog className={clsx("text-xl", !collapsed && "mr-2")} />
                            {!collapsed && <span>Admin Oversight</span>}
                        </Link>
                    </li>
                </ul>

                {!collapsed &&
                    (
                        <div className="flex flex-col justify-center items-center min-h-screen mt-6 pt-6 border-t text-white border-gray-800">
                            <Profile
                                avatarUrl=""
                                username="CyberDeus" 
                                tokenBalance={0}
                                campaignCount={0}
                            />
                            <Button
                                className="mt-5"
                                title="Sign Out"
                                onClick={onSignOutClicked}
                            />
                        </div>
                    )
                }
            </nav>
        </div>
    )
}

export default Sidebar;