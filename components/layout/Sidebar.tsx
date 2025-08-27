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
import { signOut } from "@/actions/auth";
import { useAuth } from "@/context";

type SidebarProps = {
    collapsed: boolean;
    onToggle: () => void;
};

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const onSignInClicked = () => {
        router.push("/auth/signin"); 
    }

    const onSignUpClicked = () => {
        router.push("/auth/signup"); 
    }
    
    const onSignOutClicked = () => {
        signOut();            
    }
    
    return (
        <div className={`${collapsed ? 'w-16' : 'w-64'} bg-gray-900 h-screen flex flex-col transition-all duration-300`}>
            <div className="p-4 border-b border-gray-800 text-white flex items-center justify-between">
                {!collapsed && <Logo />}
                <Toggle onToggle={onToggle} />
            </div>
            <div className="flex-1 p-4">
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
                            {!collapsed && <span>Leaderboard</span>}
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
            </div>
            <div className="relative flex flex-col w-full min-w-0 p-2 px-10 mt-auto">
                {!collapsed && 
                    isAuthenticated ? (
                        <div className="flex flex-col mt-10 pt-10 text-white">
                            <Profile
                                avatarUrl="/avatar.jpg"
                                username="CyberDeus" 
                                tokenBalance={0}
                                campaignCount={0}
                            />
                            <Button
                                className="mt-5"
                                title="Sign Out"
                                onClick={onSignOutClicked}
                                variant="secondary"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col mt-10 pt-10 text-white">
                            <Button
                                className="mt-5"
                                title="Sign In"
                                onClick={onSignInClicked}
                                variant="primary"
                            />
                            <Button
                                className="mt-5"
                                title="Sign Up"
                                onClick={onSignUpClicked}
                                variant="secondary"
                            />
                        </div>    
                    )
                }
            </div>
        </div>
    )
}

export default Sidebar;