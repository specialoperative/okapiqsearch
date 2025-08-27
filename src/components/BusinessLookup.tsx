"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Phone, Globe, Star, Database, TrendingUp, Info, X, Download } from "lucide-react"

const NAICS_CODES = {
  "Crop Production": "111",
  "Animal Production and Aquaculture": "112",
  "Forestry and Logging": "113",
  "Fishing, Hunting and Trapping": "114",
  "Support Activities for Agriculture and Forestry": "115",
  "Oil and Gas Extraction": "211",
  "Mining (except Oil and Gas)": "212",
  "Support Activities for Mining": "213",
  "Electric Power Generation, Transmission and Distribution": "2211",
  "Natural Gas Distribution": "2212",
  "Water, Sewage and Other Systems": "2213",
  "Construction of Buildings": "236",
  "Heavy and Civil Engineering Construction": "237",
  "Specialty Trade Contractors": "238",
  "Plumbing, Heating, and Air-Conditioning Contractors": "238220",
  "Electrical Contractors and Other Wiring Installation Contractors": "238210",
  "Masonry Contractors": "238140",
  "Roofing Contractors": "238160",
  "Concrete Contractors": "238110",
  "Food Manufacturing": "311",
  "Beverage and Tobacco Product Manufacturing": "312",
  "Textile Mills": "313",
  "Textile Product Mills": "314",
  "Apparel Manufacturing": "315",
  "Leather and Allied Product Manufacturing": "316",
  "Wood Product Manufacturing": "321",
  "Paper Manufacturing": "322",
  "Printing and Related Support Activities": "323",
  "Petroleum and Coal Products Manufacturing": "324",
  "Chemical Manufacturing": "325",
  "Plastics and Rubber Products Manufacturing": "326",
  "Nonmetallic Mineral Product Manufacturing": "327",
  "Primary Metal Manufacturing": "331",
  "Fabricated Metal Product Manufacturing": "332",
  "Machinery Manufacturing": "333",
  "Computer and Electronic Product Manufacturing": "334",
  "Electrical Equipment, Appliance, and Component Manufacturing": "335",
  "Transportation Equipment Manufacturing": "336",
  "Furniture and Related Product Manufacturing": "337",
  "Miscellaneous Manufacturing": "339",
  "Merchant Wholesalers, Durable Goods": "423",
  "Merchant Wholesalers, Nondurable Goods": "424",
  "Wholesale Electronic Markets and Agents and Brokers": "425",
  "Motor Vehicle and Parts Dealers": "441",
  "Furniture and Home Furnishings Stores": "442",
  "Electronics and Appliance Stores": "443",
  "Building Material and Garden Equipment and Supplies Dealers": "444",
  "Food and Beverage Stores": "445",
  "Supermarkets and Other Grocery Stores": "445110", // Added detailed grocery store code
  "Health and Personal Care Stores": "446",
  "Gasoline Stations": "447",
  "Clothing and Clothing Accessories Stores": "448",
  "Sporting Goods, Hobby, Musical Instrument, and Book Stores": "451",
  "General Merchandise Stores": "452",
  "Miscellaneous Store Retailers": "453",
  "Nonstore Retailers": "454",
  "Air Transportation": "481",
  "Rail Transportation": "482",
  "Water Transportation": "483",
  "Truck Transportation": "484",
  "Transit and Ground Passenger Transportation": "485",
  "Pipeline Transportation": "486",
  "Scenic and Sightseeing Transportation": "487",
  "Support Activities for Transportation": "488",
  "Postal Service": "491",
  "Couriers and Messengers": "492",
  "Warehousing and Storage": "493",
  "Publishing Industries (except Internet)": "511",
  "Software Publishers": "511210",
  "Motion Picture and Sound Recording Industries": "512",
  "Broadcasting (except Internet)": "515",
  Telecommunications: "517",
  "Data Processing, Hosting, and Related Services": "518",
  "Other Information Services": "519",
  "Monetary Authorities-Central Bank": "521",
  "Credit Intermediation and Related Activities": "522",
  "Securities, Commodity Contracts, and Other Financial Investments": "523",
  "Insurance Carriers and Related Activities": "524",
  "Funds, Trusts, and Other Financial Vehicles": "525",
  "Real Estate": "531",
  "Rental and Leasing Services": "532",
  "Lessors of Nonfinancial Intangible Assets": "533",
  "Legal Services": "5411",
  "Accounting, Tax Preparation, Bookkeeping, and Payroll Services": "5412",
  "Architectural, Engineering, and Related Services": "5413",
  "Engineering Services": "541330",
  "Specialized Design Services": "5414",
  "Computer Systems Design and Related Services": "5415",
  "Custom Computer Programming Services": "541511",
  "Computer Systems Design Services": "541512",
  "Computer Facilities Management Services": "541513",
  "Management, Scientific, and Technical Consulting Services": "5416",
  "Human Resources Consulting Services": "541612",
  "Scientific Research and Development Services": "5417",
  "Advertising, Public Relations, and Related Services": "5418",
  "Other Professional, Scientific, and Technical Services": "5419",
  "Management of Companies and Enterprises": "551",
  "Administrative and Support Services": "561",
  "Landscaping Services": "561730",
  "Janitorial Services": "561720",
  "Carpet and Upholstery Cleaning Services": "561740",
  "Other Services to Buildings and Dwellings": "561790",
  "Investigation and Security Services": "561610",
  "Investigation Services": "561611",
  "Security Guards and Patrol Services": "561612",
  "Armored Car Services": "561613",
  "Security Systems Services": "561621",
  "Waste Management and Remediation Services": "562",
  "Solid Waste Collection": "562111",
  "Other Waste Collection": "562119",
  "Remediation Services": "562910",
  "Educational Services": "611",
  "Ambulatory Health Care Services": "621",
  "Home Health Care Services": "621610", // Added home health care services
  "Dental Practices": "621210",
  Hospitals: "622",
  "Nursing and Residential Care Facilities": "623",
  "Social Assistance": "624",
  "Child Day Care Services": "624410", // Added child day care services
  "Performing Arts, Spectator Sports, and Related Industries": "711",
  "Museums, Historical Sites, and Similar Institutions": "712",
  "Amusement, Gambling, and Recreation Industries": "713",
  "Fitness and Recreational Sports Centers": "713940", // Added fitness centers
  Accommodation: "721",
  "Food Services and Drinking Places": "722",
  "Full-Service Restaurants": "722511", // Added detailed restaurant codes
  "Limited-Service Restaurants": "722513",
  "Repair and Maintenance": "811",
  "Car Washes": "811192", // Added car wash services
  "All Other Automotive Repair and Maintenance": "811198", // Added auto detailing and maintenance
  "Personal and Laundry Services": "812",
  "Funeral Homes and Funeral Services": "812210", // Added funeral services
  "Drycleaning and Laundry Services": "812320", // Added dry cleaning services
  "Pet Care Services": "812910", // Added pet care services
  "Parking Lots and Garages": "812930", // Added parking services
  "Religious, Grantmaking, Civic, Professional Organizations": "813",
  "Executive, Legislative, and Other General Government Support": "921",
  "Justice, Public Order, and Safety Activities": "922",
  "Administration of Human Resource Programs": "923",
  "Administration of Environmental Quality Programs": "924",
  "Administration of Housing Programs, Urban Planning": "925",
  "Administration of Economic Programs": "926",
  "Space Research and Technology": "927",
  "National Security and International Affairs": "928",
  "Fire & Life Safety": "561621",
  "HVACR Services": "238220",
}

const API_CONFIG = {
  SERPAPI_PRIMARY: "ea4be3b298056ee31226234ee2a280409e20f2de623bbdb4a48d36a7bb4cfb0a",
  SERPAPI_BACKUP: "65ec74211e5929670ce9696d2c9a995772f8946f4923743f370938c541003a1c",
  SERPAPI_BACKUP2: "606fbdb7bf6d903f07f8666896c1801d793d76df85f6ef8c3e67092d1e0796ae",
  DATAAXLE_KEY: "c54bb620b9afa2f0b48a26b3",
  DATAAXLE_PEOPLE: "e65ac1c780a",
  DATAAXLE_PLACES: "a96078c5944",
  GOOGLE_MAPS_API_KEY: "AIzaSyDxwCGvlHvNdEssqgr-Sje-gHYDU0RiFGE",
  GOOGLE_PLACES_API_KEY: "AIzaSyDxwCGvlHvNdEssqgr-Sje-gHYDU0RiFGE",
  CENSUS_API_KEY: "274084692b280203c821ec6bf4436266a28d2a4c",
  YELP_API_KEY:
    "9R5wVAAW0ir_P1GrhxFsfVtv1aNolQHn3E15jQZqR43948PH99XndFP9x-aB82PSS3lBStlxhhtqykJ6qEImxUEVf2XzwSCAuh6A27e32Qmc3Js3tmJ-2kPRX6ahaHYx",
  ARCGIS_API_KEY:
    "AAPTxy8BH1VEsoebNVZXo8HurAtkxQnvfFiXSrnotYNZULX3quyJt6P3bjLWMd8qpCLnElbp6VTbI3WGcrY-7k2iPxOfWMyWGUr59752G6xqHiqM-Rp_Htgf6KxHetTpspkth4Fa9_iERW1piaDrhV7bu-EVZs3c4wnE4U2z5SxvYlAGdNPwkPd2VcA-ckO8L6tpYZy2zXlrXJvjcAYxQlpOKifsGs7sdkC-qJ62UrCpeAY.AT1_EWiBBjFc",
}

export default function BusinessLookup() {
  const [businessName, setBusinessName] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [manualLocation, setManualLocation] = useState("")
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [useManualLocation, setUseManualLocation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [apiStatus, setApiStatus] = useState<Record<string, boolean>>({})
  const [resultCount, setResultCount] = useState(0)
  const [maxResults, setMaxResults] = useState(100)
  const [serpKeyIndex, setSerpKeyIndex] = useState(0)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [industrySearch, setIndustrySearch] = useState("")
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false)

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
    if (selectedIndustries.length === 0) {
      alert("Please select at least one industry")
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
      const naicsCodes = selectedIndustries
        .map((industry) => NAICS_CODES[industry as keyof typeof NAICS_CODES])
        .join(",")

      console.log("[v0] Starting comprehensive business search with all APIs")

      const response = await fetch("/api/search-businesses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          industry: selectedIndustries.join(","),
          location: location,
          naicsCode: naicsCodes,
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
    const industryMultiplier =
      selectedIndustries.length > 0 ? NAICS_CODES[selectedIndustries[0] as keyof typeof NAICS_CODES] || 2.0 : 2.0

    const estimatedRevenue = business.revenue || (business.employees ? business.employees * 75000 : 500000)
    const tam = estimatedRevenue * industryMultiplier * 100 // Total addressable market
    const tsm = tam * 0.15 // Total serviceable market (15% of TAM)

    const competitorCount = allResults.length
    const marketShare = 1 / competitorCount
    const hhi = competitorCount > 0 ? Math.min(10000, (marketShare * 10000) ** 2 * competitorCount) : 0
    const fragmentationLevel = hhi < 1500 ? "Highly Fragmented" : hhi < 2500 ? "Moderately Fragmented" : "Concentrated"

    const yearsInBusiness = business.years_established ? 2024 - business.years_established : 10
    const successionRisk = yearsInBusiness > 15 ? "High" : yearsInBusiness > 10 ? "Medium" : "Low"

    const hasWebsite = !!business.website
    const hasOnlineReviews = business.reviews > 10
    const digitalScore = (hasWebsite ? 40 : 0) + (hasOnlineReviews ? 30 : 0) + (business.rating > 4 ? 30 : 0)
    const digitalWeakness =
      digitalScore < 50 ? "High Opportunity" : digitalScore < 70 ? "Medium Opportunity" : "Strong Digital Presence"

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

  const addIndustry = (industry: string) => {
    if (!selectedIndustries.includes(industry)) {
      setSelectedIndustries([...selectedIndustries, industry])
    }
    setIndustrySearch("")
    setShowIndustryDropdown(false)
  }

  const removeIndustry = (industry: string) => {
    setSelectedIndustries(selectedIndustries.filter((i) => i !== industry))
  }

  const filteredIndustries = Object.keys(NAICS_CODES).filter(
    (industry) =>
      industry.toLowerCase().includes(industrySearch.toLowerCase()) && !selectedIndustries.includes(industry),
  )

  const exportToCSV = () => {
    if (results.length === 0) {
      alert("No results to export. Please search for businesses first.")
      return
    }

    const headers = [
      "Company Name",
      "Industry",
      "NAICS Code",
      "Address",
      "Phone",
      "Website",
      "Rating",
      "Reviews",
      "Est. Revenue",
      "Employees",
      "Year Est.",
      "Acquisition Score",
      "TAM (Millions)",
      "TSM (Millions)",
      "HHI",
      "Fragmentation Level",
      "Succession Risk",
      "Digital Opportunity",
      "Market Position",
      "Source",
      "Search Location",
      "Search Industries",
    ]

    const csvData = results.map((business) => {
      const analysis = calculateBusinessAnalysis(business, results)
      const businessName = (() => {
        const name = business.name || business.title
        if (typeof name === "string") {
          return name
        } else if (name && typeof name === "object") {
          return (name as any)?.title || (name as any)?.alias || (name as any)?.name || "Unknown Business"
        }
        return "Unknown Business"
      })()

      const categories = (() => {
        const cats = business.categories
        if (typeof cats === "string") {
          return cats
        } else if (cats && typeof cats === "object") {
          return (cats as any)?.title || (cats as any)?.alias || (cats as any)?.name || "Business Category"
        }
        return String(cats || "")
      })()

      return [
        businessName,
        categories,
        business.naics_code || "",
        business.address || "",
        business.phone || "",
        business.website || "",
        business.rating || "",
        business.reviews || "",
        analysis.estimatedRevenue ? `$${(analysis.estimatedRevenue / 1000000).toFixed(1)}M` : "",
        business.employees || "",
        business.years_established || "",
        analysis.acquisitionScore,
        analysis.tam.toFixed(1),
        analysis.tsm.toFixed(1),
        analysis.hhi.toFixed(0),
        analysis.fragmentationLevel,
        analysis.successionRisk,
        analysis.digitalWeakness,
        analysis.acquisitionScore >= 80
          ? "Prime Target"
          : analysis.acquisitionScore >= 60
            ? "Good Opportunity"
            : "Monitor",
        business.source || "",
        useManualLocation ? manualLocation : selectedCity ? `${selectedCity}, ${selectedState}` : selectedState,
        selectedIndustries.join("; "),
      ]
    })

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `business-intelligence-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log(`[v0] Exported ${results.length} businesses to CSV with comprehensive analysis data`)
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Industries (NAICS Classification) *</label>

          {selectedIndustries.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {selectedIndustries.map((industry) => (
                <div
                  key={industry}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {industry} (NAICS {NAICS_CODES[industry as keyof typeof NAICS_CODES]})
                  <button onClick={() => removeIndustry(industry)} className="hover:bg-blue-200 rounded-full p-1">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative">
            <input
              type="text"
              value={industrySearch}
              onChange={(e) => {
                setIndustrySearch(e.target.value)
                setShowIndustryDropdown(true)
              }}
              onFocus={() => setShowIndustryDropdown(true)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search and select industries..."
            />

            {showIndustryDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredIndustries.length > 0 ? (
                  filteredIndustries.map((industry) => (
                    <button
                      key={industry}
                      onClick={() => addIndustry(industry)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium">{industry}</div>
                      <div className="text-sm text-gray-500">
                        NAICS {NAICS_CODES[industry as keyof typeof NAICS_CODES]}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">No industries found</div>
                )}
              </div>
            )}
          </div>

          {showIndustryDropdown && <div className="fixed inset-0 z-5" onClick={() => setShowIndustryDropdown(false)} />}
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
            <strong>Target:</strong>{" "}
            {selectedIndustries.length > 0 ? selectedIndustries.join(", ") : "No industries selected"} in{" "}
            {useManualLocation
              ? manualLocation || "No location entered"
              : selectedCity
                ? `${selectedCity}, ${selectedState}`
                : selectedState || "No location selected"}
          </p>
        </div>

        <button
          onClick={searchBusinesses}
          disabled={loading || selectedIndustries.length === 0 || (!selectedState && !manualLocation)}
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
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">Multi-source data • Up to {maxResults} results</div>
              <button
                onClick={exportToCSV}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
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
                            const name = business.name || business.title
                            if (typeof name === "string") {
                              return name
                            } else if (name && typeof name === "object") {
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
                                  industry: selectedIndustries.join(","),
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
