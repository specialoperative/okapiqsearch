"use client";

import React from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import BuyBoxForm from "@/components/BuyBoxForm";
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('../../components/interactive-map'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>
});

interface BuyBox {
  id: number;
  name: string;
  industries: string[];
  location_type: string;
  allowed_locations: string[];
  min_ebitda: number | null;
  min_revenue: number | null;
  min_ebitda_multiple: number | null;
  min_purchase_price: number | null;
  max_purchase_price: number | null;
  requires_management: boolean;
  remote_ownable: boolean;
  overseas_outsourcing: boolean;
  recurring_revenue: boolean;
  low_customer_concentration: boolean;
  max_customer_concentration: number | null;
  asset_purchase: boolean;
  stock_purchase: boolean;
  seller_financing: boolean;
  sba_guidelines: boolean;
  contact_emails: string[];
  contact_notes: string;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

export default function BuyBoxPage() {
  const { user, token, loading } = useAuth();
  const [buyBoxes, setBuyBoxes] = React.useState<BuyBox[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [editingBuyBox, setEditingBuyBox] = React.useState<BuyBox | null>(null);
  const [loadingBuyBoxes, setLoadingBuyBoxes] = React.useState(true);
  const [message, setMessage] = React.useState<string | null>(null);

  const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, "");

  const fetchBuyBoxes = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${apiBase}/buy-box/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBuyBoxes(data);
      }
    } catch (error) {
      console.error('Failed to fetch buy boxes:', error);
    } finally {
      setLoadingBuyBoxes(false);
    }
  };

  React.useEffect(() => {
    if (!loading && token) {
      fetchBuyBoxes();
    }
  }, [loading, token]);

  const handleSave = async (buyBoxData: any) => {
    try {
      const url = editingBuyBox 
        ? `${apiBase}/buy-box/${editingBuyBox.id}`
        : `${apiBase}/buy-box/`;
      
      const method = editingBuyBox ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(buyBoxData)
      });

      if (res.ok) {
        setMessage(editingBuyBox ? 'Buy box updated successfully!' : 'Buy box created successfully!');
        setShowForm(false);
        setEditingBuyBox(null);
        fetchBuyBoxes();
      } else {
        setMessage('Failed to save buy box');
      }
    } catch (error) {
      setMessage('Error saving buy box');
      console.error('Save error:', error);
    }
  };

  const handleDelete = async (buyBoxId: number) => {
    if (!confirm('Are you sure you want to delete this buy box?')) return;

    try {
      const res = await fetch(`${apiBase}/buy-box/${buyBoxId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setMessage('Buy box deleted successfully!');
        fetchBuyBoxes();
      } else {
        setMessage('Failed to delete buy box');
      }
    } catch (error) {
      setMessage('Error deleting buy box');
      console.error('Delete error:', error);
    }
  };

  const handleEdit = (buyBox: BuyBox) => {
    setEditingBuyBox(buyBox);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBuyBox(null);
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-10">
        <p>Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-sm">You are not signed in. <a href="/signin" className="text-emerald-700">Sign in</a></p>
      </main>
    );
  }

  if (showForm) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-10">
        <BuyBoxForm
          buyBox={editingBuyBox || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Buy Box Management</h1>
          <p className="text-gray-600 mt-1">Define your acquisition criteria to match with relevant opportunities</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
        >
          Create Buy Box
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
          <button onClick={() => setMessage(null)} className="ml-2 text-green-900">×</button>
        </div>
      )}

      {loadingBuyBoxes ? (
        <p>Loading buy boxes...</p>
      ) : buyBoxes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Buy Boxes Yet</h3>
          <p className="text-gray-500 mb-4">Create your first buy box to start matching with acquisition opportunities</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Create Your First Buy Box
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {buyBoxes.map(buyBox => (
            <div key={buyBox.id} className="bg-white border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{buyBox.name}</h3>
                  <p className="text-sm text-gray-500">
                    Created {new Date(buyBox.created_at).toLocaleDateString()}
                    {buyBox.updated_at && ` • Updated ${new Date(buyBox.updated_at).toLocaleDateString()}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/buy-box/${buyBox.id}/matches`}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    View Matches
                  </a>
                  <button
                    onClick={() => handleEdit(buyBox)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(buyBox.id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-700">Industries</div>
                  <div className="text-gray-600">
                    {buyBox.industries.length > 0 ? buyBox.industries.join(', ') : 'Any'}
                  </div>
                </div>
                
                <div>
                  <div className="font-medium text-gray-700">Revenue Range</div>
                  <div className="text-gray-600">
                    {formatCurrency(buyBox.min_revenue)} - {formatCurrency(buyBox.max_purchase_price)}
                  </div>
                </div>

                <div>
                  <div className="font-medium text-gray-700">Min EBITDA</div>
                  <div className="text-gray-600">{formatCurrency(buyBox.min_ebitda)}</div>
                </div>

                <div>
                  <div className="font-medium text-gray-700">EBITDA Multiple</div>
                  <div className="text-gray-600">
                    {buyBox.min_ebitda_multiple ? `${buyBox.min_ebitda_multiple}x+` : 'Not specified'}
                  </div>
                </div>

                <div>
                  <div className="font-medium text-gray-700">Contact Emails</div>
                  <div className="text-gray-600">
                    {buyBox.contact_emails.length > 0 ? buyBox.contact_emails.join(', ') : 'None'}
                  </div>
                </div>

                <div>
                  <div className="font-medium text-gray-700">Preferences</div>
                  <div className="text-gray-600">
                    {[
                      buyBox.recurring_revenue && 'Recurring Revenue',
                      buyBox.remote_ownable && 'Remote Ownable',
                      buyBox.requires_management && 'Strong Management',
                      buyBox.overseas_outsourcing && 'Overseas Outsourcing'
                    ].filter(Boolean).join(', ') || 'None specified'}
                  </div>
                </div>
              </div>

              {buyBox.contact_notes && (
                <div className="mt-4 pt-4 border-t">
                  <div className="font-medium text-gray-700 text-sm">Notes</div>
                  <div className="text-gray-600 text-sm mt-1">{buyBox.contact_notes}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Crime Map Section */}
      <div className="mt-12 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Market Safety Intelligence</h2>
          <p className="text-gray-600">
            Evaluate crime trends in target acquisition areas using real-time Crimeometer data.
            Crime patterns can affect business valuations, customer foot traffic, and operational costs.
          </p>
        </div>
        
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Live Crime Data</h3>
                <p className="text-sm text-gray-600">Powered by Crimeometer API • Updated in real-time</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>High Crime</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span>Moderate Crime</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Low Crime</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="h-96">
            <InteractiveMap
              searchTerm="United States"
              businesses={[]}
              onBusinessSelect={() => {}}
              crimeCity="us"
              crimeDaysBack={365}
              showHeat={true}
              className="h-full w-full"
            />
          </div>
          
          <div className="p-4 bg-gray-50 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-700">Data Coverage</div>
                <div className="text-gray-600">800+ US cities with real-time updates</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Time Range</div>
                <div className="text-gray-600">Last 365 days of crime incidents</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Use Cases</div>
                <div className="text-gray-600">Due diligence, risk assessment, valuation impact</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
