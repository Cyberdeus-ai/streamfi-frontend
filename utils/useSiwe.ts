import { useState } from "react";
import { BrowserProvider } from "ethers";
import { SiweMessage } from "siwe";
import { getNonce, verify } from "@/actions/auth";

const scheme = window.location.protocol.slice(0, -1);
const domain = window.location.host;
const origin = window.location.origin;

export const useSiwe = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [account, setAccount] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    // Create a SIWE message; return null when nonce fetch fails
    const createSiweMessage = async (
        address: string,
        statement: string
    ): Promise<{ message: string; nonce: string } | null> => {
        const data = await getNonce();

        if (data?.result) {
            const message = new SiweMessage({
                scheme,
                domain,
                address,
                statement,
                uri: origin,
                version: '1',
                chainId: 1,
                nonce: data.nonce,
            });

            return {
                message: message.prepareMessage(),
                nonce: data.nonce as string,
            };
        }

        return null;
    };

    const signInWithEthereum = async () => {
        let result = false;
        setIsLoading(true);
        setError(null);

        if (typeof window !== "undefined" && window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                }) as string[];

                if (accounts.length === 0) {
                    setError("No accounts found");
                    return false;
                }
                
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();

                const address = await signer.getAddress()
                const siwe = await createSiweMessage(
                    address,
                    'Sign up with wallet to the app.'
                );

                if (!siwe) {
                    setError('Failed to create SIWE message.');
                    return false;
                }

                const { message, nonce } = siwe;
                const signature = await signer.signMessage(message);

                const data = await verify(message, signature, nonce, address);
                
                if(data.result) {
                    result = true;
                    setAccount(address);
                }
            } catch (err) {
                setError("Failed to connect to wallet.");
            }
        } else {
            setError("Wallet is not available.");
        }
        setIsLoading(false);
        return result;
    };

    return {
        isLoading,
        account,
        error,
        signInWithEthereum,
    };
};