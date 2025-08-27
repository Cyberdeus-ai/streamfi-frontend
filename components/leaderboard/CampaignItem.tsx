import React from "react";

type CampaignItemProps = {
    url: string;
    title: string;
}

const CampaignItem = ({ url, title }: CampaignItemProps) => {
    return (
        <div className="flex flex-row items-center justify-bwtween p-2 cursor-pointer hover:rounded-md hover:bg-gray-100">
            <img
                className="mr-2 rounded-full w-6 h-6 gb-blur-image"
                src={url}
                alt="campaign-image-url"
            />
            <span className="inline-block truncate align-middle text-sm font-medium">
                {title}
            </span>
        </div>
    );
}

export default CampaignItem;