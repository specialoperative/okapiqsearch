from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import sys
import os

# Add the algorithms directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'algorithms'))

from market_analyzer import MarketAnalyzer, BusinessProfile
from app.core.database import get_db
from sqlalchemy.orm import Session

router = APIRouter()
analyzer = MarketAnalyzer()

# Pydantic models
class MarketComparisonRequest(BaseModel):
    locations: List[str]  # List of ZIP codes or cities
    industry: str
    metrics: List[str] = ["tam", "hhi", "business_count", "avg_revenue"]

class TrendAnalysisRequest(BaseModel):
    location: str
    industry: str
    time_period: str = "12_months"  # 6_months, 12_months, 24_months

class RollUpOpportunityRequest(BaseModel):
    industry: str
    region: str  # State or multi-state region
    min_business_count: int = 10
    max_hhi: float = 0.25

@router.post("/market-comparison")
async def compare_markets(request: MarketComparisonRequest):
    """
    Compare multiple markets across key metrics
    """
    try:
        comparison_data = []
        
        for location in request.locations:
            # Mock business data for each location
            mock_businesses = _get_mock_businesses_by_location(location, request.industry)
            
            # Calculate metrics
            market_data = analyzer.calculate_tam_sam_som(
                location, request.industry, len(mock_businesses)
            )
            
            hhi_score, fragmentation_level = analyzer.calculate_hhi(mock_businesses)
            
            ad_spend = analyzer.calculate_ad_spend_to_dominate(
                location, request.industry, len(mock_businesses)
            )
            
            # Calculate average revenue
            avg_revenue = np.mean([b.estimated_revenue for b in mock_businesses]) if mock_businesses else 0
            
            comparison_data.append({
                "location": location,
                "tam_estimate": market_data["tam_estimate"],
                "sam_estimate": market_data["sam_estimate"],
                "som_estimate": market_data["som_estimate"],
                "business_count": len(mock_businesses),
                "hhi_score": hhi_score,
                "fragmentation_level": fragmentation_level,
                "avg_revenue_per_business": avg_revenue,
                "ad_spend_to_dominate": ad_spend,
                "roll_up_potential": _calculate_roll_up_potential(hhi_score, len(mock_businesses))
            })
        
        # Sort by TAM for ranking
        comparison_data.sort(key=lambda x: x["tam_estimate"], reverse=True)
        
        return {
            "industry": request.industry,
            "comparison_data": comparison_data,
            "summary": {
                "total_tam": sum(m["tam_estimate"] for m in comparison_data),
                "avg_hhi": np.mean([m["hhi_score"] for m in comparison_data]),
                "total_businesses": sum(m["business_count"] for m in comparison_data),
                "best_roll_up_opportunity": max(comparison_data, key=lambda x: x["roll_up_potential"])
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Market comparison failed: {str(e)}")

@router.post("/trend-analysis")
async def analyze_market_trends(request: TrendAnalysisRequest):
    """
    Analyze market trends over time
    """
    try:
        # Mock historical data (in production, would use real time-series data)
        historical_data = _generate_historical_data(request.location, request.industry, request.time_period)
        
        # Calculate trends
        trends = _calculate_trends(historical_data)
        
        # Generate forecasts
        forecasts = _generate_forecasts(historical_data)
        
        return {
            "location": request.location,
            "industry": request.industry,
            "time_period": request.time_period,
            "historical_data": historical_data,
            "trends": trends,
            "forecasts": forecasts,
            "insights": _generate_trend_insights(trends, forecasts)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Trend analysis failed: {str(e)}")

@router.post("/roll-up-opportunities")
async def find_roll_up_opportunities(request: RollUpOpportunityRequest):
    """
    Find roll-up opportunities in fragmented markets
    """
    try:
        # Mock market data for the region
        regional_markets = _get_regional_markets(request.region, request.industry)
        
        # Filter and score opportunities
        opportunities = []
        for market in regional_markets:
            if (market["business_count"] >= request.min_business_count and 
                market["hhi_score"] <= request.max_hhi):
                
                roll_up_score = _calculate_roll_up_score(market)
                
                opportunities.append({
                    **market,
                    "roll_up_score": roll_up_score,
                    "estimated_acquisition_cost": market["tam_estimate"] * 0.3,  # 30% of TAM
                    "synergy_potential": _calculate_synergy_potential(market),
                    "consolidation_timeline": _estimate_consolidation_timeline(market)
                })
        
        # Sort by roll-up score
        opportunities.sort(key=lambda x: x["roll_up_score"], reverse=True)
        
        return {
            "region": request.region,
            "industry": request.industry,
            "total_opportunities": len(opportunities),
            "opportunities": opportunities[:10],  # Top 10
            "summary": {
                "total_potential_value": sum(o["tam_estimate"] for o in opportunities),
                "avg_roll_up_score": np.mean([o["roll_up_score"] for o in opportunities]),
                "estimated_total_cost": sum(o["estimated_acquisition_cost"] for o in opportunities)
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Roll-up analysis failed: {str(e)}")

@router.get("/market-heatmap/{industry}")
async def generate_market_heatmap(
    industry: str,
    region: Optional[str] = Query(None, description="State or region"),
    metric: str = Query("tam", description="Metric to visualize: tam, hhi, business_count")
):
    """
    Generate market heatmap data for visualization
    """
    try:
        # Mock heatmap data (in production, would use real geographic data)
        heatmap_data = _generate_heatmap_data(industry, region, metric)
        
        return {
            "industry": industry,
            "region": region or "United States",
            "metric": metric,
            "heatmap_data": heatmap_data,
            "color_scale": _get_color_scale(metric),
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Heatmap generation failed: {str(e)}")

@router.get("/competitive-analysis/{location}")
async def analyze_competition(
    location: str,
    industry: Optional[str] = Query(None),
    radius_miles: int = Query(25, description="Analysis radius in miles")
):
    """
    Analyze competitive landscape in a specific location
    """
    try:
        # Mock competitive data
        competitors = _get_competitive_data(location, industry, radius_miles)
        
        # Calculate competitive metrics
        total_revenue = sum(c["estimated_revenue"] for c in competitors)
        market_shares = []
        
        for competitor in competitors:
            market_share = (competitor["estimated_revenue"] / total_revenue) * 100
            market_shares.append(market_share)
            competitor["market_share_percent"] = market_share
        
        # Calculate concentration metrics
        hhi = sum(share ** 2 for share in market_shares)
        
        return {
            "location": location,
            "industry": industry or "General",
            "radius_miles": radius_miles,
            "total_competitors": len(competitors),
            "total_market_revenue": total_revenue,
            "hhi_score": hhi,
            "concentration_level": _get_concentration_level(hhi),
            "competitors": sorted(competitors, key=lambda x: x["estimated_revenue"], reverse=True),
            "market_share_distribution": {
                "top_3_share": sum(market_shares[:3]),
                "top_5_share": sum(market_shares[:5]),
                "top_10_share": sum(market_shares[:10])
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Competitive analysis failed: {str(e)}")

# Helper functions
def _get_mock_businesses_by_location(location: str, industry: str) -> List[BusinessProfile]:
    """Generate mock business data for a specific location"""
    # Mock data generation based on location and industry
    base_count = 50
    location_multiplier = {
        "94102": 1.5,  # San Francisco
        "10001": 2.0,  # New York
        "90210": 1.8,  # Beverly Hills
        "33101": 1.2,  # Miami
        "60601": 1.6   # Chicago
    }
    
    multiplier = location_multiplier.get(location, 1.0)
    business_count = int(base_count * multiplier)
    
    businesses = []
    for i in range(business_count):
        businesses.append(BusinessProfile(
            f"Business {i+1} - {location}",
            np.random.uniform(500000, 2000000),
            np.random.randint(5, 25),
            np.random.randint(5, 30),
            np.random.uniform(3.5, 5.0),
            np.random.randint(20, 200),
            0, 0, 0, 0
        ))
    
    return businesses

def _calculate_roll_up_potential(hhi: float, business_count: int) -> float:
    """Calculate roll-up potential score (0-100)"""
    # Lower HHI and higher business count = higher potential
    hhi_factor = max(0, 1 - (hhi * 5))  # Normalize HHI
    count_factor = min(1, business_count / 50)  # Normalize count
    
    return (hhi_factor * 0.7 + count_factor * 0.3) * 100

def _generate_historical_data(location: str, industry: str, time_period: str) -> List[Dict]:
    """Generate mock historical market data"""
    months = {
        "6_months": 6,
        "12_months": 12,
        "24_months": 24
    }
    
    num_months = months.get(time_period, 12)
    data = []
    
    base_tam = 5000000
    base_business_count = 50
    
    for i in range(num_months):
        # Add some trend and seasonality
        trend_factor = 1 + (i * 0.02)  # 2% monthly growth
        seasonality = 1 + 0.1 * np.sin(i * np.pi / 6)  # Seasonal variation
        
        data.append({
            "date": (datetime.now() - timedelta(days=30 * (num_months - i))).strftime("%Y-%m"),
            "tam": base_tam * trend_factor * seasonality,
            "business_count": int(base_business_count * trend_factor),
            "avg_revenue": base_tam / base_business_count * trend_factor,
            "hhi": 0.15 + 0.05 * np.sin(i * np.pi / 4)  # Varying fragmentation
        })
    
    return data

def _calculate_trends(historical_data: List[Dict]) -> Dict:
    """Calculate trends from historical data"""
    if len(historical_data) < 2:
        return {}
    
    # Calculate growth rates
    first_tam = historical_data[0]["tam"]
    last_tam = historical_data[-1]["tam"]
    tam_growth = ((last_tam - first_tam) / first_tam) * 100
    
    first_count = historical_data[0]["business_count"]
    last_count = historical_data[-1]["business_count"]
    count_growth = ((last_count - first_count) / first_count) * 100
    
    return {
        "tam_growth_rate": tam_growth,
        "business_count_growth_rate": count_growth,
        "trend_direction": "increasing" if tam_growth > 0 else "decreasing",
        "market_maturity": "growing" if tam_growth > 5 else "mature"
    }

def _generate_forecasts(historical_data: List[Dict]) -> Dict:
    """Generate market forecasts"""
    if len(historical_data) < 3:
        return {}
    
    # Simple linear projection
    recent_tam = historical_data[-3:]
    tam_trend = np.polyfit(range(3), [d["tam"] for d in recent_tam], 1)
    
    # Project 6 months ahead
    forecast_months = 6
    forecast_tam = []
    
    for i in range(forecast_months):
        projected_tam = tam_trend[0] * (3 + i) + tam_trend[1]
        forecast_tam.append(projected_tam)
    
    return {
        "forecast_period": "6_months",
        "projected_tam": forecast_tam,
        "growth_rate": tam_trend[0] * 12 / historical_data[-1]["tam"] * 100,  # Annual growth
        "confidence_level": "medium"
    }

def _generate_trend_insights(trends: Dict, forecasts: Dict) -> List[str]:
    """Generate insights from trends and forecasts"""
    insights = []
    
    if trends.get("tam_growth_rate", 0) > 10:
        insights.append("Strong market growth indicates expansion opportunities")
    elif trends.get("tam_growth_rate", 0) < -5:
        insights.append("Market decline suggests consolidation opportunities")
    
    if forecasts.get("growth_rate", 0) > 5:
        insights.append("Positive growth forecast supports investment thesis")
    
    if trends.get("market_maturity") == "growing":
        insights.append("Growing market suitable for organic expansion")
    else:
        insights.append("Mature market ideal for roll-up strategies")
    
    return insights

def _get_regional_markets(region: str, industry: str) -> List[Dict]:
    """Get mock regional market data"""
    # Mock data for different regions
    regions = {
        "CA": ["94102", "90210", "92614", "92101", "95113"],
        "NY": ["10001", "10016", "10022", "10036", "10038"],
        "TX": ["75001", "77001", "78201", "78701", "79901"],
        "FL": ["33101", "33109", "33125", "33133", "33139"]
    }
    
    markets = []
    for zip_code in regions.get(region, ["94102", "10001", "75001"]):
        mock_businesses = _get_mock_businesses_by_location(zip_code, industry)
        market_data = analyzer.calculate_tam_sam_som(zip_code, industry, len(mock_businesses))
        hhi_score, fragmentation_level = analyzer.calculate_hhi(mock_businesses)
        
        markets.append({
            "location": zip_code,
            "tam_estimate": market_data["tam_estimate"],
            "business_count": len(mock_businesses),
            "hhi_score": hhi_score,
            "fragmentation_level": fragmentation_level,
            "avg_revenue_per_business": market_data["avg_revenue_per_business"]
        })
    
    return markets

def _calculate_roll_up_score(market: Dict) -> float:
    """Calculate roll-up opportunity score"""
    # Factors: low HHI, high business count, good revenue potential
    hhi_score = max(0, 1 - (market["hhi_score"] * 5))
    count_score = min(1, market["business_count"] / 30)
    revenue_score = min(1, market["tam_estimate"] / 10000000)
    
    return (hhi_score * 0.5 + count_score * 0.3 + revenue_score * 0.2) * 100

def _calculate_synergy_potential(market: Dict) -> float:
    """Calculate synergy potential score"""
    # Based on fragmentation and market size
    return min(100, market["business_count"] * 2 + (1 - market["hhi_score"]) * 50)

def _estimate_consolidation_timeline(market: Dict) -> str:
    """Estimate consolidation timeline"""
    if market["hhi_score"] < 0.1:
        return "6-12 months"
    elif market["hhi_score"] < 0.2:
        return "12-18 months"
    else:
        return "18-24 months"

def _generate_heatmap_data(industry: str, region: str, metric: str) -> List[Dict]:
    """Generate heatmap data for visualization"""
    # Mock heatmap data
    locations = ["94102", "10001", "90210", "33101", "60601", "75001", "77001", "78201"]
    
    heatmap_data = []
    for location in locations:
        mock_businesses = _get_mock_businesses_by_location(location, industry)
        market_data = analyzer.calculate_tam_sam_som(location, industry, len(mock_businesses))
        hhi_score, _ = analyzer.calculate_hhi(mock_businesses)
        
        value = 0
        if metric == "tam":
            value = market_data["tam_estimate"]
        elif metric == "hhi":
            value = hhi_score
        elif metric == "business_count":
            value = len(mock_businesses)
        
        heatmap_data.append({
            "location": location,
            "value": value,
            "label": f"{location}: {value:,.0f}" if metric != "hhi" else f"{location}: {value:.3f}"
        })
    
    return heatmap_data

def _get_color_scale(metric: str) -> Dict:
    """Get color scale for heatmap visualization"""
    if metric == "tam":
        return {"low": "#ffeda0", "medium": "#feb24c", "high": "#f03b20"}
    elif metric == "hhi":
        return {"low": "#31a354", "medium": "#feb24c", "high": "#f03b20"}
    else:
        return {"low": "#deebf7", "medium": "#9ecae1", "high": "#3182bd"}

def _get_competitive_data(location: str, industry: str, radius_miles: int) -> List[Dict]:
    """Get competitive landscape data"""
    # Mock competitive data
    competitors = []
    for i in range(15):
        competitors.append({
            "name": f"Competitor {i+1}",
            "estimated_revenue": np.random.uniform(500000, 3000000),
            "employee_count": np.random.randint(5, 30),
            "years_in_business": np.random.randint(5, 25),
            "yelp_rating": np.random.uniform(3.0, 5.0),
            "yelp_review_count": np.random.randint(10, 200),
            "distance_miles": np.random.uniform(0, radius_miles)
        })
    
    return competitors

def _get_concentration_level(hhi: float) -> str:
    """Get market concentration level based on HHI"""
    if hhi < 0.15:
        return "Unconcentrated"
    elif hhi < 0.25:
        return "Moderately Concentrated"
    else:
        return "Highly Concentrated" 