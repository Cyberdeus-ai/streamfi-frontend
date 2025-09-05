import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiFillDashboard } from "react-icons/ai";
import { GiToken, GiLog } from "react-icons/gi";
import clsx from "clsx"
import Logo from "../common/Logo";
import Toggle from "../common/Toggle";
import Profile from "../common/Profile";
import Button from "../common/Button";
import { useAuth } from "@/context";

type SidebarProps = {
    collapsed: boolean;
    onToggle: () => void;
    onSetTitle: (title: string) => void
};

const Sidebar = ({ collapsed, onToggle, onSetTitle }: SidebarProps) => {
    const [selectedId, setSelectedId] = useState<number>(0);

    const router = useRouter();
    const { isAuthenticated, logout } = useAuth();

    useEffect(() => {
        switch (router.pathname) {
            case "leaderboard":
                return setSelectedId(0);
            case "tokenclaim":
                return setSelectedId(1);
            case "oversight":
                return setSelectedId(2);
        }
    }, [router.pathname])

    return (
        <div className={`${collapsed ? 'w-16' : 'lg:w-64 w-16'} bg-gray-900 h-screen flex flex-col transition-all duration-300`}>
            <div className="p-4 border-b border-gray-800 text-white flex items-center justify-between">
                {!collapsed && <Logo />}
                <Toggle onToggle={onToggle} />
            </div>
            <div className="flex-1 p-4">
                <ul className="space-y-2">
                    <li onClick={() => { onSetTitle('Leaderboard'); router.push("/leaderboard"); setSelectedId(0); }}>
                        <div
                            className={
                                clsx("flex items-center cursor-pointer text-white rounded-lg hover:bg-blue-900/20",
                                    selectedId === 0 && "bg-blue-900/20",
                                    collapsed ? "px-2 py-2" : "lg:px-3 lg:py-3 px-2 py-2"
                                )
                            }
                        >
                            <AiFillDashboard className={clsx("lg:text-xl", !collapsed && "lg:mr-2")} />
                            {!collapsed && <span className="lg:block hidden">Leaderboard</span>}
                        </div>
                    </li>
                    {isAuthenticated && (
                        <>
                            <li onClick={() => { onSetTitle('Token Claim'); router.push("/tokenclaim"); setSelectedId(1); }}>
                                <div
                                    className={
                                        clsx("flex items-center cursor-pointer text-white rounded-lg hover:bg-blue-900/20",
                                            selectedId === 1 && "bg-blue-900/20",
                                            collapsed ? "px-2 py-2" : "lg:px-3 lg:py-3 px-2 py-2"
                                        )
                                    }
                                >
                                    <GiToken className={clsx("lg:text-xl", !collapsed && "lg:mr-2")} />
                                    {!collapsed && <span className="lg:block hidden">Token Claim</span>}
                                </div>
                            </li>
                            <li onClick={() => { onSetTitle('Admin Oversight'); router.push("/oversight"); setSelectedId(2); }}>
                                <div
                                    className={
                                        clsx("flex items-center cursor-pointer text-white rounded-lg hover:bg-blue-900/20",
                                            selectedId === 2 && "bg-blue-900/20",
                                            collapsed ? "px-2 py-2" : "lg:px-3 lg:py-3 px-2 py-2"
                                        )
                                    }
                                >
                                    <GiLog className={clsx("lg:text-xl", !collapsed && "lg:mr-2")} />
                                    {!collapsed && <span className="lg:block hidden">Admin Oversight</span>}
                                </div>
                            </li>
                        </>
                    )}
                </ul>
            </div>
            {
                !collapsed && (
                    <div className="relative flex flex-col w-full min-w-0 p-2 px-10 mt-auto lg:block hidden">
                        {
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
                                        onClick={() => logout()}
                                        variant="secondary"
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col mt-10 pt-10 text-white">
                                    <Button
                                        className="mt-5"
                                        title="Sign In"
                                        onClick={() => router.push("/auth/signin")}
                                        variant="primary"
                                    />
                                    <Button
                                        className="mt-5"
                                        title="Sign Up"
                                        onClick={() => router.push("/auth/signup")}
                                        variant="secondary"
                                    />
                                </div>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}

export default Sidebar;