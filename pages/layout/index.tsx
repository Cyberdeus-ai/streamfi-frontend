import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useRouter } from 'next/router';

type LayoutProps = {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("Leaderboard");
    const [render, setRender] = useState<any>(<></>);

    const onToggleHandler = () => {
        setCollapsed((prev) => !prev);
    }

    const router = useRouter();

    useEffect(() => {
        if (router.pathname === "/auth/signin" || router.pathname === "/auth/signup") {
            return setRender(<>{children}</>);
        } else {
            return setRender(
                <div className="flex h-screen bg-white">
                    <Sidebar collapsed={collapsed} onToggle={onToggleHandler} onSetTitle={setTitle} />
                    <div className="flex-1 overflow-auto mx-10 my-5">
                        <Header title={title} />
                        {children}
                    </div>
                </div>
            );
        }
    }, [router.pathname])

    return render;
}