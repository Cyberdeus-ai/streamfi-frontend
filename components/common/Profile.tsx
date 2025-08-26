import React from 'react';

type ProfileProps = {
  avatarUrl: string;
  username: string;
  tokenBalance: number;
  campaignCount: number;
};

const Profile = ({ avatarUrl, username, tokenBalance, campaignCount }: ProfileProps) => {
  return (
    <div className="flex flex-col items-center">
      <img
        src={avatarUrl}
        alt="Avatar"
        className="w-40 h-40 border-2 border-gray-300 mb-2"
      />
      <span className="text-xl font-semibold mb-4">{username}</span>
      <span className="text-lg font-semibold">{`Token: ${tokenBalance}`}</span>
      <span className="text-lg font-semibold">{`Campaigns: ${campaignCount}`}</span>
    </div>
  );
};

export default Profile;