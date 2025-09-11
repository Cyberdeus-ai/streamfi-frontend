import React from "react";

type CampaignItemProps = {
    url: string;
    tickers: string[];
    handles: string[];
}

const CampaignItem = ({ url, tickers, handles }: CampaignItemProps) => {
    return (
        <div className="flex flex-row items-center justify-bwtween p-2 bg-gray-100 shadow-sm border border-gray-200 rounded-md cursor-pointer hover:bg-white">
            <img
                className="mr-2 rounded-full w-6 h-6 gb-blur-image"
                src={url}
                alt="campaign-image-url"
            />
            <span className="hidden 2xl:inline-block truncate align-middle text-sm font-medium">
                {tickers.length > 0 && `$${tickers?.join(', $')}`}
            </span>
            <span className="inline-block truncate align-middle text-lg font-medium text-red-600">
                {handles.length > 0 && `@${handles?.join(', @')}`}
            </span>
        </div>
    );
}

export default CampaignItem;