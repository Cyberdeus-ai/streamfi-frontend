import api from "@/utils/api";
import toast from "react-hot-toast";

export type ClaimInfo = {
  currentToken: number; // total token balance or accumulated
  availableToWithdraw: number; // claimable now
  campaigns: Record<string, number>; // per-campaign breakdown
};

export const getClaimInfo = async (): Promise<ClaimInfo | null> => {
  try {
    const res = await api.get("/token/claim-info");
    return res.data as ClaimInfo;
  } catch (err) {
    toast.error(`Error: ${err}`);
    return null;
  }
};

export const withdrawTgn = async (amount: number) => {
  try {
    const res = await api.post("/token/withdraw", { amount });
    return res.data; // expected: { result: boolean, txHash?: string, message?: string }
  } catch (err) {
    toast.error(`Error: ${err}`);
    throw err;
  }
};