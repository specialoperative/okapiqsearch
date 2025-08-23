import BusinessLookup from "../src/components/BusinessLookup"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Comprehensive Data Intelligence Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced business intelligence powered by multiple data sources including SERP, Yelp, Google Places, Census,
            and more. Search up to 100 businesses per industry with NAICS classification.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">6+</div>
            <div className="text-gray-600">Data Sources</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">20</div>
            <div className="text-gray-600">NAICS Industries</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">100</div>
            <div className="text-gray-600">Max Results</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">50</div>
            <div className="text-gray-600">US States</div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Advanced Market Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <a href="/okapiq" className="group">
              <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-blue-500">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                      Okapiq Dashboard
                    </h3>
                    <p className="text-blue-200">PE-Grade Market Intelligence • TAM/TSM • HHI Analysis</p>
                  </div>
                </div>
                <div className="text-sm text-blue-300">
                  • Bloomberg Terminal for Main Street
                  <br />• Private equity analytics
                  <br />• Market fragmentation scoring
                  <br />• Acquisition opportunity mapping
                </div>
              </div>
            </a>

            <a href="/crm" className="group">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-green-500">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      CRM Dashboard
                    </h3>
                    <p className="text-gray-600">Pipeline Management • Email Scraping • CSV Export</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  • Business intelligence CRM
                  <br />• Automated email scraping
                  <br />• Instant CSV export
                  <br />• Acquisition scoring
                </div>
              </div>
            </a>

            <a href="/valuation" className="group">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-emerald-500">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      Business Valuation Engine
                    </h3>
                    <p className="text-gray-600">TAM/TSM Analysis • Market Fragmentation • Industry Heat Maps</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  • HHI fragmentation analysis
                  <br />• ZIP code acquisition rankings
                  <br />• Interactive industry heat maps
                  <br />• Automated business valuations
                </div>
              </div>
            </a>

            <a href="/ybridge" className="group">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.5"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      YBridge Acquisition Tool
                    </h3>
                    <p className="text-gray-600">Custom Buy Box • Succession Risk • Digital Weakness Analysis</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  • Fire & Life Safety, HVAC, Electrical targeting
                  <br />• $2M-$12M revenue filtering
                  <br />• Midwest/East Coast focus
                  <br />• Pre-configured acquisition templates
                </div>
              </div>
            </a>

            <a href="/california-aging" className="group">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-orange-500">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                      California Aging Analysis
                    </h3>
                    <p className="text-gray-600">Oldest ZIP Codes • Succession Risk • Retirement Demographics</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  • Business owner age analysis
                  <br />• Succession risk scoring
                  <br />• Retirement rate demographics
                  <br />• Acquisition opportunity ranking
                </div>
              </div>
            </a>

            <a href="/us4-security" className="group">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-red-500">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                      US4 Security Intelligence
                    </h3>
                    <p className="text-gray-600">Texas Security Companies • Crime Heat Maps • NAICS Analysis</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  • Security guard company targeting
                  <br />• Crime data integration
                  <br />• Texas market focus
                  <br />• Law enforcement aesthetic
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Main Business Lookup Component */}
        <BusinessLookup />

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Multi-Source Data</h3>
            <p className="text-gray-600">
              Aggregate data from SERP, Yelp, Google Places, Census, and DataAxle APIs for comprehensive business
              intelligence.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Precise Location Targeting</h3>
            <p className="text-gray-600">
              Target businesses by state and city with support for all 50 US states and major metropolitan areas.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">NAICS Classification</h3>
            <p className="text-gray-600">
              Industry-standard NAICS codes for precise business categorization across 20 major industry sectors.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
