"use client";

import React, { useState } from 'react';
import { ArrowLeft, Plus, Upload, BarChart3, TrendingUp, FileText, Calendar, CheckCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

type Deal = {
  id: number;
  name: string;
  score: number;
  revenue: string;
  value: string;
  irr: string;
  multiple: string;
  cim: boolean;
  lbo: boolean;
  contact: string;
  contactWhen: string;
};

const mockStages: Record<string, Deal[]> = {
  Prospects: [
    { id: 1, name: 'Silicon Valley HVAC', score: 86, revenue: '$1.4M', value: '$320K', irr: '35.8%', multiple: '2.4x', cim: false, lbo: false, contact: 'Lisa Wang', contactWhen: '5 hours ago' },
  ],
  'Initial Contact': [
    { id: 2, name: 'Bay Plumbing Co', score: 91, revenue: '$1.8M', value: '$380K', irr: '31.2%', multiple: '2.8x', cim: false, lbo: false, contact: 'Sarah Johnson', contactWhen: '1 day ago' },
  ],
  'Due Diligence': [
    { id: 3, name: 'Golden Gate HVAC', score: 94, revenue: '$2.1M', value: '$450K', irr: '28.5%', multiple: '3.2x', cim: true, lbo: true, contact: 'John Smith', contactWhen: '2 hours ago' },
  ],
  Closing: [
    { id: 4, name: 'SF Electric Services', score: 88, revenue: '$3.2M', value: '$720K', irr: '24.7%', multiple: '4.1x', cim: true, lbo: true, contact: 'Mike Chen', contactWhen: '3 days ago' },
    { id: 5, name: 'Oakland Trade Co', score: 85, revenue: '$2.7M', value: '$580K', irr: '29.3%', multiple: '3.7x', cim: true, lbo: true, contact: 'David Rodriguez', contactWhen: '1 hour ago' },
  ],
};

export default function CRMDealPipeline() {
  const [tab, setTab] = useState<'pipeline' | 'financial' | 'documents' | 'analytics'>('pipeline');

  return (
    <div className="min-h-screen bg-white">
      {/* Removed duplicate breadcrumb/nav under global header */}

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {tab === 'pipeline' && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">Deal Pipeline Management</h1>
              <div className="flex gap-3">
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm"><Plus className="w-4 h-4"/>Add New Prospects</button>
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 text-white text-sm"><Upload className="w-4 h-4"/>Import Leads</button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <KPI label="Total Deals" value="5"/>
              <KPI label="Pipeline Value" value="$2450K"/>
              <KPI label="Avg IRR" value="29.9%"/>
              <KPI label="CIMs Generated" value="3"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(mockStages).map(([stage, deals]) => (
                <div key={stage} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold">{stage}</h2>
                    <span className="text-xs rounded-full bg-gray-100 text-gray-700 px-2 py-0.5">{deals.length}</span>
                  </div>
                  <div className="space-y-3">
                    {deals.map((d)=> (
                      <div key={d.id} className="rounded-lg border border-gray-200 p-3 hover:shadow-sm">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold">{d.name}</div>
                            <div className="text-xs text-gray-500">{d.revenue}</div>
                          </div>
                          <div className="text-sm font-bold text-emerald-700">{d.score}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-2">
                          <Field k="Value" v={d.value} />
                          <Field k="IRR" v={d.irr} />
                          <Field k="Multiple" v={d.multiple} />
                          <Field k="CIM" v={d.cim ? '✓' : '○'} />
                          <Field k="LBO" v={d.lbo ? '✓' : '○'} />
                          <div className="col-span-2 text-gray-500">Contact: {d.contact} • {d.contactWhen}</div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button className="text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-700">Move Forward</button>
                          <button className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">Details</button>
                          <button className="text-xs px-2 py-1 rounded bg-indigo-50 text-indigo-700">Generate CIM</button>
                          <button className="text-xs px-2 py-1 rounded bg-orange-50 text-orange-700">Run LBO Analysis</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === 'financial' && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">Financial Analysis & LBO Modeling</h1>
              <div className="flex gap-3">
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 text-white text-sm"><BarChart3 className="w-4 h-4"/>Run New Analysis</button>
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-900 text-sm"><ExternalLink className="w-4 h-4"/>Export Models</button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <Card title="Portfolio IRR Analysis">
                  <IRRRow name="Golden Gate HVAC" irr="28.5%" risk="Low" conf="94/100" purchase="$450K" multiple="3.2x" period="5 years" />
                  <IRRRow name="SF Electric Services" irr="24.7%" risk="Medium" conf="88/100" purchase="$720K" multiple="4.1x" period="6 years" />
                  <IRRRow name="Oakland Trade Co" irr="29.3%" risk="Medium" conf="85/100" purchase="$580K" multiple="3.7x" period="5 years" />
                </Card>
                <Card title="Detailed LBO Model - Golden Gate HVAC">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Acquisition Structure</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>Enterprise Value: $2,100,000</li>
                        <li>Debt Financing (60%): $1,260,000</li>
                        <li>Equity Investment (40%): $840,000</li>
                        <li>Transaction Costs: $105,000</li>
                        <li>Total Cash Required: $945,000</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Return Analysis</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>Entry Multiple (EV/EBITDA): 4.2x</li>
                        <li>Exit Multiple (EV/EBITDA): 5.1x</li>
                        <li>EBITDA Growth (CAGR): 12%</li>
                        <li>Debt Paydown: $780,000</li>
                        <li>Total Return: $2,688,000</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-left text-gray-500">
                        <tr><th>Year</th><th>Revenue</th><th>EBITDA</th><th>Debt Service</th><th>FCF</th></tr>
                      </thead>
                      <tbody className="text-gray-800">
                        {[
                          ['1', '$2,100K', '$500K', '$189K', '$311K'],
                          ['2', '$2,310K', '$560K', '$189K', '$371K'],
                          ['3', '$2,541K', '$627K', '$189K', '$438K'],
                          ['4', '$2,795K', '$702K', '$189K', '$513K'],
                          ['5', '$3,075K', '$786K', '$189K', '$597K'],
                        ].map((r,i)=> (
                          <tr key={i} className="border-t"><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td>{r[4]}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
              <div className="space-y-4">
                <Card title="Portfolio Metrics">
                  <Metric label="Weighted Avg IRR" value="29.7%"/>
                  <Metric label="Avg Money Multiple" value="3.4x"/>
                  <Metric label="Years Avg Hold" value="4.6"/>
                </Card>
                <Card title="Risk Analysis">
                  <Metric label="Market Risk" value="Low"/>
                  <Metric label="Execution Risk" value="Medium"/>
                  <Metric label="Financial Risk" value="Low"/>
                </Card>
                <Card title="Quick Actions">
                  <button className="w-full mb-2 inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 text-white px-3 py-2 text-sm"><TrendingUp className="w-4 h-4"/>Run Sensitivity Analysis</button>
                  <button className="w-full mb-2 inline-flex items-center justify-center gap-2 rounded-lg bg-gray-100 text-gray-900 px-3 py-2 text-sm">Export LBO Models</button>
                  <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gray-100 text-gray-900 px-3 py-2 text-sm"><Calendar className="w-4 h-4"/>Schedule Review</button>
                </Card>
              </div>
            </div>
          </section>
        )}

        {tab === 'documents' && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">AI-Generated Documents & CIMs</h1>
              <div className="flex gap-3">
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 text-white text-sm"><FileText className="w-4 h-4"/>Generate New CIM</button>
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-900 text-sm">Template Library</button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {['Golden Gate HVAC','SF Electric Services','Oakland Trade Co'].map((n,i)=> (
                <Card key={i} title={`${n} - Confidential Information Memorandum`} right={<span className="inline-flex items-center gap-1 text-emerald-700 text-xs"><CheckCircle className="w-3 h-3"/>Generated</span>}>
                  <h4 className="font-semibold mb-2">Executive Summary</h4>
                  <p className="text-sm text-gray-700 mb-3">{n} is a well-established services company with consistent growth and strong market positioning in a fragmented industry ripe for consolidation.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-1">Key Financials</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>Annual Revenue: {i===0? '$2.1M': i===1? '$3.2M': '$2.7M'}</li>
                        <li>EBITDA Margin: 24%</li>
                        <li>Customer Count: 1,200+</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Investment Highlights</h5>
                      <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                        <li>Market-leading position</li>
                        <li>Recurring customer base</li>
                        <li>Experienced management</li>
                        <li>Growth opportunities</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="text-xs px-2 py-1 rounded bg-gray-900 text-white">Download Full CIM</button>
                    <button className="text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-700">Send to Investor</button>
                    <button className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-900">Regenerate</button>
                  </div>
                </Card>
              ))}
              <div className="lg:col-span-1 space-y-4">
                <Card title="AI Document Templates">
                  {['Letter of Intent (LOI)','Purchase Agreement','Due Diligence Checklist','Management Presentation','Financing Memorandum','Integration Plan'].map((t)=> (
                    <div key={t} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <div className="text-sm font-medium">{t}</div>
                        <div className="text-xs text-gray-500">Template Ready</div>
                      </div>
                      <button className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-900">Generate</button>
                    </div>
                  ))}
                </Card>
                <Card title="Document Status">
                  <Metric label="CIMs Generated" value="3/5"/>
                  <Metric label="LOIs Drafted" value="2/5"/>
                  <Metric label="Due Diligence Packages" value="3/5"/>
                </Card>
                <Card title="AI Document Assistant">
                  <p className="text-sm text-gray-700 mb-3">Our AI generates professional‑grade acquisition documents based on your deal parameters and market intelligence.</p>
                  <div className="flex gap-2">
                    <button className="text-sm px-3 py-2 rounded bg-gray-900 text-white">Generate Deal Package</button>
                    <button className="text-sm px-3 py-2 rounded bg-gray-100 text-gray-900">Custom Template</button>
                  </div>
                </Card>
                <Card title="Recent Activity">
                  {[
                    ['CIM generated','Golden Gate HVAC • 2 hours ago'],
                    ['LOI sent','SF Electric • 1 day ago'],
                    ['DD checklist created','Oakland Trade • 2 days ago'],
                  ].map((r,i)=> (
                    <div key={i} className="py-2 border-b last:border-0">
                      <div className="text-sm font-medium">{r[0]}</div>
                      <div className="text-xs text-gray-500">{r[1]}</div>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          </section>
        )}

        {tab === 'analytics' && (
          <section>
            <h1 className="text-3xl font-bold mb-4">CRM Analytics & Performance</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Conversion Rates by Stage">
                <Metric label="Prospects → Initial Contact" value="68%"/>
                <Metric label="Initial Contact → Due Diligence" value="45%"/>
                <Metric label="Due Diligence → Closing" value="78%"/>
                <Metric label="Overall Close Rate" value="23%"/>
              </Card>
              <Card title="Financial Performance">
                <Metric label="Avg Deal Size" value="$486K"/>
                <Metric label="Avg IRR" value="29.7%"/>
                <Metric label="Avg Multiple" value="3.4x"/>
                <Metric label="Pipeline Velocity" value="$12.4K/day"/>
              </Card>
            </div>
            <div className="mt-6 flex gap-3">
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 text-white text-sm">Generate Full Report</button>
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-900 text-sm">Export Data</button>
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-900 text-sm">Schedule Review</button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function KPI({label, value}:{label:string; value:string}){
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

function Field({k, v}:{k:string; v:string}){
  return (
    <div className="flex items-center justify-between"><span className="text-gray-500">{k}</span><span className="font-medium text-gray-800">{v}</span></div>
  );
}

function Card({title, right, children}:{title:string; right?:React.ReactNode; children:React.ReactNode}){
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3"><h3 className="font-semibold">{title}</h3>{right}</div>
      {children}
    </div>
  );
}

function Metric({label, value}:{label:string; value:string}){
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function IRRRow({name, irr, risk, conf, purchase, multiple, period}:{name:string; irr:string; risk:string; conf:string; purchase:string; multiple:string; period:string}){
  return (
    <div className="rounded-lg border border-gray-200 p-3 mb-2">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{name}</div>
        <div className="text-lg font-bold">{irr}</div>
      </div>
      <div className="grid grid-cols-5 gap-3 text-sm text-gray-700 mt-1">
        <div>Purchase<br/><span className="font-medium">{purchase}</span></div>
        <div>Multiple<br/><span className="font-medium">{multiple}</span></div>
        <div>Period<br/><span className="font-medium">{period}</span></div>
        <div>Risk<br/><span className="font-medium">{risk}</span></div>
        <div>Confidence<br/><span className="font-medium">{conf}</span></div>
      </div>
    </div>
  );
}


