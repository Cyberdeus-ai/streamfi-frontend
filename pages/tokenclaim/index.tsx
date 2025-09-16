import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract, formatEther } from "ethers";
import toast from "react-hot-toast";
import { useAuth } from "@/context";
import { GDAv1ForwarderAddress, GDAv1ForwarderABI } from "@/utils/contants";
import { getCampaignListByUser } from "@/actions/claim";
import DropDown from "@/components/common/DropDown";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

type ClaimInfo = {
    currentToken: number;
    availableToWithdraw: number;
    campaigns: Record<string, number>;
};

export default function TokenClaim() {
    const [balance, setBalance] = useState<string>("");
    const [totalReward, setTotalReward] = useState<string>("")
    const [rewards, setRewards] = useState<any[]>([]);
    const [selectedPoolAddress, setSelectedPoolAddress] = useState<string>("");
    const [amount, setAmount] = useState<string>("");

    const { isAuthenticated, loadingState, loading } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            const rewardList = await getCampaignListByUser(loadingState);
            const poolList = rewardList.map((campaign: any) => {
                return {
                    address: campaign.reward_pool,
                    handles: `@${campaign.handles.join(", @")}`,
                    balance: campaign.balance
                }
            });

            const total = poolList.reduce((acc: number, curr: any) => acc + parseFloat(curr.balance), 0);
            setTotalReward(total);
            setRewards(poolList);
            setSelectedPoolAddress(poolList[0]?.address);
            if (typeof window.ethereum !== 'undefined') {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new BrowserProvider(window.ethereum as any);
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                const network = await provider.getNetwork();
                if (network.chainId.toString() !== '11155111') {
                    toast(`Error: MetaMask is not connected to Sepolia. Current ChainId: ${network.chainId}`);
                    return;
                }
                const signerBalance = await provider.getBalance(address);
                setBalance(formatEther(signerBalance.toString()));
            }
        };
        fetchData();
    }, []);

    const handleClaimFromPool = async () => {
        if (!isAuthenticated) {
            toast.error("Please sign in to claim.");
            return;
        }

        if (!selectedPoolAddress || selectedPoolAddress.trim().length !== 42) {
            toast.error("Enter a valid pool address.");
            return;
        }
        if (typeof window === 'undefined' || !(window as any).ethereum) {
            toast.error("Wallet not available");
            return;
        }
        try {
            loadingState(true);
            const provider = new BrowserProvider((window as any).ethereum);
            await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
            const signer = await provider.getSigner();
            const network = await provider.getNetwork();
            if (network.chainId.toString() !== '11155111') {
                toast.error(`Please switch MetaMask to Sepolia. Current chainId: ${network.chainId}`);
                return;
            }

            const forwarder = new Contract(GDAv1ForwarderAddress, GDAv1ForwarderABI, signer);
            const tx = await forwarder.claimAll(selectedPoolAddress, await signer.getAddress(), '0x');
            await tx.wait();
            toast.success("Claimed available $TGN from pool");

        } catch (err: any) {
            const message = err?.reason || err?.message || String(err);
            toast.error(`Error: ${message}`);
        } finally {
            loadingState(false);
        }
    };

    return (
        <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-medium text-gray-900">Current Token:</span>
                            <span className="text-xl font-semibold text-gray-900">
                                {`${loading ? "-" : Number(balance).toFixed(5) ?? 0} ETH`}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-medium text-gray-900">Real time reward:</span>
                            <span className="text-xl font-semibold text-gray-900">
                                {`${loading ? "-" : Number(totalReward).toFixed(5) ?? 0} ETHx`}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <div className="ml-10">
                                {loading && (
                                    <div className="p-3 text-gray-500">Loading...</div>
                                )}
                                {!loading && rewards && rewards.length > 0 && rewards.map((reward: any, index: number) => {
                                    return (<div key={index} className="flex justify-between items-center py-2 px-3">
                                        <span className="text-base text-gray-800">{reward.handles}</span>
                                        <span className="text-base font-semibold text-gray-900">{reward.balance ? reward.balance : "0.00000"} ETHx</span>
                                    </div>)
                                })}
                            </div>
                        </div>

                        <div className="w-full">
                            <DropDown
                                label="Campaign"
                                name="selectedPoolAddress"
                                value={selectedPoolAddress}
                                options={rewards?.map((reward: any) => ({
                                    label: `${reward.handles} - ${reward.address}`, value: reward.address, disabled: false
                                }))}
                                onChange={(e) => { console.log(e); setSelectedPoolAddress(e.target.value as string) }}
                            />
                        </div>
                        <div className="w-full">
                            <Input
                                label="Amount to withdraw"
                                name="amount"
                                type="text"
                                placeholder="Enter an amount to withdraw"
                                value={amount}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const { value } = e.target;
                                    setAmount(value);
                                }}
                            />
                        </div>
                        <div className="flex flex-row justify-end">
                            <Button
                                title="Withdraw"
                                onClick={handleClaimFromPool}
                                variant="secondary"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}