"use client";

import React from "react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function BillingPage() {
  const { token, loading } = useAuth();
  const [status, setStatus] = React.useState<any>(null);
  const [upgrading, setUpgrading] = React.useState<string | null>(null);
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, "");

  const fetchStatus = React.useCallback(async () => {
    if (!token) return;
    const res = await fetch(`${apiBase}/auth/subscription-status`, { headers: { Authorization: `Bearer ${token}` }});
    if (res.ok) setStatus(await res.json());
  }, [token, apiBase]);

  React.useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const upgrade = async (tier: string) => {
    if (!token) return;
    setUpgrading(tier);
    try {
      const res = await fetch(`${apiBase}/auth/upgrade-subscription?new_tier=${encodeURIComponent(tier)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchStatus();
      }
    } finally {
      setUpgrading(null);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Billing</h1>
      {loading || !status ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">
          <div className="rounded border p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Current plan</div>
                <div className="text-lg font-semibold">{status.subscription_tier?.toUpperCase()}</div>
                {status.trial_expired ? (
                  <div className="text-xs text-red-600 mt-1">Trial expired</div>
                ) : (
                  <div className="text-xs text-gray-600 mt-1">Trial days remaining: {status.trial_days_remaining}</div>
                )}
              </div>
              <div className="flex gap-2">
                {['explorer','professional','elite'].map(tier => (
                  <button key={tier} onClick={()=>upgrade(tier)} disabled={upgrading!==null}
                    className={`px-3 py-2 rounded border ${status.subscription_tier===tier? 'bg-emerald-600 text-white border-emerald-600':'hover:bg-gray-50'}`}>
                    {upgrading===tier? 'Upgrading...': `Choose ${tier}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded border p-4">
            <div className="font-semibold mb-2">Plan limits</div>
            <ul className="list-disc pl-6 text-sm text-gray-700">
              <li>Leads/month: {status.limits?.leads_per_month}</li>
              <li>Market scans/month: {status.limits?.market_scans_per_month}</li>
              <li>API calls/day: {status.limits?.api_calls_per_day}</li>
              <li>Exports: {(status.limits?.export_formats||[]).join(', ')}</li>
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}


