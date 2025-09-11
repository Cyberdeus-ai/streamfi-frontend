import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/context";
import { getClaimInfo, withdrawTgn, type ClaimInfo } from "@/actions/token";

export default function TokenClaim() {
  const { isAuthenticated } = useAuth();

  const [claimAmount, setClaimAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);
  const [info, setInfo] = useState<ClaimInfo | null>(null);

  useEffect(() => {
    const load = async () => {
      setFetching(true);
      const data = await getClaimInfo();
      if (data) setInfo(data);
      setFetching(false);
    };
    load();
  }, []);

  const available = useMemo(() => info?.availableToWithdraw ?? 0, [info]);

  const onMax = () => {
    if (!info) return;
    setClaimAmount(String(available));
  };

  const handleWithdraw = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to withdraw.");
      return;
    }

    const amount = parseFloat(claimAmount);
    if (!claimAmount || isNaN(amount) || amount <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }
    if (amount > available) {
      toast.error("Amount exceeds available to withdraw.");
      return;
    }

    try {
      setLoading(true);
      const res = await withdrawTgn(amount);
      if (res?.result) {
        toast.success(
          res.txHash ? `Withdrawal submitted. Tx: ${res.txHash}` : "Withdrawal successful"
        );
        // Refresh info
        const fresh = await getClaimInfo();
        if (fresh) setInfo(fresh);
        setClaimAmount("");
      } else {
        toast.error(res?.message || "Withdrawal failed");
      }
    } catch (e) {
      // handled by api layer
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <div className="space-y-8">
            <div className="flex justify-between items-center py-4">
              <span className="text-xl font-medium text-gray-900">Current Token:</span>
              <span className="text-xl font-semibold text-gray-900">
                {fetching ? "-" : info?.currentToken ?? 0}
              </span>
            </div>
            <div className="flex justify-between items-center py-4">
              <span className="text-xl font-medium text-gray-900">Available to withdraw:</span>
              <span className="text-xl font-semibold text-gray-900">
                {fetching ? "-" : available}
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-lg font-medium text-gray-900">Campaign breakdown</div>
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-md">
                {fetching && (
                  <div className="p-3 text-gray-500">Loading...</div>
                )}
                {!fetching && info &&
                  Object.entries(info.campaigns || {}).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center py-2 px-3">
                      <span className="text-base text-gray-800">{key}</span>
                      <span className="text-base font-semibold text-gray-900">{val}</span>
                    </div>
                  ))}
                {!fetching && info && Object.keys(info.campaigns || {}).length === 0 && (
                  <div className="p-3 text-gray-500">No campaigns</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6 flex-wrap">
              <label htmlFor="claimAmount" className="text-xl font-medium text-gray-900">
                Withdraw $TGN
              </label>
              <div className="flex-1 min-w-64 flex items-center gap-2">
                <input
                  type="number"
                  id="claimAmount"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(e.target.value)}
                  placeholder="Enter amount"
                  step="0.001"
                  min="0"
                  max={available}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
                <button
                  type="button"
                  onClick={onMax}
                  className="px-4 py-2 bg-gray-100 border-2 border-gray-300 text-gray-900 font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                >
                  Max
                </button>
              </div>
              <button
                onClick={handleWithdraw}
                disabled={loading || fetching || !isAuthenticated}
                className="px-8 py-2 bg-white border-2 border-gray-300 text-gray-900 font-medium rounded-md hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
              >
                {isAuthenticated ? (loading ? "Withdrawing..." : "Withdraw") : "Sign in required"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}