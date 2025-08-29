export class ComprehensiveApiService {
  private static instance: ComprehensiveApiService
  private apiKeys = {
    YELP_API_KEY:
      "9R5wVAAW0ir_P1GrhxFsfVtv1aNolQHn3E15jQZqR43948PH99XndFP9x-aB82PSS3lBStlxhhtqykJ6qEImxUEVf2XzwSCAuh6A27e32Qmc3Js3tmJ-2kPRX6ahaHYx",
    GOOGLE_MAPS_API_KEY: "AIzaSyDxwCGvlHvNdEssqgr-Sje-gHYDU0RiFGE",
    CENSUS_API_KEY: "274084692b280203c821ec6bf4436266a28d2a4c",
    DATA_AXLE_API_KEY: "c54bb620b9afa2f0b48a26b3",
    SERPAPI_API_KEY: "ea4be3b298056ee31226234ee2a280409e20f2de623bbdb4a48d36a7bb4cfb0a",
    ARCGIS_API_KEY:
      "AAPTxy8BH1VEsoebNVZXo8HurAtkxQnvfFiXSrnotYNZULX3quyJt6P3bjLWMd8qpCLnElbp6VTbI3WGcrY-7k2iPxOfWMyWGUr59752G6xqHiqM-Rp_Htgf6KxHetTpspkth4Fa9_iERW1piaDrhV7bu-EVZs3c4wnE4U2z5SxvYlAGdNPwkPd2VcA-ckO8L6tpYZy2zXlrXJvjcAYxQlpOKifsGs7sdkC-qJ62UrCpeAY.AT1_EWiBBjFc",
  }

  public static getInstance(): ComprehensiveApiService {
    if (!ComprehensiveApiService.instance) {
      ComprehensiveApiService.instance = new ComprehensiveApiService()
    }
    return ComprehensiveApiService.instance
  }

  async searchBusinessesMultiSource(
    industry: string,
    location: string,
    naicsCode: string,
    maxResults = 100,
  ): Promise<any[]> {
    const results: any[] = []

    // SERP API (Google Maps)
    try {
      const serpResponse = await fetch(
        `https://serpapi.com/search.json?api_key=${this.apiKeys.SERPAPI_API_KEY}&engine=google_maps&q=${industry}&location=${location}&num=50`,
      )
      if (serpResponse.ok) {
        const data = await serpResponse.json()
        const businesses =
          data.local_results?.map((business: any) => ({
            ...business,
            source: "Google Maps (SERP)",
            naics_code: naicsCode,
            name: business.title,
            address: business.address,
            rating: business.rating,
            reviews: business.reviews,
          })) || []
        results.push(...businesses)
      }
    } catch (error) {
      console.error("SERP API error:", error)
    }

    // Yelp API
    try {
      const yelpResponse = await fetch(
        `https://api.yelp.com/v3/businesses/search?location=${location}&categories=${industry.toLowerCase().replace(/\s+/g, "")}&limit=50`,
        {
          headers: { Authorization: `Bearer ${this.apiKeys.YELP_API_KEY}` },
        },
      )
      if (yelpResponse.ok) {
        const data = await yelpResponse.json()
        const businesses =
          data.businesses?.map((business: any) => ({
            ...business,
            source: "Yelp",
            naics_code: naicsCode,
            address: business.location?.display_address?.join(", "),
            reviews: business.review_count,
          })) || []
        results.push(...businesses)
      }
    } catch (error) {
      console.error("Yelp API error:", error)
    }

    // Google Places API
    try {
      const placesResponse = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${industry}+in+${location}&key=${this.apiKeys.GOOGLE_MAPS_API_KEY}`,
      )
      if (placesResponse.ok) {
        const data = await placesResponse.json()
        const businesses =
          data.results?.map((business: any) => ({
            ...business,
            source: "Google Places",
            naics_code: naicsCode,
            address: business.formatted_address,
            reviews: business.user_ratings_total,
          })) || []
        results.push(...businesses)
      }
    } catch (error) {
      console.error("Google Places API error:", error)
    }

    // Deduplicate and limit results
    const uniqueResults = results
      .filter(
        (business, index, self) =>
          index === self.findIndex((b) => b.name === business.name && b.address === business.address),
      )
      .slice(0, maxResults)

    return uniqueResults
  }

  async validateApiKeys(): Promise<Record<string, boolean>> {
    const status: Record<string, boolean> = {}

    // Test each API
    const tests = [
      {
        name: "SERP API",
        test: () =>
          fetch(`https://serpapi.com/search.json?api_key=${this.apiKeys.SERPAPI_API_KEY}&engine=google&q=test&num=1`),
      },
      {
        name: "Yelp API",
        test: () =>
          fetch("https://api.yelp.com/v3/businesses/search?location=test&limit=1", {
            headers: { Authorization: `Bearer ${this.apiKeys.YELP_API_KEY}` },
          }),
      },
      {
        name: "Google Maps API",
        test: () =>
          fetch(
            `https://maps.googleapis.com/maps/api/place/textsearch/json?query=test&key=${this.apiKeys.GOOGLE_MAPS_API_KEY}`,
          ),
      },
      {
        name: "Census API",
        test: () =>
          fetch(
            `https://api.census.gov/data/2021/acs/acs5?get=B01001_001E&for=state:*&key=${this.apiKeys.CENSUS_API_KEY}`,
          ),
      },
    ]

    for (const { name, test } of tests) {
      try {
        const response = await test()
        status[name] = response.ok
      } catch {
        status[name] = false
      }
    }

    return status
  }
}

export const apiService = ComprehensiveApiService.getInstance()
