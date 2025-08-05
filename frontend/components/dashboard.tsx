"use client";

import React, { useState, useEffect } from 'react';
import { SmoothReveal, StaggeredReveal, PallyButton, OrigamiCard, SmoothNavLink } from '../ui/smooth-components';
import { ArrowLeft, TrendingUp, Users, Building2, Target, Zap, Search, BarChart3, Calendar, DollarSign, Activity, AlertCircle, CheckCircle } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'scan', location: 'Phoenix, AZ', industry: 'Restaurant', time: '2 minutes ago', status: 'completed' },
    { id: 2, type: 'lead', company: 'ABC HVAC Services', action: 'Contacted', time: '15 minutes ago', status: 'active' },
    { id: 3, type: 'analysis', market: 'Miami Healthcare', action: 'HHI Analysis', time: '1 hour ago', status: 'completed' },
    { id: 4, type: 'deal', company: 'Metro Restaurant Group', action: 'Qualified', time: '2 hours ago', status: 'active' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'scan': return <Search className="w-4 h-4" />;
      case 'lead': return <Users className="w-4 h-4" />;
      case 'analysis': return <BarChart3 className="w-4 h-4" />;
      case 'deal': return <DollarSign className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'scan': return 'text-blue-600';
      case 'lead': return 'text-green-600';
      case 'analysis': return 'text-purple-600';
      case 'deal': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-okapi-brown-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <PallyButton variant="ghost" onClick={() => onNavigate('landing')} size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </PallyButton>
              <h1 className="text-2xl font-bold text-okapi-brown-800 ml-4">Dashboard</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <SmoothNavLink onClick={() => onNavigate('solutions')}>Solutions</SmoothNavLink>
              <SmoothNavLink onClick={() => onNavigate('market-scanner')}>Scanner</SmoothNavLink>
              <SmoothNavLink onClick={() => onNavigate('crm')}>CRM</SmoothNavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SmoothReveal>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-okapi-brown-900">Welcome back!</h2>
            <div className="text-sm text-okapi-brown-600">
              {currentTime.toLocaleDateString()} • {formatTime(currentTime)}
            </div>
          </div>
        </SmoothReveal>

        {/* Three-Product Ecosystem Overview */}
        <SmoothReveal delay={0.2}>
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-okapi-brown-900 mb-6">Three-Product Ecosystem</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <OrigamiCard pattern="okapi" className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300" onClick={() => onNavigate('market-scanner')}>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-bold text-okapi-brown-900">Oppy</h4>
                    <p className="text-xs text-okapi-brown-600">Market Intelligence</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-okapi-brown-600">Scans Today</span>
                    <span className="font-semibold text-okapi-brown-900">8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-okapi-brown-600">Leads Generated</span>
                    <span className="font-semibold text-okapi-brown-900">24</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-okapi-brown-600">Success Rate</span>
                    <span className="font-semibold text-green-600">92%</span>
                  </div>
                </div>
              </OrigamiCard>

              <OrigamiCard pattern="cheetah" className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300" onClick={() => onNavigate('market-analysis')}>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-bold text-okapi-brown-900">Fragment Finder</h4>
                    <p className="text-xs text-okapi-brown-600">M&A Intelligence</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-okapi-brown-600">Analyses Today</span>
                    <span className="font-semibold text-okapi-brown-900">5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-okapi-brown-600">Opportunities</span>
                    <span className="font-semibold text-okapi-brown-900">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-okapi-brown-600">Avg HHI Score</span>
                    <span className="font-semibold text-purple-600">18.5%</span>
                  </div>
                </div>
              </OrigamiCard>

              <OrigamiCard pattern="leopard" className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300" onClick={() => onNavigate('crm')}>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-bold text-okapi-brown-900">Acquisition Assistant</h4>
                    <p className="text-xs text-okapi-brown-600">Deal Management</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-okapi-brown-600">Active Deals</span>
                    <span className="font-semibold text-okapi-brown-900">8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-okapi-brown-600">Follow-ups Sent</span>
                    <span className="font-semibold text-okapi-brown-900">15</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-okapi-brown-600">Close Rate</span>
                    <span className="font-semibold text-green-600">68%</span>
                  </div>
                </div>
              </OrigamiCard>
            </div>
          </div>
        </SmoothReveal>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StaggeredReveal staggerDelay={0.1}>
            <OrigamiCard pattern="okapi" className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate('market-scanner')}>
              <div className="flex items-center">
                <Search className="w-8 h-8 text-okapi-brown-600" />
                <div className="ml-4">
                  <p className="text-sm text-okapi-brown-600">Scans Today</p>
                  <p className="text-2xl font-bold text-okapi-brown-900">24</p>
                  <p className="text-xs text-green-600">+12% from yesterday</p>
                </div>
              </div>
            </OrigamiCard>

            <OrigamiCard pattern="zebra" className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate('crm')}>
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm text-okapi-brown-600">Active Leads</p>
                  <p className="text-2xl font-bold text-okapi-brown-900">156</p>
                  <p className="text-xs text-green-600">+8 new this week</p>
                </div>
              </div>
            </OrigamiCard>

            <OrigamiCard pattern="cheetah" className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate('market-analysis')}>
              <div className="flex items-center">
                <Building2 className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm text-okapi-brown-900">Markets Analyzed</p>
                  <p className="text-2xl font-bold text-okapi-brown-900">89</p>
                  <p className="text-xs text-blue-600">3 pending analysis</p>
                </div>
              </div>
            </OrigamiCard>

            <OrigamiCard pattern="leopard" className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate('case-studies')}>
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm text-okapi-brown-600">Success Rate</p>
                  <p className="text-2xl font-bold text-okapi-brown-900">87%</p>
                  <p className="text-xs text-green-600">+5% this month</p>
                </div>
              </div>
            </OrigamiCard>
          </StaggeredReveal>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SmoothReveal delay={0.2}>
            <OrigamiCard pattern="lion" className="p-8">
              <h3 className="text-2xl font-bold text-okapi-brown-900 mb-4">Quick Actions</h3>
              <div className="space-y-4">
                <PallyButton onClick={() => onNavigate('market-scanner')} className="w-full justify-start">
                  <Search className="w-5 h-5 mr-3" />
                  New Market Scan
                </PallyButton>
                <PallyButton variant="secondary" onClick={() => onNavigate('crm')} className="w-full justify-start">
                  <Users className="w-5 h-5 mr-3" />
                  View CRM
                </PallyButton>
                <PallyButton variant="secondary" onClick={() => onNavigate('market-analysis')} className="w-full justify-start">
                  <BarChart3 className="w-5 h-5 mr-3" />
                  Market Analysis
                </PallyButton>
                <PallyButton variant="secondary" onClick={() => onNavigate('case-studies')} className="w-full justify-start">
                  <Target className="w-5 h-5 mr-3" />
                  Case Studies
                </PallyButton>
              </div>
            </OrigamiCard>
          </SmoothReveal>

          <SmoothReveal delay={0.3}>
            <OrigamiCard pattern="rhino" className="p-8">
              <h3 className="text-2xl font-bold text-okapi-brown-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center p-3 bg-white rounded-lg border border-okapi-brown-200">
                    <div className={`p-2 rounded-full bg-okapi-brown-100 ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-okapi-brown-900">
                            {activity.type === 'scan' && `${activity.location} - ${activity.industry}`}
                            {activity.type === 'lead' && `${activity.company}`}
                            {activity.type === 'analysis' && `${activity.market}`}
                            {activity.type === 'deal' && `${activity.company}`}
                          </p>
                          <p className="text-xs text-okapi-brown-600">
                            {activity.action || 'Market scan completed'}
                          </p>
                        </div>
                        <span className="text-xs text-okapi-brown-500">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </OrigamiCard>
          </SmoothReveal>
        </div>

        {/* Performance Metrics */}
        <SmoothReveal delay={0.4}>
          <OrigamiCard pattern="okapi" className="p-8">
            <h3 className="text-2xl font-bold text-okapi-brown-900 mb-6">Performance Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white rounded-lg border border-okapi-brown-200">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="text-lg font-bold text-okapi-brown-900 mb-1">Total Value</h4>
                <p className="text-3xl font-bold text-okapi-brown-600">$2.4M</p>
                <p className="text-xs text-green-600">+15% this quarter</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg border border-okapi-brown-200">
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="text-lg font-bold text-okapi-brown-900 mb-1">Deals in Pipeline</h4>
                <p className="text-3xl font-bold text-okapi-brown-600">12</p>
                <p className="text-xs text-blue-600">3 closing this month</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg border border-okapi-brown-200">
                <Zap className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <h4 className="text-lg font-bold text-okapi-brown-900 mb-1">Conversion Rate</h4>
                <p className="text-3xl font-bold text-okapi-brown-600">23%</p>
                <p className="text-xs text-orange-600">+8% vs last month</p>
              </div>
            </div>
          </OrigamiCard>
        </SmoothReveal>

        {/* Alerts & Notifications */}
        <SmoothReveal delay={0.5}>
          <OrigamiCard pattern="zebra" className="p-8 mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-okapi-brown-900">Alerts</h3>
              <PallyButton variant="secondary" size="sm">
                View All
              </PallyButton>
            </div>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">High Succession Risk</p>
                  <p className="text-xs text-yellow-700">3 businesses in your pipeline have >80% succession risk</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-800">New Market Opportunity</p>
                  <p className="text-xs text-green-700">Phoenix HVAC market shows high fragmentation potential</p>
                </div>
              </div>
            </div>
          </OrigamiCard>
        </SmoothReveal>
      </div>
    </div>
  );
} 