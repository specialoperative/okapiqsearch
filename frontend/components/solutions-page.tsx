"use client";

import React from 'react';
import Link from 'next/link';
import { SmoothReveal, StaggeredReveal, PallyButton, OrigamiCard, SmoothNavLink } from '../ui/smooth-components';
import { ArrowLeft, Search, Building2, Users, Target, Zap, TrendingUp, BarChart3, Check, Star } from 'lucide-react';

interface SolutionsPageProps {
  onNavigate: (page: string) => void;
}

export default function SolutionsPage({ onNavigate }: SolutionsPageProps) {
  return (
    <div className="min-h-screen">
      {/* Removed duplicate sticky header; global layout bar shows breadcrumb/nav */}
      {/* Avoid extra breadcrumb or secondary nav here */}

      {/* Solutions Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SmoothReveal>
          <h2 className="text-4xl font-bold text-okapi-brown-900 mb-8 text-center">Our Solutions</h2>
        </SmoothReveal>

        {/* Three-Product Ecosystem */}
        <SmoothReveal delay={0.2}>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-okapi-brown-900 mb-4">Three-Product Ecosystem</h3>
            <p className="text-lg text-okapi-brown-700 max-w-3xl mx-auto">
              Our comprehensive suite of tools designed to revolutionize small business market intelligence and deal sourcing.
            </p>
          </div>
        </SmoothReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
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
              <ul className="space-y-3 mb-6">
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
              <div className="flex space-x-2">
                <Link href="/oppy" className="flex-1">
                  <PallyButton variant="secondary" className="w-full">
                    Try Oppy
                  </PallyButton>
                </Link>
                <PallyButton variant="ghost" size="sm" onClick={() => onNavigate('case-studies')}>
                  <Star className="w-4 h-4" />
                </PallyButton>
              </div>
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
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-sm text-okapi-brown-600">
                  <BarChart3 className="w-4 h-4 mr-2 text-green-500" />
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
              <div className="flex space-x-2">
                <Link href="/fragment-finder" className="flex-1">
                  <PallyButton variant="secondary" className="w-full">
                    Try Fragment Finder
                  </PallyButton>
                </Link>
                <PallyButton variant="ghost" size="sm" onClick={() => onNavigate('case-studies')}>
                  <Star className="w-4 h-4" />
                </PallyButton>
              </div>
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
              <ul className="space-y-3 mb-6">
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
              <div className="flex space-x-2">
                <Link href="/acquisition-assistant" className="flex-1">
                  <PallyButton variant="secondary" className="w-full">
                    Try Acquisition Assistant
                  </PallyButton>
                </Link>
                <PallyButton variant="ghost" size="sm" onClick={() => onNavigate('case-studies')}>
                  <Star className="w-4 h-4" />
                </PallyButton>
              </div>
            </OrigamiCard>
          </StaggeredReveal>
        </div>

        {/* Call to Action */}
        <SmoothReveal delay={0.4}>
          <div className="bg-gradient-to-r from-okapi-brown-50 to-okapi-brown-100 rounded-2xl p-8 mb-12 text-center">
            <h3 className="text-3xl font-bold text-okapi-brown-900 mb-4">Ready to Transform Your Deal Sourcing?</h3>
            <p className="text-lg text-okapi-brown-700 mb-6 max-w-2xl mx-auto">
              Join the revolution in small business market intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PallyButton variant="primary" size="lg" onClick={() => onNavigate('market-scanner')}>
                Start Free Trial
              </PallyButton>
              <PallyButton variant="secondary" size="lg" onClick={() => onNavigate('case-studies')}>
                View Case Studies
              </PallyButton>
            </div>
          </div>
        </SmoothReveal>

        {/* Pricing Plans */}
        <SmoothReveal delay={0.6}>
          <h3 className="text-3xl font-bold text-okapi-brown-900 mb-8 text-center">Pricing Plans</h3>
        </SmoothReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StaggeredReveal staggerDelay={0.2}>
            <OrigamiCard pattern="zebra" className="p-8 text-center">
              <h4 className="text-2xl font-bold text-okapi-brown-900 mb-2">Starter</h4>
              <div className="mb-6">
                <span className="text-4xl font-bold text-okapi-brown-600">$99</span>
                <span className="text-lg text-okapi-brown-600">/month</span>
              </div>
              <ul className="space-y-3 mb-6 text-left">
                <li className="flex items-center text-sm text-okapi-brown-700">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  50 market scans/month
                </li>
                <li className="flex items-center text-sm text-okapi-brown-700">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Basic CRM features
                </li>
                <li className="flex items-center text-sm text-okapi-brown-700">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Standard analytics
                </li>
                <li className="flex items-center text-sm text-okapi-brown-700">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Email support
                </li>
              </ul>
              <PallyButton variant="secondary" className="w-full" onClick={() => onNavigate('market-scanner')}>
                Get Started
              </PallyButton>
            </OrigamiCard>

            <OrigamiCard pattern="okapi" className="p-8 text-center border-2 border-okapi-brown-300">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-okapi-brown-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <h4 className="text-2xl font-bold text-okapi-brown-900 mb-2">Professional</h4>
              <div className="mb-6">
                <span className="text-4xl font-bold text-okapi-brown-600">$299</span>
                <span className="text-lg text-okapi-brown-600">/month</span>
              </div>
              <ul className="space-y-3 mb-6 text-left">
                <li className="flex items-center text-sm text-okapi-brown-700">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Unlimited market scans
                </li>
                <li className="flex items-center text-sm text-okapi-brown-700">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Advanced CRM features
                </li>
                <li className="flex items-center text-sm text-okapi-brown-700">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Advanced analytics
                </li>
                <li className="flex items-center text-sm text-okapi-brown-700">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Priority support
                </li>
                <li className="flex items-center text-sm text-okapi-brown-700">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Custom integrations
                </li>
              </ul>
              <PallyButton className="w-full" onClick={() => onNavigate('market-scanner')}>
                Get Started
              </PallyButton>
            </OrigamiCard>

            <OrigamiCard pattern="lion" className="p-8 text-center">
              <h4 className="text-2xl font-bold text-okapi-brown-900 mb-2">Enterprise</h4>
              <div className="mb-6">
                <span className="text-4xl font-bold text-okapi-brown-600">$999</span>
                <span className="text-lg text-okapi-brown-600">/month</span>
              </div>
              <ul className="space-y-3 mb-6 text-left">
                <li className="flex items-center text-sm text-okapi-brown-700">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Custom integrations
                </li>
                <li className="flex items-center text-sm text-okapi-brown-700">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Dedicated support
                </li>
                <li className="flex items-center text-sm text-okapi-brown-700">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Custom reporting
                </li>
                <li className="flex items-center text-sm text-okapi-brown-700">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  White-label options
                </li>
                <li className="flex items-center text-sm text-okapi-brown-700">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  API access
                </li>
              </ul>
              <PallyButton variant="secondary" className="w-full" onClick={() => onNavigate('crm')}>
                Contact Sales
              </PallyButton>
            </OrigamiCard>
          </StaggeredReveal>
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <SmoothReveal delay={0.6}>
            <h3 className="text-3xl font-bold text-okapi-brown-900 mb-8 text-center">What Our Clients Say</h3>
          </SmoothReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <StaggeredReveal staggerDelay={0.2}>
              <OrigamiCard pattern="cheetah" className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-okapi-brown-700 mb-4">
                  "Okapiq transformed our deal sourcing process. We found 3x more qualified leads in half the time."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-okapi-brown-200 rounded-full flex items-center justify-center">
                    <span className="text-okapi-brown-700 font-semibold">JD</span>
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-okapi-brown-900">John Davis</p>
                    <p className="text-sm text-okapi-brown-600">Private Equity Partner</p>
                  </div>
                </div>
              </OrigamiCard>

              <OrigamiCard pattern="leopard" className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-okapi-brown-700 mb-4">
                  "The market intelligence is incredible. We closed our biggest deal using their HHI analysis."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-okapi-brown-200 rounded-full flex items-center justify-center">
                    <span className="text-okapi-brown-700 font-semibold">SM</span>
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-okapi-brown-900">Sarah Martinez</p>
                    <p className="text-sm text-okapi-brown-600">M&A Director</p>
                  </div>
                </div>
              </OrigamiCard>
            </StaggeredReveal>
          </div>
        </div>
      </div>
    </div>
  );
} 