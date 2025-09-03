import React, { useState } from 'react';
import Campaigns from "./contents/Campaigns";
import Detail from "./contents/Detail";

export default function Leaderboard() {
    const [campaignId, setCampaignId] = useState<number>(-1);
    const [flag, setFlag] = useState<boolean>(false);

    return (
        <>
            {
                !flag ? (
                    <Campaigns onSetFlag={setFlag} onSetCampaignId={setCampaignId} />
                ) : (
                    <Detail campaignId={campaignId} />
                )
            }
        </>
    );
}