import React from "react";
import { BrowserProvider } from "ethers";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import TopNav from "@/components/layout/TopNav";
import Button from "@/components/common/Button";
import Mark from "@/components/common/Mark";
import { signIn } from "@/actions/auth";
import { useAuth } from "@/context";
import { setAuthToken } from "@/utils/setAuthToken";

export default function SignIn() {

    const router = useRouter();
    const { login, loadingState } = useAuth();

    const onSignInClicked = async () => {
        if (typeof window !== "undefined" && window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                }) as string[];

                if (accounts.length === 0) {
                    toast.error("No accounts found");
                    return;
                }

                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();

                const address = await signer.getAddress()

                const data = await signIn(address, loadingState);
                if (data.result) {
                    toast.success("Successfully signed in!");
                    login(data.user);
                    setAuthToken(data.token);
                    router.push("/leaderboard");
                }
            } catch (err) {
                toast.error("Failed to sign in with Ethereum.");
            }
        } else {
            toast.error("Ethereum provider is not available.");
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <TopNav />
            <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10">
                        <div className="flex items-center justify-center my-10">
                            <Mark size={48} className="mr-3" />
                            <h1 className="text-4xl font-bold text-blue-900">Sign In</h1>
                        </div>

                        <div className="text-gray-600 text-center my-10 space-y-2">
                            <p className="text-sm">Sign this to prove you own this wallet</p>
                            <p className="text-sm">and to sign to the application.</p>
                            <p className="text-sm">This won&apos;t cost you any gas.</p>
                        </div>

                        <Button className="w-full" title="Sign In" onClick={onSignInClicked} variant="secondary" />
                    </div>
                </div>
            </div>
        </div>
    );
}