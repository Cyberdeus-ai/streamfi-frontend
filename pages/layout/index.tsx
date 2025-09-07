import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Loader from '@/components/common/Loader';
import { useAuth } from '@/context';

type LayoutProps = {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("Leaderboard");

    const onToggleHandler = () => {
        setCollapsed((prev) => !prev);
    }

    const router = useRouter();
    const { loading } = useAuth();

    if (router.pathname === "/auth/signin" || router.pathname === "/auth/signup") {
        return (<><>{children}</>{loading && <Loader />}</>);
    } else {
        return (
            <>
                <div className="flex h-screen bg-white">
                    <Sidebar collapsed={collapsed} onToggle={onToggleHandler} onSetTitle={setTitle} />
                    <div className="flex-1 overflow-auto mx-5 my-5">
                        <Header title={title} />
                        {children}
                    </div>
                </div>
                {loading && <Loader />}
            </>
        );
    }
}