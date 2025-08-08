"use client";

import React, { useEffect, useState } from 'react';
import LandingPage from '../components/landing-page';
import Dashboard from '../components/dashboard';
import SolutionsPage from '../components/solutions-page';
import CaseStudiesPage from '../components/case-studies-page';
import MarketAnalysisPage from '../components/market-analysis-page';
import MarketScannerPage from '../components/market-scanner-page';
import CRMPage from '../components/crm-page';

type Page = 'landing' | 'dashboard' | 'solutions' | 'case-studies' | 'market-analysis' | 'market-scanner' | 'crm';

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
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
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