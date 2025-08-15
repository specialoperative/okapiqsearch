"use client";

import React from "react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function AccountPage() {
  const { user, token, loading, refreshMe } = useAuth();
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, "");
  const [saving, setSaving] = React.useState(false);
  const [fullName, setFullName] = React.useState(user?.full_name || "");
  const [company, setCompany] = React.useState(user?.company || "");
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    setFullName(user?.full_name || "");
    setCompany(user?.company || "");
  }, [user]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setMessage(null);
    try {
      // Optional: if backend supports update. If not, just show local confirmation.
      const res = await fetch(`${apiBase}/auth/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ full_name: fullName, company })
      });
      if (res.ok) {
        await refreshMe();
        setMessage('Profile updated');
      } else {
        setMessage('Saved locally (server update not available in this build).');
      }
    } catch {
      setMessage('Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Account</h1>
      {loading ? (
        <p>Loading...</p>
      ) : !user ? (
        <p className="text-sm">Please sign in to manage your account.</p>
      ) : (
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input value={user.email} disabled className="mt-1 w-full border rounded-md px-3 py-2 bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full name</label>
            <input value={fullName} onChange={(e)=>setFullName(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input value={company} onChange={(e)=>setCompany(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Subscription</label>
              <input value={(user.subscription_tier || 'explorer').toUpperCase()} disabled className="mt-1 w-full border rounded-md px-3 py-2 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <input value="Active" disabled className="mt-1 w-full border rounded-md px-3 py-2 bg-gray-50" />
            </div>
          </div>
          {message && <p className="text-sm text-emerald-700">{message}</p>}
          <button type="submit" disabled={saving} className="bg-emerald-600 text-white rounded-md px-4 py-2 hover:bg-emerald-700 disabled:opacity-60">{saving? 'Saving...':'Save changes'}</button>
        </form>
      )}
    </main>
  );
}


