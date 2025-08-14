"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, BarChart3, Users, TrendingUp } from 'lucide-react';

export default function SolutionsLanding() {
  const [section, setSection] = useState<'overview'|'oppy'|'fragment'|'assistant'>('overview');
  return (
    <div className="min-h-screen bg-white">
      {/* Remove redundant local header/links; global top bar + breadcrumb are enough */}

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-4xl font-bold mb-2">Okapiq Solutions</h1>
        <p className="text-gray-700 mb-8">From identifying opportunities to closing deals – our integrated product line covers every step of the SMB acquisition process with Bloomberg‑level intelligence.</p>

        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <SolutionCard icon={<Search className="w-6 h-6 text-white"/>} title="Oppy - Opportunity Finder" subtitle="AI-powered market opportunity detection" onClick={()=>setSection('oppy')} color="from-blue-500 to-blue-600"/>
          <SolutionCard icon={<BarChart3 className="w-6 h-6 text-white"/>} title="Fragment Finder" subtitle="Roll-up targeting and market fragmentation analysis" onClick={()=>setSection('fragment')} color="from-purple-500 to-purple-600"/>
          <SolutionCard icon={<Users className="w-6 h-6 text-white"/>} title="Acquisition Assistant" subtitle="Deal pipeline management and automation" onClick={()=>setSection('assistant')} color="from-green-500 to-green-600"/>
        </div>

        {section === 'oppy' && <OppySection />}
        {section === 'fragment' && <FragmentSection />}
        {section === 'assistant' && <AssistantSection />}
        {section === 'overview' && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-700">
            Select a solution to see live demos and capabilities.
          </div>
        )}
      </main>
    </div>
  );
}

function SolutionCard({icon, title, subtitle, onClick, color}:{icon:React.ReactNode; title:string; subtitle:string; onClick:()=>void; color:string}){
  return (
    <button onClick={onClick} className="text-left rounded-xl border border-gray-200 p-5 hover:shadow-sm transition bg-white">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>{icon}</div>
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-gray-600">{subtitle}</div>
    </button>
  );
}

function KPI({label,value}:{label:string;value:string}){
  return (
    <div className="rounded-xl border border-gray-200 p-4 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

function OppySection(){
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Oppy - Opportunity Finder</h2>
      <p className="text-gray-700">Zeroes in on income data, demographic shifts, and consumer trends to identify hidden opportunities before competitors.</p>
      <div className="grid grid-cols-4 gap-4">
        <KPI label="Market Size" value="$2.4B"/>
        <KPI label="Opportunities" value="247"/>
        <KPI label="Growth Rate" value="12.5%"/>
        <KPI label="Public Contracts" value="1,432"/>
      </div>
      <div className="flex gap-3">
        <Link href="/oppy" className="inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white px-3 py-2 text-sm">Try Market Scanner</Link>
      </div>
      <Card title="Live Market Intelligence Demo" subtitle="San Francisco Bay Area - HVAC Market">
        <DemoGrid items={[
          ['Total Addressable Market', '$2.4B'],
          ['Active Businesses', '2,480'],
          ['High Succession Risk', '14.6%'],
          ['Market Growth Rate', '+12.5% YoY'],
        ]}/>
        <div className="mt-3"><Link href="/oppy" className="text-sm text-emerald-700">Start Your Own Market Scan →</Link></div>
      </Card>
      <Card title="Bloomberg-Level Financial Intelligence" subtitle="Our three solutions work together seamlessly.">
        <Steps />
        <div className="mt-3 flex gap-3">
          <Link href="/oppy" className="rounded-lg bg-gray-900 text-white px-3 py-2 text-sm">Try Full Platform Demo</Link>
          <Link href="/case-studies" className="rounded-lg bg-gray-100 text-gray-900 px-3 py-2 text-sm">View Success Stories</Link>
        </div>
      </Card>
    </section>
  );
}

function FragmentSection(){
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Fragment Finder</h2>
      <p className="text-gray-700">Identifies highly fragmented markets with multiple small players ripe for consolidation and roll‑up strategies.</p>
      <div className="grid grid-cols-4 gap-4">
        <KPI label="HHI Score" value="0.12"/>
        <KPI label="Fragmentation" value="88%"/>
        <KPI label="Roll-up Targets" value="156"/>
        <KPI label="Synergy Value" value="$12.8M"/>
      </div>
      <div><button className="rounded-lg bg-gray-900 text-white px-3 py-2 text-sm">Analyze Fragmentation</button></div>
      <Card title="Key Features & Capabilities">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
          <li>HHI calculation and fragmentation scoring</li>
          <li>ZIP code-level market density analysis</li>
          <li>Synergy potential quantification</li>
          <li>Market takeover cost modeling</li>
          <li>Competitive moat assessment</li>
          <li>Roll-up ROI projections</li>
        </ul>
      </Card>
      <Card title="Fragmentation Analysis Example" subtitle="Arizona Auto Detailing Market">
        <DemoGrid items={[
          ['HHI Fragmentation Score', '0.12 - Highly Fragmented'],
          ['Roll-up Targets', '156'],
          ['Synergy Value', '$12.8M'],
        ]}/>
      </Card>
    </section>
  );
}

function AssistantSection(){
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Acquisition Assistant</h2>
      <p className="text-gray-700">Streamlines the entire acquisition process with AI‑powered automation and sophisticated financial modeling.</p>
      <div className="grid grid-cols-4 gap-4">
        <KPI label="Active Pipeline" value="34"/>
        <KPI label="Avg IRR" value="29.7%"/>
        <KPI label="Money Multiple" value="3.4x"/>
        <KPI label="Close Rate" value="23%"/>
      </div>
      <div className="flex gap-3"><Link href="/crm" className="rounded-lg bg-gray-900 text-white px-3 py-2 text-sm">Open CRM Pipeline</Link><button className="rounded-lg bg-gray-100 text-gray-900 px-3 py-2 text-sm">Show LBO Engine Demo</button></div>
      <Card title="Key Features & Capabilities">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
          <li>Intelligent deal status tracking with automated workflows</li>
          <li>AI-generated CIMs and legal documents</li>
          <li>Advanced LBO modeling with IRR projections</li>
          <li>Mini LBO Engine with sensitivity analysis</li>
          <li>Automated follow-up sequences and nurturing</li>
          <li>Due diligence checklist automation</li>
          <li>Closing timeline optimization</li>
          <li>Portfolio performance analytics</li>
        </ul>
      </Card>
      <Card title="AI Document Generation">
        <DemoGrid items={[
          ['Confidential Information Memorandum', 'Generated • 94%'],
          ['Letter of Intent Template', 'Ready • 98%'],
          ['Due Diligence Checklist', 'Automated • 96%'],
          ['Purchase Agreement Draft', 'AI‑Powered • 92%'],
        ]}/>
        <div className="mt-3"><button className="rounded-lg bg-gray-100 text-gray-900 px-3 py-2 text-sm">View Document Suite</button></div>
      </Card>
      <Card title="Portfolio Performance">
        <DemoGrid items={[
          ['Weighted Avg IRR', '29.7%'],
          ['Money Multiple', '3.4x'],
          ['Avg Hold Period', '4.6'],
          ['Risk‑Adjusted Returns', 'Excellent'],
          ['Deal Success Rate', '78%'],
        ]}/>
        <div className="mt-3"><button className="rounded-lg bg-gray-900 text-white px-3 py-2 text-sm">Run LBO Analysis</button></div>
      </Card>
      <Card title="Bloomberg-Level Financial Intelligence">
        <Steps />
        <div className="mt-3 flex gap-3">
          <Link href="/oppy" className="rounded-lg bg-gray-900 text-white px-3 py-2 text-sm">Try Full Platform Demo</Link>
          <Link href="/case-studies" className="rounded-lg bg-gray-100 text-gray-900 px-3 py-2 text-sm">View Success Stories</Link>
        </div>
      </Card>
    </section>
  );
}

function Card({title, subtitle, children}:{title:string; subtitle?:string; children:React.ReactNode}){
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-2">
        <div className="font-semibold">{title}</div>
        {subtitle && <div className="text-sm text-gray-600">{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function DemoGrid({items}:{items:[string,string][]}){
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {items.map(([k,v],i)=> (
        <div key={i} className="rounded-lg border border-gray-200 p-3 flex items-center justify-between"><span className="text-gray-600">{k}</span><span className="font-semibold">{v}</span></div>
      ))}
    </div>
  );
}

function Steps(){
  return (
    <ol className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-700">
      <li className="rounded-lg border border-gray-200 p-3"><span className="font-semibold">1 — Discover & Score</span><br/>AI‑powered market discovery with acquisition scoring</li>
      <li className="rounded-lg border border-gray-200 p-3"><span className="font-semibold">2 — Analyze & Model</span><br/>LBO modeling with IRR projections and risk assessment</li>
      <li className="rounded-lg border border-gray-200 p-3"><span className="font-semibold">3 — Execute & Close</span><br/>AI‑generated docs and automated deal management</li>
    </ol>
  );
}


