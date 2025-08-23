// API Configuration for Comprehensive Data Intelligence Platform
export const API_CONFIG = {
  YELP_API_KEY:
    process.env.YELP_API_KEY ||
    "9R5wVAAW0ir_P1GrhxFsfVtv1aNolQHn3E15jQZqR43948PH99XndFP9x-aB82PSS3lBStlxhhtqykJ6qEImxUEVf2XzwSCAuh6A27e32Qmc3Js3tmJ-2kPRX6ahaHYx",
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || "AIzaSyDxwCGvlHvNdEssqgr-Sje-gHYDU0RiFGE",
  GLENCOCO_API_KEY: process.env.GLENCOCO_API_KEY || "your_glencoco_api_key_here",
  CENSUS_API_KEY: process.env.CENSUS_API_KEY || "274084692b280203c821ec6bf4436266a28d2a4c",
  OPENAI_API_KEY:
    process.env.OPENAI_API_KEY ||
    "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",
  DATA_AXLE_API_KEY: process.env.DATA_AXLE_API_KEY || "c54bb620b9afa2f0b48a26b3",
  SERPAPI_API_KEY: process.env.SERPAPI_API_KEY || "606fbdb7bf6d903f07f8666896c1801d793d76df85f6ef8c3e67092d1e0796ae",
  APIFY_API_TOKEN: process.env.APIFY_API_TOKEN || "apify_api_DYwIpYb3depnAf3Y6USRGrf94kC2VC3Vzjs8",
  ARCGIS_API_KEY:
    process.env.ARCGIS_API_KEY ||
    "AAPTxy8BH1VEsoebNVZXo8HurAtkxQnvfFiXSrnotYNZULX3quyJt6P3bjLWMd8qpCLnElbp6VTbI3WGcrY-7k2iPxOfWMyWGUr59752G6xqHiqM-Rp_Htgf6KxHetTpspkth4Fa9_iERW1piaDrhV7bu-EVZs3c4wnE4U2z5SxvYlAGdNPwkPd2VcA-ckO8L6tpYZy2zXlrXJvjcAYxQlpOKifsGs7sdkC-qJ62UrCpeAY.AT1_EWiBBjFc",
} as const

// API endpoints and configurations
export const API_ENDPOINTS = {
  YELP_BASE_URL: "https://api.yelp.com/v3",
  GOOGLE_PLACES_BASE_URL: "https://maps.googleapis.com/maps/api/place",
  CENSUS_BASE_URL: "https://api.census.gov/data",
  DATA_AXLE_BASE_URL: "https://api.dataaxle.com",
  SERPAPI_BASE_URL: "https://serpapi.com/search",
  APIFY_BASE_URL: "https://api.apify.com/v2",
  ARCGIS_BASE_URL: "https://geocode.arcgis.com/arcgis/rest/services",
} as const

// Validation function to check if required API keys are present
export function validateApiKeys() {
  const requiredKeys = [
    "YELP_API_KEY",
    "CENSUS_API_KEY",
    "SERPAPI_API_KEY",
    "DATA_AXLE_API_KEY",
    "ARCGIS_API_KEY",
  ] as const

  const missingKeys = requiredKeys.filter((key) => !API_CONFIG[key] || API_CONFIG[key] === "your_glencoco_api_key_here")

  if (missingKeys.length > 0) {
    console.warn(`Missing API keys: ${missingKeys.join(", ")}`)
    return false
  }

  return true
}

export const config = API_CONFIG
