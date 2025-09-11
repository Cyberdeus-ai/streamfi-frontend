import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSiwe } from "@/utils/useSiwe";
import TopNav from "@/components/layout/TopNav";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Mark from "@/components/common/Mark";
import RadioGroup from "@/components/common/RadioGroup";
import { signUp, setAccountType } from "@/actions/auth";
import { useAuth } from "@/context";

type UserInfoType = {
    userId: string | null;
    address?: string | null;
    twitterAccount?: string;
    accountType?: string;
};

export default function SignUp() {
    const [step, setStep] = useState<number>(0);
    const [userInfo, setUserInfo] = useState<UserInfoType>({
        userId: null,
        address: "",
        twitterAccount: "",
        accountType: "Engager"
    });

    const router = useRouter();

    const { loadingState } = useAuth();
    
    const { isLoading, account, error, signInWithEthereum } = useSiwe();

    useEffect(() => {
        if(account !== "") setUserInfo({ ...userInfo, address: account });
    }, [account]);

    const handleNextStep = async () => {
        if(step === 0) {
            const success = await signInWithEthereum();
            if(!success) return;
        }
        if(step === 1) {
            const data = await signUp(userInfo.address??"", userInfo.twitterAccount??"", loadingState);
            if(data?.result) {
                setUserInfo({ ...userInfo, userId: data.userId });    
            } else return;        
        }
        if(step === 2) {
            const success = await setAccountType(userInfo.userId??"", userInfo.accountType??"", loadingState);
            if(!success) return;
        }
        if(step === 3) {
            router.push("/auth/signin");
        }
        if(step > 3) return;    
        setStep((prev) => prev + 1);
    }

    const onUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        setUserInfo({
            ...userInfo,
            [name]: value
        });
    }

    const renderStepContent = () => {
        switch(step) {
            case 0:
                return (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10">
                        <div className="flex items-center justify-center my-10">
                            <Mark size={48} className="mr-3" />
                            <h1 className="text-4xl font-bold text-blue-900">Sign Up</h1>
                        </div>
                        <div className="flex flex-row justify-center item-center space-x-2">
                            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                            <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                            <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                            <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                        </div>
                        <div className="text-gray-600 text-center my-10 space-y-2">
                            <p className="text-sm">Sign this message to prove you own this wallet</p>
                            <p className="text-sm">and to sign to the application.</p>
                            <p className="text-sm">This won&apos;t cost you any gas.</p>
                            {error && <p className="mt-4 font-bold text-red-700">{error}</p>}
                        </div>
                        <Button
                            className="w-full"
                            title={isLoading ? "Signing Up..." : "Sign up with wallet"}
                            onClick={handleNextStep}
                            disabled={isLoading}
                            variant={isLoading ? "default" : "secondary"}
                        />
                    </div>
                );
            case 1:
                return (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10">
                        <div className="flex items-center justify-center my-10">
                            <Mark size={48} className="mr-3" />
                            <h1 className="text-4xl font-bold text-blue-900">Sign Up</h1>
                        </div>
                        <div className="flex flex-row justify-center item-center space-x-2">
                            <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                            <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                            <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                        </div>
                        <Input
                            label="Twitter Account"
                            name="twitterAccount"
                            placeholder="Username" 
                            value={userInfo.twitterAccount??""}
                            onChange={onUserInfoChange}
                        />
                        <Button
                            className="w-full mt-4"
                            title="Next"
                            onClick={handleNextStep}
                            variant="secondary"
                        />
                    </div>
                );
            case 2:
                return (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10">
                        <div className="flex items-center justify-center my-10">
                            <Mark size={48} className="mr-3" />
                            <h1 className="text-4xl font-bold text-blue-900">Sign Up</h1>
                        </div>
                        <div className="flex flex-row justify-center item-center space-x-2">
                            <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                            <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                            <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                        </div>
                        <div className="flex flex-col justify-center item-center px-15 gap-4 my-8">
                            <RadioGroup
                                label="Select account type"
                                name="accountType"
                                options={["Admin", "Engager"]} 
                                selectedValue={userInfo?.accountType??"Engager"}
                                onChange={onUserInfoChange}
                            />
                        </div>
                        <Button
                            className="w-full mt-4"
                            title="Next"
                            onClick={handleNextStep}
                            variant="secondary"
                        />
                    </div>
                );
            case 3:
                return (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10">
                        <div className="flex items-center justify-center my-10">
                            <Mark size={48} className="mr-3" />
                            <h1 className="text-4xl font-bold text-blue-900">Sign Up</h1>
                        </div>
                        <div className="flex flex-row justify-center item-center space-x-2">
                            <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                            <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                            <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                        </div>
                        <div className="text-gray-600 text-center my-10 space-y-2">
                            <p className="text-sm">Successfully</p>
                        </div>
                        <Button
                            className="w-full mt-4"
                            title="Done"
                            onClick={handleNextStep}
                            variant="secondary"
                        />
                    </div>
                );
        }
    }
    
    return (
        <div className="min-h-screen bg-white">
            <TopNav />
            <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    { renderStepContent() }    
                </div>
            </div>
        </div>
    );
}