"use client";

import React from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useParams } from "next/navigation";

interface Business {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  website: string;
  industry: string;
  estimated_revenue: number;
  employee_count: number;
  years_in_business: number;
  yelp_rating: number;
  yelp_review_count: number;
  succession_risk_score: number;
  owner_age_estimate: number;
  market_share_percent: number;
  lead_score: number;
}

interface BusinessMatch {
  business: Business;
  match_score: number;
  estimated_ebitda: number;
  estimated_purchase_price: number;
  match_reasons: string[];
}

export default function BuyBoxMatchesPage() {
  const { user, token, loading } = useAuth();
  const params = useParams();
  const buyBoxId = params.id;

  const [matches, setMatches] = React.useState<BusinessMatch[]>([]);
  const [buyBox, setBuyBox] = React.useState<any>(null);
  const [totalMatches, setTotalMatches] = React.useState(0);
  const [loadingMatches, setLoadingMatches] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, "");

  React.useEffect(() => {
    const fetchMatches = async () => {
      if (!token || !buyBoxId) return;
      
      try {
        const res = await fetch(`${apiBase}/buy-box/${buyBoxId}/matches`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setBuyBox(data.buy_box);
          setMatches(data.matches);
          setTotalMatches(data.total_matches);
        } else {
          setError('Failed to fetch matches');
        }
      } catch (error) {
        setError('Error fetching matches');
        console.error('Fetch error:', error);
      } finally {
        setLoadingMatches(false);
      }
    };

    if (!loading && token) {
      fetchMatches();
    }
  }, [loading, token, buyBoxId, apiBase]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  if (loading || loadingMatches) {
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

  if (error) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <a href="/buy-box" className="text-emerald-700 hover:text-emerald-900">← Back to Buy Boxes</a>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <a href="/buy-box" className="hover:text-gray-900">Buy Boxes</a>
          <span>→</span>
          <span>{buyBox?.name}</span>
          <span>→</span>
          <span className="text-gray-900">Matches</span>
        </div>
        <h1 className="text-2xl font-bold">Buy Box Matches</h1>
        <p className="text-gray-600 mt-1">
          {totalMatches} businesses match your criteria for "{buyBox?.name}"
        </p>
      </div>

      {/* Buy Box Summary */}
      {buyBox && (
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Acquisition Criteria</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-medium text-gray-700">Industries</div>
              <div className="text-gray-600">
                {buyBox.industries?.length > 0 ? buyBox.industries.join(', ') : 'Any'}
              </div>
            </div>
            <div>
              <div className="font-medium text-gray-700">Min Revenue</div>
              <div className="text-gray-600">{formatCurrency(buyBox.min_revenue || 0)}</div>
            </div>
            <div>
              <div className="font-medium text-gray-700">Min EBITDA</div>
              <div className="text-gray-600">{formatCurrency(buyBox.min_ebitda || 0)}</div>
            </div>
            <div>
              <div className="font-medium text-gray-700">Purchase Price Range</div>
              <div className="text-gray-600">
                {formatCurrency(buyBox.min_purchase_price || 0)} - {formatCurrency(buyBox.max_purchase_price || 0)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Matches */}
      {matches.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Matches Found</h3>
          <p className="text-gray-500 mb-4">No businesses in the database match this buy box criteria yet.</p>
          <a
            href="/oppy"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Run Market Scan to Find Businesses
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match, index) => (
            <div key={match.business.id} className="bg-white border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{match.business.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getMatchScoreColor(match.match_score)}`}>
                      {match.match_score}% Match
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {match.business.address}, {match.business.city}, {match.business.state} {match.business.zip_code}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {match.match_reasons.map((reason, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Est. Purchase Price</div>
                  <div className="text-lg font-bold text-gray-900">{formatCurrency(match.estimated_purchase_price)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-700">Industry</div>
                  <div className="text-gray-600">{match.business.industry}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Revenue</div>
                  <div className="text-gray-600">{formatCurrency(match.business.estimated_revenue)}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Est. EBITDA</div>
                  <div className="text-gray-600">{formatCurrency(match.estimated_ebitda)}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Employees</div>
                  <div className="text-gray-600">{match.business.employee_count || 'N/A'}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Years in Business</div>
                  <div className="text-gray-600">{match.business.years_in_business || 'N/A'}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Lead Score</div>
                  <div className="text-gray-600">{match.business.lead_score?.toFixed(1) || 'N/A'}</div>
                </div>
                {match.business.yelp_rating && (
                  <div>
                    <div className="font-medium text-gray-700">Yelp Rating</div>
                    <div className="text-gray-600">{match.business.yelp_rating}★ ({match.business.yelp_review_count} reviews)</div>
                  </div>
                )}
                {match.business.succession_risk_score && (
                  <div>
                    <div className="font-medium text-gray-700">Succession Risk</div>
                    <div className="text-gray-600">{match.business.succession_risk_score}%</div>
                  </div>
                )}
                {match.business.phone && (
                  <div>
                    <div className="font-medium text-gray-700">Phone</div>
                    <div className="text-gray-600">{match.business.phone}</div>
                  </div>
                )}
                {match.business.website && (
                  <div>
                    <div className="font-medium text-gray-700">Website</div>
                    <div className="text-gray-600">
                      <a href={match.business.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        Visit
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
                  Add to CRM
                </button>
                <button className="px-3 py-1 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700">
                  Contact Owner
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
