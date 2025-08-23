"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Phone, Globe, Star, Database, TrendingUp, Info } from "lucide-react"

const NAICS_CODES = {
  "Accommodation and Food Services": "72",
  "Administrative and Support Services": "56",
  "Agriculture, Forestry, Fishing and Hunting": "11",
  "Arts, Entertainment, and Recreation": "71",
  "Accounting, Tax Preparation, Bookkeeping, and Payroll Services": "5412",
  Construction: "23",
  "Educational Services": "61",
  "Finance and Insurance": "52",
  "Health Care and Social Assistance": "62",
  Information: "51",
  "Management of Companies and Enterprises": "55",
  Manufacturing: "31-33",
  "Mining, Quarrying, and Oil and Gas Extraction": "21",
  "Other Services (except Public Administration)": "81",
  "Professional, Scientific, and Technical Services": "54",
  "Public Administration": "92",
  "Real Estate and Rental and Leasing": "53",
  "Retail Trade": "44-45",
  "Transportation and Warehousing": "48-49",
  Utilities: "22",
  "Wholesale Trade": "42",
  "Fire & Life Safety": "2.8",
  "HVACR Services": "2.5",
  "Electrical / Lighting / Controls": "2.7",
  "Facility Services": "2.2",
  "Equipment Rental & Site Services": "2.4",
  "Portable Storage & Modular Solutions": "2.6",
  "Security Guards and Patrol Services": "561612",
  "Investigation and Security Services": "561610",
  "Investigation Services": "561611",
  "Armored Car Services": "561613",
  "Security Systems Services": "561621",
}

const API_CONFIG = {
  // SERP API (3 working keys for rotation)
  SERPAPI_PRIMARY: "ea4be3b298056ee31226234ee2a280409e20f2de623bbdb4a48d36a7bb4cfb0a",
  SERPAPI_BACKUP: "65ec74211e5929670ce9696d2c9a995772f8946f4923743f370938c541003a1c",
  SERPAPI_BACKUP2: "606fbdb7bf6d903f07f8666896c1801d793d76df85f6ef8c3e67092d1e0796ae",

  // DataAxle - Business data
  DATAAXLE_KEY: "c54bb620b9afa2f0b48a26b3",
  DATAAXLE_PEOPLE: "e65ac1c780a",
  DATAAXLE_PLACES: "a96078c5944",

  // Google APIs
  GOOGLE_MAPS_API_KEY: "AIzaSyDxwCGvlHvNdEssqgr-Sje-gHYDU0RiFGE",
  GOOGLE_PLACES_API_KEY: "AIzaSyDxwCGvlHvNdEssqgr-Sje-gHYDU0RiFGE",

  // Census API
  CENSUS_API_KEY: "274084692b280203c821ec6bf4436266a28d2a4c",

  // Yelp API
  YELP_API_KEY:
    "9R5wVAAW0ir_P1GrhxFsfVtv1aNolQHn3E15jQZqR43948PH99XndFP9x-aB82PSS3lBStlxhhtqykJ6qEImxUEVf2XzwSCAuh6A27e32Qmc3Js3tmJ-2kPRX6ahaHYx",

  // ArcGIS - Mapping
  ARCGIS_API_KEY:
    "AAPTxy8BH1VEsoebNVZXo8HurAtkxQnvfFiXSrnotYNZULX3quyJt6P3bjLWMd8qpCLnElbp6VTbI3WGcrY-7k2iPxOfWMyWGUr59752G6xqHiqM-Rp_Htgf6KxHetTpspkth4Fa9_iERW1piaDrhV7bu-EVZs3c4wnE4U2z5SxvYlAGdNPwkPd2VcA-ckO8L6tpYZy2zXlrXJvjcAYxQlpOKifsGs7sdkC-qJ62UrCpeAY.AT1_EWiBBjFc",
}

export default function BusinessLookup() {
  const [businessName, setBusinessName] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [manualLocation, setManualLocation] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("")
  const [useManualLocation, setUseManualLocation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [apiStatus, setApiStatus] = useState<Record<string, boolean>>({})
  const [resultCount, setResultCount] = useState(0)
  const [maxResults, setMaxResults] = useState(100)
  const [serpKeyIndex, setSerpKeyIndex] = useState(0)
  const [showInfoModal, setShowInfoModal] = useState(false)

  const US_STATES = {
    Alabama: "AL",
    Alaska: "AK",
    Arizona: "AZ",
    Arkansas: "AR",
    California: "CA",
    Colorado: "CO",
    Connecticut: "CT",
    Delaware: "DE",
    Florida: "FL",
    Georgia: "GA",
    Hawaii: "HI",
    Idaho: "ID",
    Illinois: "IL",
    Indiana: "IN",
    Iowa: "IA",
    Kansas: "KS",
    Kentucky: "KY",
    Louisiana: "LA",
    Maine: "ME",
    Maryland: "MD",
    Massachusetts: "MA",
    Michigan: "MI",
    Minnesota: "MN",
    Mississippi: "MS",
    Missouri: "MO",
    Montana: "MT",
    Nebraska: "NE",
    Nevada: "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    Ohio: "OH",
    Oklahoma: "OK",
    Oregon: "OR",
    Pennsylvania: "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    Tennessee: "TN",
    Texas: "TX",
    Utah: "UT",
    Vermont: "VT",
    Virginia: "VA",
    Washington: "WA",
    "West Virginia": "WV",
    Wisconsin: "WI",
    Wyoming: "WY",
  }

  const MAJOR_CITIES: Record<string, string[]> = {
    California: ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento", "Oakland", "Fresno"],
    "New York": ["New York City", "Buffalo", "Rochester", "Syracuse", "Albany", "Yonkers"],
    Texas: ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth", "El Paso", "Arlington"],
    Florida: ["Miami", "Tampa", "Orlando", "Jacksonville", "St. Petersburg", "Hialeah", "Tallahassee"],
    Illinois: ["Chicago", "Aurora", "Peoria", "Rockford", "Elgin", "Naperville"],
    Pennsylvania: ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading", "Scranton"],
    Ohio: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron", "Dayton"],
    Georgia: ["Atlanta", "Augusta", "Columbus", "Macon", "Savannah", "Athens"],
    "North Carolina": ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem", "Fayetteville"],
    Michigan: ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Lansing", "Ann Arbor"],
  }

  const validateApiKeys = async () => {
    try {
      const response = await fetch("/api/validate-apis")
      const status = await response.json()
      setApiStatus(status)
    } catch (error) {
      console.error("[v0] API validation error:", error)
    }
  }

  useEffect(() => {
    validateApiKeys()
  }, [])

  const getSerpKey = () => {
    const keys = [API_CONFIG.SERPAPI_PRIMARY, API_CONFIG.SERPAPI_BACKUP, API_CONFIG.SERPAPI_BACKUP2]
    const key = keys[serpKeyIndex % 3]
    setSerpKeyIndex((prev) => prev + 1)
    return key
  }

  const searchBusinesses = async () => {
    if (!selectedIndustry) {
      alert("Please select an industry")
      return
    }

    const location = useManualLocation
      ? manualLocation
      : selectedCity
        ? `${selectedCity}, ${selectedState}`
        : selectedState

    if (!location) {
      alert("Please select a location")
      return
    }

    setLoading(true)
    setResults([])
    setResultCount(0)

    try {
      const naicsCode = NAICS_CODES[selectedIndustry as keyof typeof NAICS_CODES]

      console.log("[v0] Starting comprehensive business search with all APIs")

      const response = await fetch("/api/search-businesses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          industry: selectedIndustry,
          location: location,
          naicsCode: naicsCode,
          maxResults: maxResults,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          console.log(
            "[v0] Business names returned from API:",
            data.results.map((b: any) => b.name),
          )
          setResults(data.results)
          setResultCount(data.count)
          console.log("[v0] Final results:", data.count, "unique businesses from sources:", data.sources)
        } else {
          throw new Error(data.error)
        }
      } else {
        throw new Error("Search request failed")
      }
    } catch (error) {
      console.error("[v0] Search error:", error)
      alert("Search failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const calculateBusinessAnalysis = (business: any, allResults: any[]) => {
    // TAM/TSM Analysis
    const industryMultiplier = NAICS_CODES[selectedIndustry as keyof typeof NAICS_CODES] || 2.0

    const estimatedRevenue = business.revenue || (business.employees ? business.employees * 75000 : 500000)
    const tam = estimatedRevenue * industryMultiplier * 100 // Total addressable market
    const tsm = tam * 0.15 // Total serviceable market (15% of TAM)

    // Market Fragmentation Analysis (HHI)
    const competitorCount = allResults.length
    const marketShare = 1 / competitorCount
    const hhi = competitorCount > 0 ? Math.min(10000, (marketShare * 10000) ** 2 * competitorCount) : 0
    const fragmentationLevel = hhi < 1500 ? "Highly Fragmented" : hhi < 2500 ? "Moderately Fragmented" : "Concentrated"

    // Succession Risk Scoring
    const yearsInBusiness = business.years_established ? 2024 - business.years_established : 10
    const successionRisk = yearsInBusiness > 15 ? "High" : yearsInBusiness > 10 ? "Medium" : "Low"

    // Digital Presence Analysis
    const hasWebsite = !!business.website
    const hasOnlineReviews = business.reviews > 10
    const digitalScore = (hasWebsite ? 40 : 0) + (hasOnlineReviews ? 30 : 0) + (business.rating > 4 ? 30 : 0)
    const digitalWeakness =
      digitalScore < 50 ? "High Opportunity" : digitalScore < 70 ? "Medium Opportunity" : "Strong Digital Presence"

    // Acquisition Score
    const revenueScore = estimatedRevenue >= 2000000 && estimatedRevenue <= 12000000 ? 30 : 10
    const successionScore = successionRisk === "High" ? 25 : successionRisk === "Medium" ? 15 : 5
    const fragmentationScore = fragmentationLevel === "Highly Fragmented" ? 25 : 15
    const digitalOpportunityScore = digitalWeakness === "High Opportunity" ? 20 : 10
    const acquisitionScore = revenueScore + successionScore + fragmentationScore + digitalOpportunityScore

    return {
      tam: tam / 1000000, // Convert to millions
      tsm: tsm / 1000000,
      hhi,
      fragmentationLevel,
      successionRisk,
      digitalWeakness,
      acquisitionScore,
      estimatedRevenue,
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <Search className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Comprehensive Business Intelligence Lookup</h2>
        <button
          onClick={() => setShowInfoModal(true)}
          className="ml-auto p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          title="Information about Security Demand & Crime Rate"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Security Demand & Crime Rate Analysis</h3>
              <button onClick={() => setShowInfoModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Security Demand Score (0-100%)</h4>
                <p>
                  Calculated based on local crime statistics, business density, and economic activity. Higher scores
                  indicate greater need for security services.
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    <strong>90-100%:</strong> Very High Demand - Major metropolitan areas with high crime rates
                  </li>
                  <li>
                    <strong>70-89%:</strong> High Demand - Urban areas with significant commercial activity
                  </li>
                  <li>
                    <strong>50-69%:</strong> Moderate Demand - Suburban areas with growing business districts
                  </li>
                  <li>
                    <strong>Below 50%:</strong> Lower Demand - Rural or low-crime areas
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Crime Rate (per 1,000 residents)</h4>
                <p>
                  Based on FBI Uniform Crime Reporting data and local law enforcement statistics. Includes violent
                  crimes, property crimes, and commercial crimes.
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    <strong>8.0+:</strong> High Crime Rate - Significant security needs
                  </li>
                  <li>
                    <strong>5.0-7.9:</strong> Moderate Crime Rate - Standard security demand
                  </li>
                  <li>
                    <strong>3.0-4.9:</strong> Low-Moderate Crime Rate - Basic security needs
                  </li>
                  <li>
                    <strong>Below 3.0:</strong> Low Crime Rate - Minimal security requirements
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Data Sources</h4>
                <p>
                  Crime data sourced from FBI UCR, Census Bureau, and local law enforcement agencies. Security demand
                  calculated using proprietary algorithms considering population density, business concentration, and
                  historical crime trends.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Multi-Source API Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(apiStatus).map(([api, status]) => (
            <div key={api} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${status ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-xs text-gray-600">{api}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Active APIs: {Object.values(apiStatus).filter(Boolean).length} / {Object.keys(apiStatus).length}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Name (Optional)</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter specific business name..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Industry (NAICS Classification) *</label>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Industry...</option>
            {Object.entries(NAICS_CODES).map(([industry, code]) => (
              <option key={industry} value={industry}>
                {industry} (NAICS {code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Location Targeting *</label>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setUseManualLocation(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !useManualLocation ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              State & City
            </button>
            <button
              onClick={() => setUseManualLocation(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                useManualLocation ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Manual Entry
            </button>
          </div>

          {!useManualLocation ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">State</label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value)
                    setSelectedCity("")
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select State...</option>
                  {Object.keys(US_STATES).map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">City (Optional)</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedState}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">All Cities in {selectedState}</option>
                  {selectedState &&
                    MAJOR_CITIES[selectedState]?.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          ) : (
            <input
              type="text"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter city, state (e.g., San Francisco, CA)"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Results</label>
          <select
            value={maxResults}
            onChange={(e) => setMaxResults(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={25}>25 Results</option>
            <option value={50}>50 Results</option>
            <option value={100}>100 Results</option>
          </select>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Target:</strong> {selectedIndustry || "No industry selected"} in{" "}
            {useManualLocation
              ? manualLocation || "No location entered"
              : selectedCity
                ? `${selectedCity}, ${selectedState}`
                : selectedState || "No location selected"}
          </p>
        </div>

        <button
          onClick={searchBusinesses}
          disabled={loading || !selectedIndustry || (!selectedState && !manualLocation)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Searching...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Search Businesses
            </>
          )}
        </button>
      </div>

      {resultCount > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Comprehensive Results ({resultCount} businesses found)
            </h3>
            <div className="text-sm text-gray-600">Multi-source data • Up to {maxResults} results</div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {results.map((business, index) => {
              const analysis = calculateBusinessAnalysis(business, results)

              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-start gap-3">
                      {business.logo && (
                        <img
                          src={business.logo || "/placeholder.svg"}
                          alt={`${business.name} logo`}
                          className="w-12 h-12 rounded object-cover border flex-shrink-0"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).style.display = "none"
                          }}
                        />
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {(() => {
                            // Ensure we always render a string, never an object
                            const name = business.name || business.title
                            if (typeof name === "string") {
                              return name
                            } else if (name && typeof name === "object") {
                              // Handle objects with alias/title properties
                              return (
                                (name as any)?.title ||
                                (name as any)?.alias ||
                                (name as any)?.name ||
                                "Unknown Business"
                              )
                            }
                            return "Unknown Business"
                          })()}
                        </h4>
                        {business.categories && (
                          <p className="text-xs text-gray-500">
                            {(() => {
                              const categories = business.categories
                              if (typeof categories === "string") {
                                return categories
                              } else if (categories && typeof categories === "object") {
                                // Handle objects with alias/title properties
                                return (
                                  (categories as any)?.title ||
                                  (categories as any)?.alias ||
                                  (categories as any)?.name ||
                                  "Business Category"
                                )
                              }
                              return String(categories)
                            })()}
                          </p>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          Debug:{" "}
                          {JSON.stringify({
                            name: business.name,
                            title: business.title,
                            source: business.source,
                          }).slice(0, 100)}
                          ...
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{business.source}</span>
                      {business.naics_code && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          NAICS {business.naics_code}
                        </span>
                      )}
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${
                          analysis.acquisitionScore >= 80
                            ? "bg-green-100 text-green-800"
                            : analysis.acquisitionScore >= 60
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        Score: {analysis.acquisitionScore}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    {business.address && (
                      <p>
                        <MapPin className="w-4 h-4 inline mr-1" />
                        {business.address}
                      </p>
                    )}
                    {business.phone && (
                      <p>
                        <Phone className="w-4 h-4 inline mr-1" />
                        {business.phone}
                      </p>
                    )}
                    {business.website && (
                      <p>
                        <Globe className="w-4 h-4 inline mr-1" />
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Website
                        </a>
                      </p>
                    )}
                    {business.rating && (
                      <p>
                        <Star className="w-4 h-4 inline mr-1 text-yellow-500" />
                        {business.rating}/5 ({business.reviews} reviews)
                      </p>
                    )}

                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      {business.revenue && (
                        <span>
                          <TrendingUp className="w-3 h-3 inline mr-1" />
                          Revenue: ${business.revenue?.toLocaleString()}
                        </span>
                      )}
                      {business.employees && (
                        <span>
                          <Database className="w-3 h-3 inline mr-1" />
                          Employees: {business.employees}
                        </span>
                      )}
                      {business.years_established && <span>Est. {business.years_established}</span>}
                      {business.price && <span className="font-medium">{business.price}</span>}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div className="bg-blue-50 p-2 rounded">
                        <div className="font-medium text-blue-800">TAM Analysis</div>
                        <div className="text-blue-600">${analysis.tam.toFixed(1)}M TAM</div>
                        <div className="text-blue-600">${analysis.tsm.toFixed(1)}M TSM</div>
                      </div>

                      <div className="bg-purple-50 p-2 rounded">
                        <div className="font-medium text-purple-800">Market Fragmentation</div>
                        <div className="text-purple-600">HHI: {analysis.hhi.toFixed(0)}</div>
                        <div className="text-purple-600">{analysis.fragmentationLevel}</div>
                      </div>

                      <div className="bg-orange-50 p-2 rounded">
                        <div className="font-medium text-orange-800">Succession Risk</div>
                        <div
                          className={`font-medium ${
                            analysis.successionRisk === "High"
                              ? "text-green-600"
                              : analysis.successionRisk === "Medium"
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {analysis.successionRisk}
                        </div>
                        <div className="text-orange-600">Opportunity</div>
                      </div>

                      <div className="bg-green-50 p-2 rounded">
                        <div className="font-medium text-green-800">Digital Opportunity</div>
                        <div
                          className={`font-medium ${
                            analysis.digitalWeakness === "High Opportunity"
                              ? "text-green-600"
                              : analysis.digitalWeakness === "Medium Opportunity"
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {analysis.digitalWeakness}
                        </div>
                        <div className="text-green-600">Modernization</div>
                      </div>
                    </div>

                    <div className="mt-2 flex justify-between items-center text-xs">
                      <div className="text-gray-600">
                        Est. Revenue:{" "}
                        <span className="font-medium">${(analysis.estimatedRevenue / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch("/api/crm/add-business", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  ...business,
                                  ...analysis,
                                  industry: selectedIndustry,
                                  searchLocation: useManualLocation
                                    ? manualLocation
                                    : selectedCity
                                      ? `${selectedCity}, ${selectedState}`
                                      : selectedState,
                                }),
                              })
                              if (response.ok) {
                                alert("Business added to CRM successfully!")
                              }
                            } catch (error) {
                              console.error("[v0] Error adding to CRM:", error)
                              alert("Failed to add business to CRM")
                            }
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                        >
                          Add to CRM
                        </button>
                        <div className="text-gray-600">
                          Market Position:{" "}
                          <span className="font-medium">
                            {analysis.acquisitionScore >= 80
                              ? "Prime Target"
                              : analysis.acquisitionScore >= 60
                                ? "Good Opportunity"
                                : "Monitor"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
