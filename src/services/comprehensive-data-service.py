/


Y

Invite


Upgrade

Publish
""
Comprehensive Data Service - Uses ALL available APIs for maximum enrichment
This service ensures every feature gets real data from multiple sources
"""

import asyncio
import aiohttp
import json
from typing import Dict, List, Any, Optional
from datetime import datetime
import os
import logging

logger = logging.getLogger(__name__)

class ComprehensiveDataService:
    """
    Master service that integrates ALL APIs for complete data enrichment
    Ensures Fragment Finder, Market Scanner, and Valuation get real data
    """
    
    def __init__(self):
        # Load all API keys - ALL WORKING!
        self.api_keys = {
            # SERP API (we have 3 working keys for rotation)
            "SERPAPI_PRIMARY": os.getenv("SERPAPI_API_KEY", "ea4be3b298056ee31226234ee2a280409e20f2de623bbdb4a48d36a7bb4cfb0a"),
            "SERPAPI_BACKUP": os.getenv("SERPAPI_API_KEY_BACKUP", "65ec74211e5929670ce9696d2c9a995772f8946f4923743f370938c541003a1c"),
            "SERPAPI_BACKUP2": os.getenv("SERPAPI_API_KEY_BACKUP2", "606fbdb7bf6d903f07f8666896c1801d793d76df85f6ef8c3e67092d1e0796ae"),
            
            # DataAxle - WORKING
            "DATAAXLE_KEY": os.getenv("DATA_AXLE_API_KEY", "c54bb620b9afa2f0b48a26b3"),
            "DATAAXLE_PEOPLE": os.getenv("DATAAXLE_PEOPLE_API_TOKEN", "e65ac1c780a"),
            "DATAAXLE_PLACES": os.getenv("DATAAXLE_PLACES_API_TOKEN", "a96078c5944"),
            
            # Google APIs - WORKING
            "GOOGLE_MAPS": os.getenv("GOOGLE_MAPS_API_KEY", "AIzaSyDxwCGvlHvNdEssqgr-Sje-gHYDU0RiFGE"),
            "GOOGLE_PLACES": os.getenv("GOOGLE_PLACES_API_KEY", "AIzaSyDxwCGvlHvNdEssqgr-Sje-gHYDU0RiFGE"),
            
            # Census API - WORKING
            "CENSUS": os.getenv("CENSUS_API_KEY", "274084692b280203c821ec6bf4436266a28d2a4c"),
            
            # Yelp API - WORKING
            "YELP": os.getenv("YELP_API_KEY", "9R5wVAAW0ir_P1GrhxFsfVtv1aNolQHn3E15jQZqR43948PH99XndFP9x-aB82PSS3lBStlxhhtqykJ6qEImxUEVf2XzwSCAuh6A27e32Qmc3Js3tmJ-2kPRX6ahaHYx"),
            
            # OpenAI - WORKING (GPT-4)
            "OPENAI": os.getenv("OPENAI_API_KEY", "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"),
            
            # Apify - WORKING (Web scraping)
            "APIFY": os.getenv("APIFY_API_TOKEN", "apify_api_DYwIpYb3depnAf3Y6USRGrf94kC2VC3Vzjs8"),
            
            # ArcGIS - WORKING (Mapping)
            "ARCGIS": os.getenv("ARCGIS_API_KEY", "AAPTxy8BH1VEsoebNVZXo8HurAtkxQnvfFiXSrnotYNZULX3quyJt6P3bjLWMd8qpCLnElbp6VTbI3WGcrY-7k2iPxOfWMyWGUr59752G6xqHiqM-Rp_Htgf6KxHetTpspkth4Fa9_iERW1piaDrhV7bu-EVZs3c4wnE4U2z5SxvYlAGdNPwkPd2VcA-ckO8L6tpYZy2zXlrXJvjcAYxQlpOKifsGs7sdkC-qJ62UrCpeAY.AT1_EWiBBjFc"),
        }
        
        self.session = None
        self.serp_key_index = 0  # For rotating SERP keys
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    def get_serp_key(self) -> str:
        """Rotate between all 3 SERP API keys for maximum throughput"""
        keys = [
            self.api_keys["SERPAPI_PRIMARY"], 
            self.api_keys["SERPAPI_BACKUP"],
            self.api_keys["SERPAPI_BACKUP2"]
        ]
        key = keys[self.serp_key_index % 3]
        self.serp_key_index += 1
        return key
    
    async def get_comprehensive_business_data(
        self,
        business_name: str,
        location: str,
        industry: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get data from ALL available sources for a business
        Used by Market Scanner and Valuation Engine
        """
        results = {
            "business_name": business_name,
            "location": location,
            "industry": industry,
            "timestamp": datetime.now().isoformat(),
            "data_sources": {},
            "aggregated_metrics": {},
            "valuation_inputs": {},
            "fragment_analysis": {},
            "market_position": {}
        }
        
        # Run all API calls in parallel for speed
        tasks = []
        
        # SERP API - Google Search & Maps
        if self.api_keys["SERPAPI_PRIMARY"]:
            tasks.append(self.get_serp_data(business_name, location))
            
        # DataAxle - Business data
        if self.api_keys["DATAAXLE_PLACES"]:
            tasks.append(self.get_dataaxle_business(business_name, location))
            
        # Census - Demographics
        if self.api_keys["CENSUS"]:
            tasks.append(self.get_census_demographics(location))
            
        # Google Places - Reviews and details
        if self.api_keys["GOOGLE_PLACES"]:
            tasks.append(self.get_google_places_data(business_name, location))
            
        # Yelp - Ratings and reviews
        if self.api_keys["YELP"]:
            tasks.append(self.get_yelp_data(business_name, location))
        
        # Execute all API calls
        if tasks:
            api_results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Process results
            for i, result in enumerate(api_results):
                if not isinstance(result, Exception):
                    source_name = ["serp", "dataaxle", "census", "google", "yelp"][i]
                    results["data_sources"][source_name] = result
        
        # Aggregate metrics for valuation
        results["aggregated_metrics"] = self.aggregate_metrics(results["data_sources"])
        
        # Calculate valuation inputs
        results["valuation_inputs"] = self.calculate_valuation_inputs(results["aggregated_metrics"])
        
        # Fragment analysis data
        results["fragment_analysis"] = self.analyze_fragmentation(results["data_sources"], location, industry)
        
        # Market position analysis
        results["market_position"] = self.analyze_market_position(results["data_sources"])
        
        return results
    
    async def get_serp_data(self, business_name: str, location: str) -> Dict[str, Any]:
        """Get data from SERP API (Google)"""
        try:
            api_key = self.get_serp_key()
            
            # Search Google Maps for business
            maps_url = "https://serpapi.com/search.json"
            maps_params = {
                "api_key": api_key,
                "engine": "google_maps",
                "q": business_name,
                "location": location,
                "limit": 5
            }
            
            async with self.session.get(maps_url, params=maps_params) as resp:
                maps_data = await resp.json() if resp.status == 200 else {}
            
            # Get Google Trends
            trends_params = {
                "api_key": api_key,
                "engine": "google_trends",
                "q": business_name,
                "geo": location[:2].upper()  # State code
            }
            
            async with self.session.get(maps_url, params=trends_params) as resp:
                trends_data = await resp.json() if resp.status == 200 else {}
            
            return {
                "maps": maps_data.get("local_results", []),
                "trends": trends_data.get("interest_over_time", {}),
                "reviews": maps_data.get("reviews", []),
                "rating": maps_data.get("rating"),
                "total_reviews": maps_data.get("reviews_count")
            }
        except Exception as e:
            logger.error(f"SERP API error: {e}")
            return {}
    
    async def get_dataaxle_business(self, business_name: str, location: str) -> Dict[str, Any]:
        """Get business data from DataAxle"""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_keys['DATAAXLE_PLACES']}",
                "Content-Type": "application/json"
            }
            
            url = "https://api.dataaxle.com/v1/places/search"
            params = {
                "name": business_name,
                "city": location.split(",")[0] if "," in location else location,
                "limit": 10
            }
            
            async with self.session.get(url, headers=headers, params=params) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    businesses = data.get("records", [])
                    
                    if businesses:
                        business = businesses[0]  # Best match
                        return {
                            "revenue": business.get("revenue"),
                            "employees": business.get("employeeCount"),
                            "years_in_business": business.get("yearEstablished"),
                            "sic_codes": business.get("sic"),
                            "naics_codes": business.get("naics"),
                            "contact": {
                                "phone": business.get("phone"),
                                "email": business.get("email"),
                                "website": business.get("website")
                            },
                            "location": {
                                "address": business.get("address"),
                                "city": business.get("city"),
                                "state": business.get("state"),
                                "zip": business.get("zipCode")
                            }
                        }
            return {}
        except Exception as e:
            logger.error(f"DataAxle API error: {e}")
            return {}
    
    async def get_census_demographics(self, location: str) -> Dict[str, Any]:
        """Get demographic data from Census API - REAL DATA"""
        try:
            # Real Census API call with working key
            base_url = "https://api.census.gov/data/2021/acs/acs5"
            params = {
                "get": "B01001_001E,B19013_001E,B25077_001E",  # Population, Income, Home Value
                "for": "place:*",
                "in": "state:*",
                "key": self.api_keys["CENSUS"]
            }
            
            async with self.session.get(base_url, params=params) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    # Process census data
                    return {
                        "population": data[1][0] if len(data) > 1 else 0,
                        "median_income": data[1][1] if len(data) > 1 else 0,
                        "median_home_value": data[1][2] if len(data) > 1 else 0
                    }
            return {}
        except Exception as e:
            logger.error(f"Census API error: {e}")
            return {}
    
    async def get_google_places_data(self, business_name: str, location: str) -> Dict[str, Any]:
        """Get data from Google Places API"""
        try:
            if not self.api_keys["GOOGLE_PLACES"]:
                return {}
            
            # Find place
            find_url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
            find_params = {
                "input": f"{business_name} {location}",
                "inputtype": "textquery",
                "fields": "place_id,name,rating,user_ratings_total",
                "key": self.api_keys["GOOGLE_PLACES"]
            }
            
            async with self.session.get(find_url, params=find_params) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    if data.get("candidates"):
                        place = data["candidates"][0]
                        place_id = place.get("place_id")
                        
                        # Get details
                        details_url = "https://maps.googleapis.com/maps/api/place/details/json"
                        details_params = {
                            "place_id": place_id,
                            "fields": "rating,user_ratings_total,reviews,website,formatted_phone_number",
                            "key": self.api_keys["GOOGLE_PLACES"]
                        }
                        
                        async with self.session.get(details_url, params=details_params) as detail_resp:
                            if detail_resp.status == 200:
                                details = await detail_resp.json()
                                return details.get("result", {})
            return {}
        except Exception as e:
            logger.error(f"Google Places API error: {e}")
            return {}
    
    async def get_yelp_data(self, business_name: str, location: str) -> Dict[str, Any]:
        """Get data from Yelp API"""
        try:
            if not self.api_keys["YELP"]:
                return {}
            
            headers = {"Authorization": f"Bearer {self.api_keys['YELP']}"}
            url = "https://api.yelp.com/v3/businesses/search"
            params = {
                "term": business_name,
                "location": location,
                "limit": 5
            }
            
            async with self.session.get(url, headers=headers, params=params) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    businesses = data.get("businesses", [])
                    
                    if businesses:
                        business = businesses[0]
                        return {
                            "rating": business.get("rating"),
                            "review_count": business.get("review_count"),
                            "categories": business.get("categories"),
                            "price": business.get("price"),
                            "is_closed": business.get("is_closed"),
                            "phone": business.get("phone"),
                            "url": business.get("url")
                        }
            return {}
        except Exception as e:
            logger.error(f"Yelp API error: {e}")
            return {}
    
    def aggregate_metrics(self, data_sources: Dict) -> Dict[str, Any]:
        """Aggregate metrics from all sources for unified view"""
        metrics = {
            "ratings": [],
            "review_counts": [],
            "revenue_estimates": [],
            "employee_counts": [],
            "years_in_business": None,
            "online_presence_score": 0,
            "data_completeness": 0
        }
        
        # Collect ratings from all sources
        if data_sources.get("serp", {}).get("rating"):
            metrics["ratings"].append(data_sources["serp"]["rating"])
        if data_sources.get("google", {}).get("rating"):
            metrics["ratings"].append(data_sources["google"]["rating"])
        if data_sources.get("yelp", {}).get("rating"):
            metrics["ratings"].append(data_sources["yelp"]["rating"])
        
        # Average rating
        if metrics["ratings"]:
            metrics["average_rating"] = sum(metrics["ratings"]) / len(metrics["ratings"])
        
        # Collect review counts
        if data_sources.get("serp", {}).get("total_reviews"):
            metrics["review_counts"].append(data_sources["serp"]["total_reviews"])
        if data_sources.get("google", {}).get("user_ratings_total"):
            metrics["review_counts"].append(data_sources["google"]["user_ratings_total"])
        if data_sources.get("yelp", {}).get("review_count"):
            metrics["review_counts"].append(data_sources["yelp"]["review_count"])
        
        # Total reviews
        metrics["total_reviews"] = sum(metrics["review_counts"])
        
        # Business metrics from DataAxle
        if data_sources.get("dataaxle"):
            dataaxle = data_sources["dataaxle"]
            if dataaxle.get("revenue"):
                metrics["revenue_estimates"].append(dataaxle["revenue"])
            if dataaxle.get("employees"):
                metrics["employee_counts"].append(dataaxle["employees"])
            if dataaxle.get("years_in_business"):
                current_year = datetime.now().year
                metrics["years_in_business"] = current_year - dataaxle["years_in_business"]
        
        # Calculate online presence score
        online_signals = 0
        if data_sources.get("dataaxle", {}).get("contact", {}).get("website"):
            online_signals += 2
        if metrics["total_reviews"] > 0:
            online_signals += min(3, metrics["total_reviews"] / 50)
        if metrics.get("average_rating", 0) > 4:
            online_signals += 2
        metrics["online_presence_score"] = min(10, online_signals)
        
        # Data completeness
        total_sources = len(data_sources)
        populated_sources = sum(1 for v in data_sources.values() if v)
        metrics["data_completeness"] = (populated_sources / max(1, total_sources)) * 100
        
        return metrics
    
    def calculate_valuation_inputs(self, metrics: Dict) -> Dict[str, Any]:
        """Calculate inputs for valuation models"""
        valuation = {
            "revenue_multiple_base": 2.5,  # Default
            "adjustments": {},
            "risk_factors": {},
            "growth_indicators": {}
        }
        
        # Revenue multiple adjustments
        if metrics.get("average_rating", 0) > 4.5:
            valuation["adjustments"]["high_rating"] = 0.3
        if metrics.get("years_in_business", 0) > 10:
            valuation["adjustments"]["established"] = 0.2
        if metrics.get("online_presence_score", 0) > 7:
            valuation["adjustments"]["strong_online"] = 0.15
        
        # Risk factors
        if metrics.get("total_reviews", 0) < 10:
            valuation["risk_factors"]["low_visibility"] = -0.2
        if metrics.get("data_completeness", 0) < 50:
            valuation["risk_factors"]["incomplete_data"] = -0.1
        
        # Growth indicators
        if metrics.get("average_rating", 0) > 4:
            valuation["growth_indicators"]["customer_satisfaction"] = "high"
        
        # Calculate final multiple
        base = valuation["revenue_multiple_base"]
        adjustments = sum(valuation["adjustments"].values())
        risks = sum(valuation["risk_factors"].values())
        valuation["estimated_multiple"] = max(1, base + adjustments + risks)
        
        # Estimated value (if revenue available)
        if metrics.get("revenue_estimates"):
            avg_revenue = sum(metrics["revenue_estimates"]) / len(metrics["revenue_estimates"])
            valuation["estimated_value"] = avg_revenue * valuation["estimated_multiple"]
        
        return valuation
    
    def analyze_fragmentation(self, data_sources: Dict, location: str, industry: str) -> Dict[str, Any]:
        """Analyze market fragmentation for Fragment Finder"""
        fragmentation = {
            "market_concentration": "unknown",
            "competitor_count": 0,
            "avg_business_size": "small",
            "consolidation_opportunity": "medium",
            "top_players": [],
            "market_gaps": []
        }
        
        # Analyze from SERP data
        if data_sources.get("serp", {}).get("maps"):
            competitors = data_sources["serp"]["maps"]
            fragmentation["competitor_count"] = len(competitors)
            
            # Determine concentration
            if len(competitors) > 20:
                fragmentation["market_concentration"] = "highly_fragmented"
                fragmentation["consolidation_opportunity"] = "high"
            elif len(competitors) > 10:
                fragmentation["market_concentration"] = "fragmented"
                fragmentation["consolidation_opportunity"] = "medium"
            else:
                fragmentation["market_concentration"] = "concentrated"
                fragmentation["consolidation_opportunity"] = "low"
            
            # Top players
            top_rated = sorted(competitors, 
                             key=lambda x: x.get("rating", 0) * x.get("reviews", 0), 
                             reverse=True)[:3]
            fragmentation["top_players"] = [
                {
                    "name": p.get("title"),
                    "rating": p.get("rating"),
                    "reviews": p.get("reviews")
                } for p in top_rated
            ]
        
        # Market gaps from census data
        if data_sources.get("census"):
            census = data_sources["census"]
            if census.get("population", 0) > 100000:
                fragmentation["market_gaps"].append("underserved_large_population")
            if census.get("median_income", 0) > 75000:
                fragmentation["market_gaps"].append("high_income_opportunity")
            if census.get("growth_rate", 0) > 3:
                fragmentation["market_gaps"].append("rapid_growth_area")
        
        return fragmentation
    
    def analyze_market_position(self, data_sources: Dict) -> Dict[str, Any]:
        """Analyze market position for strategic insights"""
        position = {
            "competitive_strength": "medium",
            "market_share_estimate": "unknown",
            "differentiation_factors": [],
            "improvement_areas": [],
            "acquisition_readiness": 50
        }
        
        # Competitive strength based on ratings
        avg_rating = 0
        rating_sources = 0
        
        if data_sources.get("serp", {}).get("rating"):
            avg_rating += data_sources["serp"]["rating"]
            rating_sources += 1
        if data_sources.get("google", {}).get("rating"):
            avg_rating += data_sources["google"]["rating"]
            rating_sources += 1
        if data_sources.get("yelp", {}).get("rating"):
            avg_rating += data_sources["yelp"]["rating"]
            rating_sources += 1
        
        if rating_sources > 0:
            avg_rating = avg_rating / rating_sources
            if avg_rating > 4.5:
                position["competitive_strength"] = "strong"
            elif avg_rating > 4:
                position["competitive_strength"] = "medium-strong"
            elif avg_rating > 3.5:
                position["competitive_strength"] = "medium"
            else:
                position["competitive_strength"] = "weak"
        
        # Differentiation factors
        if data_sources.get("dataaxle", {}).get("years_in_business"):
            years = datetime.now().year - data_sources["dataaxle"]["years_in_business"]
            if years > 20:
                position["differentiation_factors"].append("long_established")
        
        if data_sources.get("yelp", {}).get("price") == "$":
            position["differentiation_factors"].append("budget_friendly")
        elif data_sources.get("yelp", {}).get("price") == "$$$$":
            position["differentiation_factors"].append("premium_positioning")
        
        # Improvement areas
        total_reviews = 0
        if data_sources.get("serp", {}).get("total_reviews"):
            total_reviews += data_sources["serp"]["total_reviews"]
        
        if total_reviews < 50:
            position["improvement_areas"].append("increase_online_reviews")
        
        if not data_sources.get("dataaxle", {}).get("contact", {}).get("website"):
            position["improvement_areas"].append("needs_website")
        
        # Acquisition readiness score
        readiness_score = 50  # Base
        
        if position["competitive_strength"] in ["strong", "medium-strong"]:
            readiness_score += 20
        
        if data_sources.get("dataaxle", {}).get("revenue"):
            readiness_score += 15
        
        if len(position["improvement_areas"]) > 2:
            readiness_score -= 10
        
        position["acquisition_readiness"] = min(100, max(0, readiness_score))
        
        return position
    
    async def get_market_scanner_data(
        self,
        location: str,
        industry: str,
        filters: Optional[Dict] = None
    ) -> List[Dict[str, Any]]:
        """
        Get comprehensive data for Market Scanner with filtering
        """
        businesses = []
        
        # Get businesses from multiple sources
        # 1. SERP API for Google Maps businesses
        if self.api_keys["SERPAPI_PRIMARY"]:
            serp_businesses = await self.search_businesses_serp(location, industry)
            businesses.extend(serp_businesses)
        
        # 2. DataAxle for detailed business records
        if self.api_keys["DATAAXLE_PLACES"]:
            dataaxle_businesses = await self.search_businesses_dataaxle(location, industry)
            businesses.extend(dataaxle_businesses)
        
        # Apply filters
        if filters:
            businesses = self.apply_filters(businesses, filters)
        
        # Enrich with additional data
        enriched = []
        for business in businesses[:20]:  # Limit to top 20 for performance
            enriched_data = await self.get_comprehensive_business_data(
                business.get("name"),
                business.get("location", location),
                industry
            )
            enriched.append(enriched_data)
        
        return enriched
    
    async def search_businesses_serp(self, location: str, industry: str) -> List[Dict]:
        """Search businesses using SERP API"""
        try:
            api_key = self.get_serp_key()
            url = "https://serpapi.com/search.json"
            params = {
                "api_key": api_key,
                "engine": "google_maps",
                "q": industry,
                "location": location,
                "limit": 20
            }
            
            async with self.session.get(url, params=params) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    results = []
                    for business in data.get("local_results", []):
                        results.append({
                            "name": business.get("title"),
                            "address": business.get("address"),
                            "rating": business.get("rating"),
                            "reviews": business.get("reviews"),
                            "phone": business.get("phone"),
                            "website": business.get("website"),
                            "type": business.get("type"),
                            "source": "google_maps"
                        })
                    return results
            return []
        except Exception as e:
            logger.error(f"SERP search error: {e}")
            return []
    
    async def search_businesses_dataaxle(self, location: str, industry: str) -> List[Dict]:
        """Search businesses using DataAxle API"""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_keys['DATAAXLE_PLACES']}",
                "Content-Type": "application/json"
            }
            
            url = "https://api.dataaxle.com/v1/places/search"
            params = {
                "city": location.split(",")[0] if "," in location else location,
                "industry": industry,
                "limit": 20
            }
            
            async with self.session.get(url, headers=headers, params=params) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    results = []
                    for business in data.get("records", []):
                        results.append({
                            "name": business.get("name"),
                            "address": business.get("address"),
                            "revenue": business.get("revenue"),
                            "employees": business.get("employeeCount"),
                            "years_established": business.get("yearEstablished"),
                            "phone": business.get("phone"),
                            "website": business.get("website"),
                            "source": "dataaxle"
                        })
                    return results
            return []
        except Exception as e:
            logger.error(f"DataAxle search error: {e}")
            return []
    
    def apply_filters(self, businesses: List[Dict], filters: Dict) -> List[Dict]:
        """Apply filters to business list"""
        filtered = businesses
        
        # Revenue filter
        if filters.get("min_revenue"):
            filtered = [b for b in filtered if b.get("revenue", 0) >= filters["min_revenue"]]
        if filters.get("max_revenue"):
            filtered = [b for b in filtered if b.get("revenue", float('inf')) <= filters["max_revenue"]]
        
        # Employee filter
        if filters.get("min_employees"):
            filtered = [b for b in filtered if b.get("employees", 0) >= filters["min_employees"]]
        if filters.get("max_employees"):
            filtered = [b for b in filtered if b.get("employees", float('inf')) <= filters["max_employees"]]
        
        # Rating filter
        if filters.get("min_rating"):
            filtered = [b for b in filtered if b.get("rating", 0) >= filters["min_rating"]]
        
        # Years in business filter
        if filters.get("min_years"):
            current_year = datetime.now().year
            filtered = [b for b in filtered 
                       if b.get("years_established") and 
                       (current_year - b["years_established"]) >= filters["min_years"]]
        
        return filtered


# Singleton instance
comprehensive_service = ComprehensiveDataService()

async def get_all_data_for_business(business_name: str, location: str, industry: str = None):
    """Helper function to get all data for a business"""
    async with comprehensive_service as service:
        return await service.get_comprehensive_business_data(business_name, location, industry)

async def scan_market_with_all_sources(location: str, industry: str, filters: Dict = None):
    """Helper function for market scanning"""
    async with comprehensive_service as service:
        return await service.get_market_scanner_data(location, industry, filters)
keep the api keys in cuz i need them to work 
Lovable
9:14 AM on Aug 20

Thought for 14 seconds
I'll create a beautiful comprehensive data service dashboard that showcases your multi-API integration system. This will be a modern, professional interface for business intelligence and market analysis.

Show all
11 edits made
Created a stunning comprehensive data service dashboard! 🚀

Key Features Built:

Hero Section with gradient backgrounds and floating animations
Real-time API Status monitoring 12+ data sources (SERP, DataAxle, Google, Census, Yelp, OpenAI, etc.)
Business Lookup tool with multi-source data enrichment
Market Scanner for fragmentation analysis and acquisition opportunities
Interactive Dashboard with tabbed navigation and live metrics
The platform showcases your complete API integration system with beautiful gradients, professional business intelligence design, and responsive layouts. All your data sources are represented with real-time status indicators and performance metrics!


Restore

Code

Refactor: Improve ComprehensiveDataService
Preview

What's next?
Refine & Customize: Tweak the design, animations, and layouts via prompts or visual edits.
Master Prompting: Use "chat mode" to plan out your project without making edits. Use clear, detailed, and iterative prompts for best results.
Need to save information, add user accounts, or connect with other services? Supabase is a simple way to add these features without complex technical setup.

Supabase
Connect Supabase
Visit docs
Manage knowledge



i need to be able to look up the businesses specifically in certain states and cities
Lovable
9:16 AM on Aug 20

Thought for 15 seconds
I'll enhance the BusinessLookup component to add specific state and city filtering capabilities while keeping the exact same functionality.

Files to modify:

src/components/BusinessLookup.tsx - Add state/city selectors and enhanced location filtering
Show all
3 edits made
Perfect! I've enhanced the BusinessLookup component with precise state and city filtering while keeping the exact same functionality.

New Location Targeting Features:

State Selector: All 50 US states in dropdown
City Selector: Major cities for each state (dynamically populated)
Toggle System: Switch between structured state/city selection or manual entry
Smart Validation: Ensures proper location targeting before search
Visual Feedback: Shows current target location in real-time
Key Enhancements: ✅ Granular location filtering by state and city ✅ 20+ major cities listed for top states (CA, NY, TX, FL, etc.) ✅ Maintains all original functionality exactly ✅ Same search results, loading states, and data visualization ✅ Enhanced UX with toggle buttons and location preview

Now users can precisely target businesses in specific states like "California" or drill down to cities like "San Francisco, California" for more focused business intelligence lookups. The manual entry option remains available for maximum flexibility!


Restore

Code

Add state and city filtering
Preview Latest




i want it like this and use NACIS code and have it directed towads there please also make sure each api key i gave is workiing: we need up to 100 results for each industry 
Lovable
9:17 AM on Aug 20

Thought for 9 seconds
I'll enhance the BusinessLookup component to use NAICS codes, validate all your API keys, and return up to 100 results per industry while keeping the location targeting.

I'll enhance the BusinessLookup component to use NAICS codes, validate all your API keys, and return up to 100 results per industry while keeping the location targeting.
