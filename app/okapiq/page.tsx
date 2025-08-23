"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts"
import { Search, TrendingUp, Building2, DollarSign, Target, MapPin, AlertTriangle, CheckCircle } from "lucide-react"

interface MarketData {
  tam: number
  tsm: number
  hhi: number
  companies: number
  avgRevenue: number
  growthRate: number
}

interface BusinessTarget {
  id: string
  name: string
  industry: string
  location: string
  revenue: number
  employees: number
  founded: number
  acquisitionScore: number
  successionRisk: number
  digitalPresence: number
  valuation: number
}

export default function OkapiqDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [businessTargets, setBusinessTargets] = useState<BusinessTarget[]>([])
  const [loading, setLoading] = useState(false)

  // Mock data for demonstration
  const mockMarketData: MarketData = {
    tam: 2400000000,
    tsm: 480000000,
    hhi: 0.15,
    companies: 12500,
    avgRevenue: 850000,
    growthRate: 8.5,
  }

  const mockBusinessTargets: BusinessTarget[] = [
    {
      id: "1",
      name: "Elite Security Solutions",
      industry: "Security Services",
      location: "Houston, TX",
      revenue: 2500000,
      employees: 45,
      founded: 2008,
      acquisitionScore: 92,
      successionRisk: 85,
      digitalPresence: 68,
      valuation: 12500000,
    },
    {
      id: "2",
      name: "Metro Guard Services",
      industry: "Security Services",
      location: "Dallas, TX",
      revenue: 1800000,
      employees: 32,
      founded: 2012,
      acquisitionScore: 88,
      successionRisk: 72,
      digitalPresence: 75,
      valuation: 9000000,
    },
    {
      id: "3",
      name: "Lone Star Protection",
      industry: "Security Services",
      location: "Austin, TX",
      revenue: 3200000,
      employees: 68,
      founded: 2005,
      acquisitionScore: 95,
      successionRisk: 90,
      digitalPresence: 82,
      valuation: 16000000,
    },
  ]

  const tamTsmData = [
    { name: "TAM", value: mockMarketData.tam / 1000000, color: "#3b82f6" },
    { name: "TSM", value: mockMarketData.tsm / 1000000, color: "#9333ea" },
  ]

  const fragmentationData = [{ name: "Market Concentration", value: mockMarketData.hhi * 100 }]

  const industryGrowthData = [
    { month: "Jan", growth: 6.2 },
    { month: "Feb", growth: 7.1 },
    { month: "Mar", growth: 8.5 },
    { month: "Apr", growth: 9.2 },
    { month: "May", growth: 8.8 },
    { month: "Jun", growth: 10.1 },
  ]

  const runAnalysis = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setMarketData(mockMarketData)
      setBusinessTargets(mockBusinessTargets)
      setLoading(false)
    }, 2000)
  }

  useEffect(() => {
    runAnalysis()
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 75) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 75) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Okapiq</h1>
            <p className="text-muted-foreground text-lg">Bloomberg Terminal for Main Street</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-primary border-primary">
              Live Market Data
            </Badge>
            <Badge variant="outline" className="text-chart-4 border-chart-4">
              {businessTargets.length} Active Targets
            </Badge>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Market Intelligence Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search companies or industries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-input"
            />
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="bg-input">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="security">Security Services</SelectItem>
                <SelectItem value="hvac">HVAC</SelectItem>
                <SelectItem value="landscaping">Landscaping</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="bg-input">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="texas">Texas</SelectItem>
                <SelectItem value="california">California</SelectItem>
                <SelectItem value="florida">Florida</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={runAnalysis} disabled={loading} className="bg-primary hover:bg-primary/90">
              {loading ? "Analyzing..." : "Run Analysis"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-muted">
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="targets">Target Companies</TabsTrigger>
          <TabsTrigger value="analytics">PE Analytics</TabsTrigger>
          <TabsTrigger value="intelligence">Market Intelligence</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Addressable Market</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-1">
                  ${marketData ? (marketData.tam / 1000000000).toFixed(1) : "0"}B
                </div>
                <p className="text-xs text-muted-foreground">+12% from last quarter</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Serviceable Market</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-2">
                  ${marketData ? (marketData.tsm / 1000000).toFixed(0) : "0"}M
                </div>
                <p className="text-xs text-muted-foreground">20% of TAM</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Market Companies</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-4">
                  {marketData ? marketData.companies.toLocaleString() : "0"}
                </div>
                <p className="text-xs text-muted-foreground">Active businesses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-4">{marketData ? marketData.growthRate : "0"}%</div>
                <p className="text-xs text-muted-foreground">YoY growth</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>TAM vs TSM Analysis</CardTitle>
                <CardDescription>Market size breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tamTsmData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                    <XAxis dataKey="name" stroke="#ffffff" />
                    <YAxis stroke="#ffffff" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#374151", border: "none", borderRadius: "8px" }}
                      formatter={(value: number) => [`$${value}M`, "Value"]}
                    />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Fragmentation (HHI)</CardTitle>
                <CardDescription>Concentration analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadialBarChart innerRadius="60%" outerRadius="90%" data={fragmentationData}>
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar dataKey="value" cornerRadius={10} fill="#9333ea" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#374151", border: "none", borderRadius: "8px" }}
                      formatter={(value: number) => [`${value.toFixed(1)}%`, "HHI"]}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    {marketData && marketData.hhi < 0.15
                      ? "Unconcentrated Market"
                      : marketData && marketData.hhi < 0.25
                        ? "Moderately Concentrated"
                        : "Highly Concentrated"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Industry Growth Trend</CardTitle>
              <CardDescription>6-month growth trajectory</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={industryGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                  <XAxis dataKey="month" stroke="#ffffff" />
                  <YAxis stroke="#ffffff" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#374151", border: "none", borderRadius: "8px" }}
                    formatter={(value: number) => [`${value}%`, "Growth"]}
                  />
                  <Line type="monotone" dataKey="growth" stroke="#f59e0b" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="targets" className="space-y-6">
          <div className="grid gap-6">
            {businessTargets.map((target) => (
              <Card key={target.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{target.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4" />
                        {target.location} • {target.industry}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getScoreBadge(target.acquisitionScore)} text-white`}>
                        Score: {target.acquisitionScore}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="text-lg font-semibold">${(target.revenue / 1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Employees</p>
                      <p className="text-lg font-semibold">{target.employees}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Founded</p>
                      <p className="text-lg font-semibold">{target.founded}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valuation</p>
                      <p className="text-lg font-semibold">${(target.valuation / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Succession Risk</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div className="bg-chart-5 h-2 rounded-full" style={{ width: `${target.successionRisk}%` }} />
                        </div>
                        <span className={`text-sm font-medium ${getScoreColor(target.successionRisk)}`}>
                          {target.successionRisk}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Digital Presence</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-chart-4 h-2 rounded-full"
                            style={{ width: `${target.digitalPresence}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${getScoreColor(target.digitalPresence)}`}>
                          {target.digitalPresence}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Acquisition Score</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-chart-1 h-2 rounded-full"
                            style={{ width: `${target.acquisitionScore}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${getScoreColor(target.acquisitionScore)}`}>
                          {target.acquisitionScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button variant="outline" className="mr-2 bg-transparent">
                      View Details
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90">Generate IC Memo</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>PE Analytics Dashboard</CardTitle>
                <CardDescription>Institutional-grade investment metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average EV/Revenue Multiple</span>
                    <span className="font-semibold">4.2x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average EV/EBITDA Multiple</span>
                    <span className="font-semibold">8.5x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Median IRR Projection</span>
                    <span className="font-semibold text-chart-4">22.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Risk-Adjusted Return</span>
                    <span className="font-semibold text-chart-1">18.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Opportunity Score</CardTitle>
                <CardDescription>Composite scoring methodology</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Market Fragmentation</span>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <div className="bg-muted rounded-full h-2">
                      <div className="bg-chart-1 h-2 rounded-full" style={{ width: "35%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Succession Risk</span>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <div className="bg-muted rounded-full h-2">
                      <div className="bg-chart-2 h-2 rounded-full" style={{ width: "25%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Digital Weakness</span>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                    <div className="bg-muted rounded-full h-2">
                      <div className="bg-chart-3 h-2 rounded-full" style={{ width: "20%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Ad Arbitrage</span>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                    <div className="bg-muted rounded-full h-2">
                      <div className="bg-chart-4 h-2 rounded-full" style={{ width: "15%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">TSM Growth</span>
                      <span className="text-sm font-medium">5%</span>
                    </div>
                    <div className="bg-muted rounded-full h-2">
                      <div className="bg-chart-5 h-2 rounded-full" style={{ width: "5%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-chart-3" />
                  Market Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-chart-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">High Succession Risk Detected</p>
                      <p className="text-xs text-muted-foreground">3 target companies have founders over 65</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <CheckCircle className="h-4 w-4 text-chart-4 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">New Market Opportunity</p>
                      <p className="text-xs text-muted-foreground">Austin market showing 15% growth</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <TrendingUp className="h-4 w-4 text-chart-1 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Industry Consolidation</p>
                      <p className="text-xs text-muted-foreground">2 major acquisitions this quarter</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scrappy Intelligence</CardTitle>
                <CardDescription>Local market insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Job Market Activity</p>
                    <p className="text-xs text-muted-foreground">
                      15 security companies posted hiring ads in Houston area this month
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Local Business Chatter</p>
                    <p className="text-xs text-muted-foreground">
                      Chamber of Commerce reports increased demand for security services
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Regulatory Changes</p>
                    <p className="text-xs text-muted-foreground">
                      New licensing requirements may create barriers to entry
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
