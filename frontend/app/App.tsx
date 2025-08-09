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

type Page =
  | 'landing'
  | 'dashboard'
  | 'solutions'
  | 'case-studies'
  | 'market-analysis'
  | 'market-scanner'
  | 'crm'
  | 'how-it-works'
  | 'products'
  | 'pricing'
  | 'signin'
  | 'product-oppy'
  | 'product-fragment-finder'
  | 'product-acquisition-assistant';

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

    const BreadcrumbHeader = ({ trail }: { trail: { label: string; page?: Page }[] }) => (
      <div className="bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2">
          <button
            onClick={() => handleNavigate('landing')}
            className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </button>
          {trail.map((t, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-sm text-gray-400">/</span>
              {t.page ? (
                <button onClick={() => handleNavigate(t.page!)} className="text-sm text-emerald-700 hover:text-emerald-900">
                  {t.label}
                </button>
              ) : (
                <span className="text-sm font-semibold text-gray-900">{t.label}</span>
              )}
            </div>
          ))}
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
            <BreadcrumbHeader trail={[{ label: 'Products' }]} />
            <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-6">
              <button onClick={() => handleNavigate('product-oppy')} className="text-left bg-white border rounded-2xl p-6 shadow hover:shadow-lg">
                <h3 className="text-xl font-bold mb-2">Oppy (Opportunity Finder)</h3>
                <p className="text-gray-700">Income & demand-driven sourcing, heatmaps and signals.</p>
              </button>
              <button onClick={() => handleNavigate('product-fragment-finder')} className="text-left bg-white border rounded-2xl p-6 shadow hover:shadow-lg">
                <h3 className="text-xl font-bold mb-2">Fragment Finder</h3>
                <p className="text-gray-700">HHI-based fragmentation analytics for roll-ups.</p>
              </button>
              <button onClick={() => handleNavigate('product-acquisition-assistant')} className="text-left bg-white border rounded-2xl p-6 shadow hover:shadow-lg">
                <h3 className="text-xl font-bold mb-2">Acquisition Assistant</h3>
                <p className="text-gray-700">Deal pipeline, docs, Mini LBO & QoE previews.</p>
              </button>
            </div>
          </>
        );
      case 'product-oppy':
        return (
          <>
            <BreadcrumbHeader trail={[{ label: 'Products', page: 'products' }, { label: 'Oppy (Opportunity Finder)' }]} />
            <div className="max-w-5xl mx-auto px-6 py-10 space-y-4">
              <h1 className="text-3xl font-extrabold">Oppy (Opportunity Finder)</h1>
              <p className="text-gray-700">Income & demand-driven sourcing, heatmaps and signals.</p>
              <p className="text-gray-700">Use Oppy to surface territories with strong income growth, new business formation, and favorable consumer trends. Trigger scans to overlay Census income, Google Trends, and marketplace signals.</p>
            </div>
          </>
        );
      case 'product-fragment-finder':
        return (
          <>
            <BreadcrumbHeader trail={[{ label: 'Products', page: 'products' }, { label: 'Fragment Finder' }]} />
            <div className="max-w-5xl mx-auto px-6 py-10 space-y-4">
              <h1 className="text-3xl font-extrabold">Fragment Finder</h1>
              <p className="text-gray-700">HHI-based fragmentation analytics for roll-ups.</p>
              <p className="text-gray-700">Calculate HHI, concentration ratios, and roll-up attractiveness. Quickly identify ZIPs with high competitor counts and low concentration to assemble synergistic acquisitions.</p>
            </div>
          </>
        );
      case 'product-acquisition-assistant':
        return (
          <>
            <BreadcrumbHeader trail={[{ label: 'Products', page: 'products' }, { label: 'Acquisition Assistant' }]} />
            <div className="max-w-5xl mx-auto px-6 py-10 space-y-4">
              <h1 className="text-3xl font-extrabold">Acquisition Assistant</h1>
              <p className="text-gray-700">Deal pipeline, docs, Mini LBO & QoE previews.</p>
              <p className="text-gray-700">Manage leads through LOI and close. Upload docs for AI QoE highlights and run a Mini LBO with basic assumptions to sanity-check IRR and equity multiple.</p>
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