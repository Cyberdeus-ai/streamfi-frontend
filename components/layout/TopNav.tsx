import React from "react";
import Link from "next/link";
import Logo from "../common/Logo";
import { useRouter } from "next/router";
import clsx from "clsx";

const TopNav = () => {
    const router = useRouter();
    
    return (
        <nav className="bg-gray-900 text-white p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Logo />
                <div className="space-x-4">
                    <Link href="/auth/signup" className={clsx("hover:text-blue-400 transition-colors", router.pathname === "/auth/signup" && "text-blue-400")}>
                        Sign Up
                    </Link>
                    <Link href="/auth/signin" className={clsx("hover:text-blue-400 transition-colors", router.pathname === "/auth/signin" && "text-blue-400")}>
                        Sign In
                    </Link>
                    <Link href="/leaderboard" className="hover:text-blue-400 transition-colors">
                        Leaderboard
                    </Link>
                </div>
            </div>
        </nav>
    )    
}

export default TopNav;