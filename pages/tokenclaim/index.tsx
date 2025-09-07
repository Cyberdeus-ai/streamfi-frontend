import React, { useState } from "react";

export default function TokenClaim() {
    const [claimAmount, setClaimAmount] = useState("");
    
    const tokenData = {
        currentToken: 3.45,
        realTimeReward: 0.056,
        campaigns: {
            campaignA: 0.021,
            campaignB: 0.016,
            campaignC: 0.019
        }
    };

    const handleClaim = () => {
        if (!claimAmount || parseFloat(claimAmount) <= 0) {
            alert("Please enter a valid amount to claim");
            return;
        }
        
        if (parseFloat(claimAmount) > tokenData.realTimeReward) {
            alert("Cannot claim more than available reward amount");
            return;
        }
        
        console.log("Claiming:", claimAmount);
        alert(`Successfully claimed ${claimAmount} tokens!`);
        setClaimAmount("");
    };

    return (
        <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
                    <div className="space-y-8">
                        <div className="flex justify-between items-center py-4">
                            <span className="text-xl font-medium text-gray-900">Current Token:</span>
                            <span className="text-xl font-semibold text-gray-900">{tokenData.currentToken}</span>
                        </div>
                        <div className="flex justify-between items-center py-4">
                            <span className="text-xl font-medium text-gray-900">Real-time reward:</span>
                            <span className="text-xl font-semibold text-gray-900">{tokenData.realTimeReward}</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2">
                                <span className="text-xl font-medium text-gray-900 ml-16">Campaign A:</span>
                                <span className="text-xl font-semibold text-gray-900">{tokenData.campaigns.campaignA}</span>
                            </div>
                            
                            <div className="flex justify-between items-center py-2">
                                <span className="text-xl font-medium text-gray-900 ml-16">Campaign B:</span>
                                <span className="text-xl font-semibold text-gray-900">{tokenData.campaigns.campaignB}</span>
                            </div>
                            
                            <div className="flex justify-between items-center py-2">
                                <span className="text-xl font-medium text-gray-900 ml-16">Campaign C:</span>
                                <span className="text-xl font-semibold text-gray-900">{tokenData.campaigns.campaignC}</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 pt-8">
                            <label htmlFor="claimAmount" className="text-xl font-medium text-gray-900">
                                Token claiming
                            </label>
                            <input
                                type="number"
                                id="claimAmount"
                                value={claimAmount}
                                onChange={(e) => setClaimAmount(e.target.value)}
                                placeholder="Enter amount"
                                step="0.001"
                                min="0"
                                max={tokenData.realTimeReward}
                                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                            />
                            <button
                                onClick={handleClaim}
                                className="px-8 py-2 bg-white border-2 border-gray-300 text-gray-900 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                            >
                                Claim
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}