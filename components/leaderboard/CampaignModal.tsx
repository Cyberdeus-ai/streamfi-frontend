import React, { ChangeEvent, useEffect, useState } from "react";
import { BrowserProvider, Contract, parseEther, formatEther, Interface, id, getAddress } from "ethers";
import toast from "react-hot-toast";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import Toggle from "../common/Toggle";
import TagInput from "../common/TagInput";
import moment from 'moment';
import { createCampaign } from "@/actions/campaign";
import { useAuth } from "@/context";
import { GDAv1Forwarder } from "@/utils/contants";

type CampaignModalProps = {
    isOpen: boolean;
    onClose: () => void;
    setList: React.Dispatch<React.SetStateAction<Campaign[]>>;
}

type Campaign = {
    startDate?: Date;
    endDate?: Date;
    hashtags?: string[];
    tickers?: string[];
    handles?: string[];
    rewardPool?: string;
    bigAccounts?: string[];
}

type CampaignEmpty = {
    startDate?: boolean;
    endDate?: boolean;
    hashtags?: boolean;
    tickers?: boolean;
    handles?: boolean;
    rewardPool?: boolean;
    bigAccounts?: boolean;
}

const forwarderAddress = '0x6DA13Bde224A05a288748d857b9e7DDEffd1dE08';
const forwarderABI = GDAv1Forwarder;

const CampaignModal = ({ isOpen, onClose, setList }: CampaignModalProps) => {
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [superTokenAddress, setSuperTokenAddress] = useState("");
    const [adminAddress, setAdminAddress] = useState<string>("");
    const [isPool, setIsPool] = useState<boolean>(false);
    const [isWrap, setIsWrap] = useState<boolean>(false);
    const [status, setStatus] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [balance, setBalance] = useState<string>('');
    const [errors, setErrors] = useState<CampaignEmpty | null>(null);

    const { isAuthenticated, loadingState } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const provider = new BrowserProvider(window.ethereum as any);
                    const signer = await provider.getSigner();
                    const address = await signer.getAddress();
                    const network = await provider.getNetwork();
                    if (network.chainId.toString() !== '11155111') {
                        toast(`Error: MetaMask is not connected to Sepolia. Current ChainId: ${network.chainId}`);
                        return;
                    }
                    setAdminAddress(address);
                    const signerBalance = await provider.getBalance(address);
                    setBalance(formatEther(signerBalance));
                } catch (err) {
                    console.error('Error:', err);
                    const message = (err as any)?.reason || (err as any)?.message || String(err);
                    setStatus('Error: ' + message);
                }
            }
        }
        fetchData();
    }, [])

    const onInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCampaign({
            ...campaign,
            [name]: value
        })
        if (value) setErrors((prev) => { return { ...prev, [name]: false } });
        else setErrors((prev) => { return { ...prev, [name]: true } });
    }

    const onTagInputChanged = (name: string, values: string[]) => {
        setCampaign({
            ...campaign,
            [name]: values
        });
        if (values && values.length > 0) setErrors((prev) => { return { ...prev, [name]: false } });
        else setErrors((prev) => { return { ...prev, [name]: true } });
    }

    const onOkBtnClicked = async () => {
        if (campaign) {
            const isEmpty = Object.entries(campaign).every((_key: any, value: any) => value);
            if (!isEmpty) {
                const data = await createCampaign(campaign, loadingState);
                setList(prevList => [...prevList, data]);
                setCampaign(null);
                onClose();
            }
        } else {
            setErrors({
                startDate: true,
                endDate: true,
                hashtags: true,
                tickers: true,
                handles: true,
                rewardPool: true,
                bigAccounts: true
            })
        }
    }

    const onCancelBtnClicked = () => {
        setCampaign(null);
        onClose();
    }

    const wrapTokens = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                loadingState(true);
                const ethxAddress = "0x30a6933Ca9230361972E413a15dC8114c952414e"
                const ethxAbi = ["function upgradeByETH() payable external"];

                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const network = await provider.getNetwork();
                if (network.chainId.toString() !== '11155111') {
                    toast(`Error: MetaMask is not connected to Sepolia. Current ChainId: ${network.chainId}`);
                    return;
                }

                const ethxContract = new Contract(ethxAddress, ethxAbi, signer);

                const amountInWei = parseEther(amount);

                setStatus('Approval successful. Wrapping tokens...');

                const tx = await ethxContract.upgradeByETH({ value: amountInWei });
                const receipt = await tx.wait();

                if (receipt.status) {
                    setStatus('Tokens successfully wrapped!');
                    setSuperTokenAddress(receipt.to);
                    setIsWrap(false);
                }
            } catch (err) {
                console.error('Error:', err);
                const message = (err as any)?.reason || (err as any)?.message || String(err);
                setStatus('Error: ' + message);
            } finally {
                loadingState(false);
            }
        } else {
            setStatus('Please install MetaMask!');
        }
    };

    const createPool = async () => {
        if (!isAuthenticated) {
            toast.error('Wallet not connected. Please connect your wallet first.', { duration: 3000 });
            return;
        }

        if (typeof window.ethereum !== 'undefined') {
            try {
                loadingState(true);
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const network = await provider.getNetwork();
                if (network.chainId.toString() !== '11155111') {
                    toast(`Error: MetaMask is not connected to Sepolia. Current ChainId: ${network.chainId}`);
                    return;
                }

                const poolCreateEvent = 'PoolCreated(address,address,address)'
                const hash = id(poolCreateEvent);

                const contract = new Contract(forwarderAddress, forwarderABI, signer);

                const config = {
                    transferabilityForUnitsOwner: 0,
                    distributionFromAnyAddress: false
                };

                const tx = await contract.createPool(superTokenAddress, adminAddress, config);
                const receipt = await tx.wait();

                const poolLog = receipt.logs.find((log: any) => hash === log.topics[0]);

                if (poolLog) {
                    const poolAddress = getAddress('0x' + poolLog.topics[0].slice(26));
                    setCampaign((prev) => {
                        return {
                            ...prev,
                            rewardPool: poolAddress
                        }
                    });
                    setIsPool(false);
                    toast.success(`Pool created successfully`, { duration: 5000 });
                }

            } catch (error) {
                console.error('Error creating pool:', error);
                toast.error('Failed to create pool. Please try again.', { duration: 3000 });
            } finally {
                loadingState(false);
            }
        }
    };

    return (
        <Modal
            title="Campaign Setup"
            isOpen={isOpen}
            onClose={onClose}
            onOk={onOkBtnClicked}
            onCancel={onCancelBtnClicked}
        >
            <div className="flex flex-col">
                <div className="flex flex-row justify-between items-center">
                    <Input
                        label="Start date"
                        name="startDate"
                        type="date"
                        placeholder="XXXX-XX-XX"
                        value={moment(campaign?.startDate ?? null).format('YYYY-MM-DD')}
                        onChange={onInputChanged}
                        error={errors?.startDate}
                    />
                    <Input
                        label="End date"
                        name="endDate"
                        type="date"
                        placeholder="XXXX-XX-XX"
                        value={moment(campaign?.endDate ?? null).format('YYYY-MM-DD')}
                        onChange={onInputChanged}
                        error={errors?.endDate}
                    />
                </div>
                <div className="w-full">
                    <TagInput
                        label="Hashtags"
                        name="hashtags"
                        value={campaign?.hashtags || []}
                        onChange={onTagInputChanged}
                        placeholder="Enter to add more..."
                        error={errors?.hashtags}
                    />
                </div>
                <div className="w-full">
                    <TagInput
                        label="Tickers"
                        name="tickers"
                        value={campaign?.tickers || []}
                        onChange={onTagInputChanged}
                        placeholder="Enter to add more..."
                        error={errors?.tickers}

                    />
                </div>
                <div className="w-full">
                    <TagInput
                        label="Handles"
                        name="handles"
                        value={campaign?.handles || []}
                        onChange={onTagInputChanged}
                        placeholder="Enter to add more..."
                        error={errors?.handles}
                    />
                </div>
                <div className="w-full">
                    <TagInput
                        label="Big accounts"
                        name="bigAccounts"
                        value={campaign?.bigAccounts || []}
                        onChange={onTagInputChanged}
                        placeholder="Enter to add more..."
                        error={errors?.bigAccounts}
                    />
                </div>
                <div className="w-full">
                    <Toggle
                        label="Create distribution pool"
                        active={isPool}
                        onToggle={() => {
                            setIsPool((prev) => !prev);
                            setIsWrap(false);
                        }} />
                </div>
                {
                    !isPool ? (
                        <div className="w-full">
                            <Input
                                label="Reward pool"
                                name="rewardPool"
                                type="text"
                                placeholder="Enter a pool address"
                                value={campaign?.rewardPool ?? ""}
                                onChange={onInputChanged}
                                error={errors?.rewardPool}
                            />
                        </div>
                    ) : (
                        <>
                            {
                                isWrap ? (
                                    <>
                                        <div className="w-full">
                                            <Input
                                                label="Amount to wrap"
                                                name="amount"
                                                type="text"
                                                placeholder="Enter an amount to wrap"
                                                value={amount}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    const { value } = e.target;
                                                    setAmount(value);
                                                }}
                                                onBlur={() => {
                                                    if (Number(amount) > Number(balance)) setAmount(balance);
                                                }}
                                                error={amount.trim() === ''}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-full">
                                            <Input
                                                label="Super token address"
                                                name="superTokenAddress"
                                                type="text"
                                                placeholder="Enter a super token address"
                                                value={superTokenAddress}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    const { value } = e.target;
                                                    setSuperTokenAddress(value);
                                                }}
                                                error={superTokenAddress.trim() === ''}
                                            />
                                        </div>
                                        <div className="w-full">
                                            <Input
                                                label="Admin address"
                                                name="adminAddress"
                                                type="text"
                                                placeholder="Enter a super token address"
                                                value={adminAddress}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    const { value } = e.target;
                                                    setAdminAddress(value);
                                                }}
                                                error={adminAddress.trim() === ''}
                                            />
                                        </div>

                                    </>
                                )
                            }
                            <div className="w-full flex flex-row justify-end items-center gap-x-2 mt-2">
                                {
                                    isWrap && (
                                        <>
                                            <span className="text-lg">Balance: {Number(balance).toFixed(5)} ETH</span>
                                            <button
                                                className="cursor-pointer font-semibold py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 focus:outline-none"
                                                onClick={() => setAmount(balance)}
                                            >
                                                Max
                                            </button>
                                        </>
                                    )
                                }
                                <Toggle
                                    label="Wrap"
                                    active={isWrap}
                                    onToggle={() => setIsWrap((prev) => !prev)}
                                />
                            </div>
                            {
                                isWrap ? (
                                    <div className="flex flex-row justify-start">
                                        <Button title="Wrap" onClick={wrapTokens} variant="secondary" />
                                    </div>
                                ) : (

                                    <div className="flex flex-row justify-start mt-5">
                                        <Button title="Create" onClick={createPool} variant="secondary" />
                                    </div>
                                )
                            }
                        </>
                    )
                }
                <div className="w-full text-lg text-red-600">
                    {status}
                </div>
            </div>
        </Modal>
    );
}

export default CampaignModal;