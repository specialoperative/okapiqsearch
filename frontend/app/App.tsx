"use client";

import React, { useState } from 'react';
import LandingPage from '../components/landing-page';
import Dashboard from '../components/dashboard';
import SolutionsPage from '../components/solutions-page';
import CaseStudiesPage from '../components/case-studies-page';
import MarketAnalysisPage from '../components/market-analysis-page';
import MarketScannerPage from '../components/market-scanner-page';
import CRMPage from '../components/crm-page';

type Page = 'landing' | 'dashboard' | 'solutions' | 'case-studies' | 'market-analysis' | 'market-scanner' | 'crm';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  const handleNavigate = (page: string) => {
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
    <div className="min-h-screen bg-gradient-to-br from-okapi-brown-50 to-okapi-brown-100">
      {renderPage()}
    </div>
  );
} 