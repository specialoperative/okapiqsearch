from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

from ..core.database import get_db
from ..algorithms.market_analyzer import MarketAnalyzer
from ..services.market_intelligence_service import MarketIntelligenceService

router = APIRouter()
analyzer = MarketAnalyzer()
market_service = MarketIntelligenceService()

class MarketScanRequest(BaseModel):
    location: str  # ZIP code, city, or region
    industry: Optional[str] = None
    radius_miles: Optional[int] = 25

class MarketScanResponse(BaseModel):
    location: str
    industry: str
    tam_estimate: float
    sam_estimate: float
    som_estimate: float
    business_count: int
    hhi_score: float
    fragmentation_level: str
    avg_revenue_per_business: float
    market_saturation_percent: float
    ad_spend_to_dominate: float
    businesses: List[Dict[str, Any]]
    market_intelligence: Dict[str, Any]
    data_sources: List[str]
    berkeley_integration: Optional[Dict[str, Any]] = None
    scan_metadata: Dict[str, Any]

class AreaCalculatorRequest(BaseModel):
    zip_code: str
    industry: Optional[str] = None
    include_demographics: bool = True

class AreaCalculatorResponse(BaseModel):
    zip_code: str
    tam_estimate: float
    business_count: int
    avg_revenue_per_business: float
    hhi_score: float
    fragmentation_level: str
    market_saturation_percent: float
    demographics: Optional[Dict[str, Any]] = None

@router.post("/scan", response_model=MarketScanResponse)
async def scan_market(request: MarketScanRequest, db: Session = Depends(get_db)):
    """
    Comprehensive market scan combining real business data with market intelligence
    """
    try:
        # Use the integrated market intelligence service
        comprehensive_data = await market_service.get_comprehensive_market_data(
            location=request.location,
            industry=request.industry,
            radius_miles=request.radius_miles
        )
        
        # Extract market metrics
        market_metrics = comprehensive_data.get('market_metrics', {})
        
        return MarketScanResponse(
            location=comprehensive_data['location'],
            industry=comprehensive_data['industry'],
            tam_estimate=market_metrics.get('tam_estimate', 0),
            sam_estimate=market_metrics.get('sam_estimate', 0),
            som_estimate=market_metrics.get('som_estimate', 0),
            business_count=comprehensive_data['business_count'],
            hhi_score=comprehensive_data['hhi_score'],
            fragmentation_level=comprehensive_data['fragmentation_level'],
            avg_revenue_per_business=market_metrics.get('avg_revenue_per_business', 0),
            market_saturation_percent=market_metrics.get('market_saturation_percent', 0),
            ad_spend_to_dominate=market_metrics.get('ad_spend_to_dominate', 0),
            businesses=comprehensive_data['businesses'],
            market_intelligence=comprehensive_data['market_intelligence'],
            data_sources=comprehensive_data['data_sources'],
            berkeley_integration=comprehensive_data.get('berkeley_integration'),
            scan_metadata=comprehensive_data['scan_metadata']
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Market scan failed: {str(e)}")

@router.post("/area-calculator", response_model=AreaCalculatorResponse)
async def calculate_area_intelligence(request: AreaCalculatorRequest):
    """
    Calculate area-specific market intelligence
    """
    try:
        # Use the integrated service for area calculation
        comprehensive_data = await market_service.get_comprehensive_market_data(
            location=request.zip_code,
            industry=request.industry,
            radius_miles=25
        )
        
        market_metrics = comprehensive_data.get('market_metrics', {})
        market_intelligence = comprehensive_data.get('market_intelligence', {})
        
        demographics = None
        if request.include_demographics:
            demographics = market_intelligence.get('demographic_data', {})
        
        return AreaCalculatorResponse(
            zip_code=request.zip_code,
            tam_estimate=market_metrics.get('tam_estimate', 0),
            business_count=comprehensive_data['business_count'],
            avg_revenue_per_business=market_metrics.get('avg_revenue_per_business', 0),
            hhi_score=comprehensive_data['hhi_score'],
            fragmentation_level=comprehensive_data['fragmentation_level'],
            market_saturation_percent=market_metrics.get('market_saturation_percent', 0),
            demographics=demographics
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Area calculation failed: {str(e)}")

@router.get("/tam/{zip_code}")
async def get_tam_estimate(
    zip_code: str,
    industry: Optional[str] = Query(None, description="Industry category"),
    db: Session = Depends(get_db)
):
    """
    Get TAM estimate for a specific ZIP code and industry
    """
    try:
        comprehensive_data = await market_service.get_comprehensive_market_data(
            location=zip_code,
            industry=industry,
            radius_miles=25
        )
        
        market_metrics = comprehensive_data.get('market_metrics', {})
        market_intelligence = comprehensive_data.get('market_intelligence', {})
        
        return {
            "zip_code": zip_code,
            "industry": industry or "general",
            "tam_estimate": market_metrics.get('tam_estimate', 0),
            "sam_estimate": market_metrics.get('sam_estimate', 0),
            "som_estimate": market_metrics.get('som_estimate', 0),
            "market_intelligence": market_intelligence,
            "data_sources": comprehensive_data.get('data_sources', [])
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TAM calculation failed: {str(e)}")

@router.get("/fragmentation/{industry}")
async def analyze_fragmentation(
    industry: str,
    location: Optional[str] = Query(None, description="ZIP code or city"),
    db: Session = Depends(get_db)
):
    """
    Analyze market fragmentation for a specific industry
    """
    try:
        comprehensive_data = await market_service.get_comprehensive_market_data(
            location=location or "94102",
            industry=industry,
            radius_miles=25
        )
        
        return {
            "industry": industry,
            "location": location or "94102",
            "hhi_score": comprehensive_data['hhi_score'],
            "fragmentation_level": comprehensive_data['fragmentation_level'],
            "business_count": comprehensive_data['business_count'],
            "market_metrics": comprehensive_data.get('market_metrics', {}),
            "market_intelligence": comprehensive_data.get('market_intelligence', {})
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fragmentation analysis failed: {str(e)}")

@router.get("/succession-risk/{business_name}")
async def calculate_succession_risk(
    business_name: str,
    owner_age: Optional[int] = Query(None),
    years_in_business: Optional[int] = Query(None),
    yelp_rating: Optional[float] = Query(None),
    yelp_review_count: Optional[int] = Query(None)
):
    """
    Calculate succession risk score for a specific business
    """
    try:
        # Use provided data or mock data
        owner_age = owner_age or 62
        years_in_business = years_in_business or 25
        yelp_rating = yelp_rating or 4.2
        yelp_review_count = yelp_review_count or 89
        
        risk_score = analyzer.calculate_succession_risk(
            owner_age, years_in_business, yelp_rating, yelp_review_count
        )
        return {
            "business_name": business_name,
            "succession_risk_score": risk_score,
            "risk_level": _get_risk_level(risk_score),
            "factors": {
                "owner_age": owner_age,
                "years_in_business": years_in_business,
                "yelp_rating": yelp_rating,
                "yelp_review_count": yelp_review_count
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Succession risk calculation failed: {str(e)}")

@router.get("/data-sources")
async def get_data_sources():
    """
    Get information about data sources used by the Market Scanner
    """
    try:
        return market_service.get_data_source_info()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get data source info: {str(e)}")

# Helper functions
def _get_risk_level(risk_score: float) -> str:
    """Convert risk score to risk level"""
    if risk_score < 40:
        return "low"
    elif risk_score < 70:
        return "medium"
    else:
        return "high" 