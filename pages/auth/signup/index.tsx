import React, { use, useState } from "react";
import { useSiwe } from "@/utils/useSiwe";
import TopNav from "@/components/layout/TopNav";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Mark from "@/components/common/Mark";

export default function SignUp() {
    const { isLoading, account, error, signInWithEthereum } = useSiwe();

    const [walletAddress, setWalletAddress] = useState<string>(account ?? "");
    
    const onChangedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setWalletAddress(value);
    }
    
    return (
        <div className="min-h-screen bg-white">
            <TopNav />
            <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10">
                        <div className="flex items-center justify-center my-10">
                            <Mark size={48} className="mr-3" />
                            <h1 className="text-4xl font-bold text-blue-900">Sign Up</h1>
                        </div>
                        <div className="text-gray-600 text-center my-10 space-y-2">
                            <p className="text-sm">Sign this to prove you own this wallet</p>
                            <p className="text-sm">and to sign to the application.</p>
                            <p className="text-sm">This won&apos;t cost you any gas.</p>
                        </div>
                        <Input
                            label="Wallet Address"
                            placeholder="" 
                            value={walletAddress}
                            onChange={onChangedHandler}
                            disabled={true}
                        />
                        <Button
                            title={isLoading ? "Signing In..." : "Sign up with wallet"}
                            onClick={signInWithEthereum}
                            disabled={isLoading}
                        />
                        {error && <p style={{ color: "red" }}>{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}