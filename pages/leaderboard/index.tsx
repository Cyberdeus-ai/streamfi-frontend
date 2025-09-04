import React, { useState } from 'react';
import Campaigns from "./contents/Campaigns";
import Detail from "./contents/Detail";
import Button from '@/components/common/Button';

export default function Leaderboard() {
    const [campaignInfo, setCampaignInfo] = useState<any>({});
    const [flag, setFlag] = useState<boolean>(false);

    return (
        <>
            {
                !flag ? (
                    <Campaigns onSetFlag={setFlag} onSetCampaignInfo={setCampaignInfo} />
                ) : (
                    <>
                        <div className='flex flex-row justify-end'>
                            <div className='w-[200px] mb-5'>
                                <Button
                                    title="Back to campaigns"
                                    onClick={() => {
                                        setCampaignInfo({});
                                        setFlag(false);
                                    }}
                                    variant="secondary"
                                />
                            </div>
                        </div>
                        <Detail campaignInfo={campaignInfo} />
                    </>
                )
            }
        </>
    );
}