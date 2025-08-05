"use client";

import React from 'react';
import { SmoothReveal, StaggeredReveal, PallyButton, OrigamiCard, SmoothNavLink, SmoothSection } from '../ui/smooth-components';
import { Search, TrendingUp, Users, Building2, Target, Zap } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-okapi-brown-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-okapi-brown-800">Okapiq</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <SmoothNavLink onClick={() => onNavigate('solutions')}>Solutions</SmoothNavLink>
              <SmoothNavLink onClick={() => onNavigate('case-studies')}>Case Studies</SmoothNavLink>
              <SmoothNavLink onClick={() => onNavigate('market-analysis')}>Market Analysis</SmoothNavLink>
              <SmoothNavLink onClick={() => onNavigate('market-scanner')}>Scanner</SmoothNavLink>
              <SmoothNavLink onClick={() => onNavigate('crm')}>CRM</SmoothNavLink>
              <PallyButton onClick={() => onNavigate('dashboard')} size="sm">
                Dashboard
              </PallyButton>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <SmoothSection className="py-20" pattern="okapi">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <SmoothReveal>
              <h1 className="text-5xl md:text-7xl font-bold text-okapi-brown-900 mb-6">
                Bloomberg for{' '}
                <span className="text-okapi-brown-600">Small Businesses</span>
              </h1>
            </SmoothReveal>
            
            <SmoothReveal delay={0.2}>
              <p className="text-xl md:text-2xl text-okapi-brown-700 max-w-4xl mx-auto mb-12">
                AI-powered deal sourcing from public data, owner signals, and market intelligence. 
                Get CRM-ready leads with TAM/SAM estimates and ad spend analysis.
              </p>
            </SmoothReveal>

            <StaggeredReveal staggerDelay={0.1}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <PallyButton onClick={() => onNavigate('market-scanner')} size="lg">
                  <Search className="w-5 h-5 mr-2" />
                  Start Scanning
                </PallyButton>
                <PallyButton variant="secondary" onClick={() => onNavigate('solutions')} size="lg">
                  <Target className="w-5 h-5 mr-2" />
                  View Solutions
                </PallyButton>
              </div>
            </StaggeredReveal>
          </div>
        </div>
      </SmoothSection>

      {/* Features Section */}
      <SmoothSection className="py-20" pattern="zebra">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SmoothReveal>
            <h2 className="text-4xl font-bold text-center text-okapi-brown-900 mb-16">
              Three-Product Ecosystem
            </h2>
          </SmoothReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StaggeredReveal staggerDelay={0.2}>
              <OrigamiCard pattern="okapi" className="p-8 cursor-pointer hover:shadow-lg transition-all duration-300" onClick={() => onNavigate('market-scanner')}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-okapi-brown-900 ml-3">Oppy</h3>
                </div>
                <p className="text-okapi-brown-700 mb-6">
                  Zeroes in on income data, demographic shifts, and consumer trends in stable markets.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm text-okapi-brown-600">
                    <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                    Public contracts & licensing data
                  </li>
                  <li className="flex items-center text-sm text-okapi-brown-600">
                    <Target className="w-4 h-4 mr-2 text-green-500" />
                    TAM/SAM estimates per market
                  </li>
                  <li className="flex items-center text-sm text-okapi-brown-600">
                    <Zap className="w-4 h-4 mr-2 text-green-500" />
                    Ad spend recommendations
                  </li>
                </ul>
              </OrigamiCard>

              <OrigamiCard pattern="cheetah" className="p-8 cursor-pointer hover:shadow-lg transition-all duration-300" onClick={() => onNavigate('market-analysis')}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-okapi-brown-900 ml-3">Fragment Finder</h3>
                </div>
                <p className="text-okapi-brown-700 mb-6">
                  Identifies highly fragmented markets with multiple small players for M&A aggregators.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm text-okapi-brown-600">
                    <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                    HHI calculation
                  </li>
                  <li className="flex items-center text-sm text-okapi-brown-600">
                    <Target className="w-4 h-4 mr-2 text-green-500" />
                    Consolidation opportunity ranking
                  </li>
                  <li className="flex items-center text-sm text-okapi-brown-600">
                    <Zap className="w-4 h-4 mr-2 text-green-500" />
                    Market takeover cost analysis
                  </li>
                </ul>
              </OrigamiCard>

              <OrigamiCard pattern="leopard" className="p-8 cursor-pointer hover:shadow-lg transition-all duration-300" onClick={() => onNavigate('crm')}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-okapi-brown-900 ml-3">Acquisition Assistant</h3>
                </div>
                <p className="text-okapi-brown-700 mb-6">
                  Streamlines the entire acquisition process from initial outreach to closing.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm text-okapi-brown-600">
                    <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                    Deal status tracking
                  </li>
                  <li className="flex items-center text-sm text-okapi-brown-600">
                    <Target className="w-4 h-4 mr-2 text-green-500" />
                    Automated follow-ups
                  </li>
                  <li className="flex items-center text-sm text-okapi-brown-600">
                    <Zap className="w-4 h-4 mr-2 text-green-500" />
                    AI-generated CIMs
                  </li>
                </ul>
              </OrigamiCard>
            </StaggeredReveal>
          </div>
        </div>
      </SmoothSection>

      {/* CTA Section */}
      <SmoothSection className="py-20" pattern="lion">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SmoothReveal>
            <h2 className="text-4xl font-bold text-okapi-brown-900 mb-6">
              Ready to Transform Your Deal Sourcing?
            </h2>
          </SmoothReveal>
          
          <SmoothReveal delay={0.2}>
            <p className="text-xl text-okapi-brown-700 mb-8">
              Join the revolution in small business market intelligence.
            </p>
          </SmoothReveal>

          <StaggeredReveal staggerDelay={0.1}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PallyButton onClick={() => onNavigate('market-scanner')} size="lg">
                Start Free Trial
              </PallyButton>
              <PallyButton variant="secondary" onClick={() => onNavigate('case-studies')} size="lg">
                View Case Studies
              </PallyButton>
            </div>
          </StaggeredReveal>
        </div>
      </SmoothSection>
    </div>
  );
} 