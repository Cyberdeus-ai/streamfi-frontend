import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Button from "@/components/common/Button";
import CampaignModal from '@/components/leaderboard/CampaignModal';

export default function Leaderboard() {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const onToggleHandler = () => {
        setCollapsed((prev) => !prev);
    }

    const onCloseModal = () => {
        setIsModalOpen(false);
    }

    const onSetupClick = () => {
        setIsModalOpen(true);
    }

    return (
        <div className="flex h-screen bg-white">
            <Sidebar collapsed={collapsed} onToggle={onToggleHandler} />
            <div className="flex-1 overflow-auto">
                
                <Header title="Leaderboard" />
                <div className="p-6 space-y-6">
                    <div className="flex flex-row items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Campaigns</h2>
                        <div className="w-50">
                            <Button
                                className=""
                                title="Campaign Setup"
                                onClick={onSetupClick}
                                variant="secondary"
                            />
                        </div>
                    </div>
                    <div className="rounded-md bg-white p-2 rounded-md shadow-md">
                        <div className="grid grid-cols-6 gap-x-2 gap-y-1">
                            <div>
                                <div className="flex flex-row items-center justify-bwtween p-2 hover:rounded-md hover:bg-gray-100">
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CampaignModal isOpen={isModalOpen} onClose={onCloseModal} />
        </div>
    );
}