import { useState } from "react";
import { ethers } from "ethers";

export const useSiwe = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [account, setAccount] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const signInWithEthereum = async () => {
        setIsLoading(true);
        setError(null);

        if (typeof window !== "undefined" && window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                }) as string[];

                if (accounts.length === 0) {
                    setError("No accounts found");
                    return;
                }

                const userAddress = accounts[0];
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();

                const message = `Sign this message to log in: ${new Date().toISOString()}`;
                const signature = await signer.signMessage(message);

                setAccount(userAddress);
                console.log("User Address: ", userAddress);
                console.log("Signature: ", signature);
                
            } catch (err) {
                console.error("Error signing in:", err);
                setError("Failed to sign in with Ethereum.");
            }
        } else {
            setError("Ethereum provider is not available.");
        }

        setIsLoading(false);
    };

    return {
        isLoading,
        account,
        error,
        signInWithEthereum,
    };
};