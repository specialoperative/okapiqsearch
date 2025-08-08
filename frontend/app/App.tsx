"use client";

import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import LandingPage from '../components/landing-page';
import Dashboard from '../components/dashboard';
import SolutionsPage from '../components/solutions-page';
import CaseStudiesPage from '../components/case-studies-page';
import MarketAnalysisPage from '../components/market-analysis-page';
import MarketScannerPage from '../components/market-scanner-page';
import CRMPage from '../components/crm-page';
import PricingSection from '../components/pricing';

type Page = 'landing' | 'dashboard' | 'solutions' | 'case-studies' | 'market-analysis' | 'market-scanner' | 'crm' | 'how-it-works' | 'products' | 'pricing' | 'signin';

function getPageFromUrl(): Page {
  if (typeof window === 'undefined') return 'landing';
  const url = new URL(window.location.href);
  const p = (url.searchParams.get('page') || 'landing') as Page;
  const valid: Page[] = ['landing', 'dashboard', 'solutions', 'case-studies', 'market-analysis', 'market-scanner', 'crm'];
  return valid.includes(p) ? p : 'landing';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(getPageFromUrl());

  useEffect(() => {
    const onPop = () => setCurrentPage(getPageFromUrl());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const handleNavigate = (page: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', page);
    window.history.pushState({}, '', url.toString());
    setCurrentPage(page as Page);
  };

  const renderPage = () => {
    const BackHeader = ({ title }: { title: string }) => (
      <div className="bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3">
          <button
            onClick={() => handleNavigate('landing')}
            className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </button>
          <span className="ml-2 text-sm text-gray-500">/</span>
          <h1 className="ml-1 text-lg font-semibold">{title}</h1>
        </div>
      </div>
    );

    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'how-it-works':
        return (
          <>
            <BackHeader title="How it Works" />
            <div className="max-w-5xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-extrabold mb-4">How it Works</h1>
            <p className="text-gray-700 mb-6">Your data pipeline: Smart Crawler Hub → Data Normalizer → Enrichment Engine → Scoring + Vectorizer → API/DB.</p>
            <ol className="list-decimal pl-6 space-y-2 text-gray-800">
              <li>Trigger scan from the UI or schedule with Airflow/Prefect</li>
              <li>Crawlers collect Google/Yelp/Records data</li>
              <li>Normalizer builds clean JSON schema</li>
              <li>Enrichment adds Census/SOS/IRS/NER</li>
              <li>Scores generate Succession, TAM, Fragmentation</li>
              <li>Results persist to DB and power the map</li>
            </ol>
            </div>
          </>
        );
      case 'products':
        return (
          <>
            <BackHeader title="Products" />
            <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-6">
            {[
              { title: 'Oppy (Opportunity Finder)', desc: 'Income & demand-driven sourcing, heatmaps and signals.' },
              { title: 'Fragment Finder', desc: 'HHI-based fragmentation analytics for roll-ups.' },
              { title: 'Acquisition Assistant', desc: 'Deal pipeline, docs, Mini LBO & QoE previews.' },
            ].map((p) => (
              <div key={p.title} className="bg-white border rounded-2xl p-6 shadow">
                <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                <p className="text-gray-700">{p.desc}</p>
              </div>
            ))}
            </div>
          </>
        );
      case 'pricing':
        return (
          <>
            <BackHeader title="Pricing" />
            <PricingSection />
          </>
        );
      case 'signin':
        return (
          <>
            <BackHeader title="Sign In" />
            <div className="max-w-md mx-auto px-6 py-10">
            <h1 className="text-2xl font-extrabold mb-4">Sign In</h1>
            <p className="text-gray-600 mb-6">Placeholder authentication. Wire Clerk/Auth0 here.</p>
            <form className="space-y-4 bg-white border rounded-2xl p-6">
              <input className="w-full px-4 py-3 border rounded-lg" placeholder="Email" />
              <input className="w-full px-4 py-3 border rounded-lg" placeholder="Password" type="password" />
              <button className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg">Sign In</button>
            </form>
            </div>
          </>
        );
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'solutions':
        return <SolutionsPage onNavigate={handleNavigate} />;
      case 'case-studies':
        return <CaseStudiesPage onNavigate={handleNavigate} />;
      case 'market-analysis':
        return <MarketAnalysisPage onNavigate={handleNavigate} />;
      case 'market-scanner':
        return <MarketScannerPage onNavigate={handleNavigate} />;
      case 'crm':
        return <CRMPage onNavigate={handleNavigate} />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbfa]">
      {renderPage()}
    </div>
  );
} 