"""
Intelligence API Router - Advanced market intelligence endpoints

This router provides access to the complete backend architecture pipeline
through the Integrated Intelligence Service.

Endpoints:
- /intelligence/scan - Complete market intelligence scan
- /intelligence/leads - Lead generation and scoring
- /intelligence/fragmentation - Market fragmentation analysis
- /intelligence/opportunities - Market opportunities identification
- /intelligence/status - Request status monitoring
"""

import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from dataclasses import is_dataclass, asdict
from datetime import date
from decimal import Decimal
import numpy as np
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from ..core.database import get_db
from ..services.integrated_intelligence_service import (
    IntegratedIntelligenceService, 
    IntelligenceRequest, 
    IntelligenceResponse
)


# Initialize router and service
router = APIRouter()
intelligence_service = IntegratedIntelligenceService()
logger = logging.getLogger(__name__)


# Request/Response Models
class MarketScanRequest(BaseModel):
    location: str = Field(..., description="Geographic location (city, state, ZIP)")
    industry: Optional[str] = Field(None, description="Industry filter")
    radius_miles: int = Field(25, description="Search radius in miles")
    max_businesses: int = Field(50, description="Maximum businesses to analyze")
    crawl_sources: Optional[List[str]] = Field(
        None, 
        description="Data sources to crawl",
        example=["google_maps", "yelp", "linkedin"]
    )
    enrichment_types: Optional[List[str]] = Field(
        None,
        description="Types of data enrichment to perform",
        example=["census", "irs", "sos", "nlp", "market_intelligence"]
    )
    analysis_types: Optional[List[str]] = Field(
        None,
        description="Types of analysis to perform",
        example=["succession_risk", "tam_opportunity", "market_fragmentation", "growth_potential"]
    )
    use_cache: bool = Field(True, description="Whether to use cached results")
    priority: int = Field(1, description="Request priority (1=high, 5=low)")


class LeadGenerationRequest(BaseModel):
    location: str = Field(..., description="Geographic location")
    industry: Optional[str] = Field(None, description="Industry filter")
    min_lead_score: float = Field(50.0, description="Minimum lead score threshold")
    max_leads: int = Field(25, description="Maximum number of leads to return")
    succession_risk_min: Optional[float] = Field(None, description="Minimum succession risk score")
    revenue_min: Optional[int] = Field(None, description="Minimum estimated revenue")


class FragmentationAnalysisRequest(BaseModel):
    location: str = Field(..., description="Geographic location")
    industry: str = Field(..., description="Industry to analyze")
    include_roll_up_analysis: bool = Field(True, description="Include roll-up opportunity analysis")


class OpportunityRequest(BaseModel):
    location: str = Field(..., description="Geographic location")
    industries: Optional[List[str]] = Field(None, description="Industries to analyze")
    opportunity_types: Optional[List[str]] = Field(
        None,
        description="Types of opportunities to identify",
        example=["succession_wave", "market_consolidation", "large_market"]
    )


# Main Intelligence Endpoints

@router.post("/scan")
async def comprehensive_market_scan(
    request: MarketScanRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Comprehensive market intelligence scan
    
    This endpoint runs the complete backend pipeline:
    1. Smart Crawler Hub - Data procurement from multiple sources
    2. Data Normalizer - Standardize and clean data
    3. Enrichment Engine - Augment with external intelligence
    4. Scoring + Vectorizer - Advanced analysis and scoring
    5. Intelligence compilation - Generate actionable insights
    """
    try:
        # Convert request to internal format
        intel_request = IntelligenceRequest(
            location=request.location,
            industry=request.industry,
            radius_miles=request.radius_miles,
            max_businesses=request.max_businesses,
            crawl_sources=request.crawl_sources,
            enrichment_types=request.enrichment_types,
            analysis_types=request.analysis_types,
            use_cache=request.use_cache,
            priority=request.priority
        )
        
        # Process intelligence request
        response = await intelligence_service.process_intelligence_request(intel_request)
        
        # Convert to API response format
        api_response = {
            "request_id": response.request_id,
            "status": "completed",
            "location": response.location,
            "industry": response.industry,
            "processing_time": response.processing_time,
            "timestamp": response.timestamp.isoformat(),
            
            # Business data
            "businesses": response.businesses,
            "business_count": response.business_count,
            
            # Market intelligence
            "market_intelligence": {
                "market_metrics": response.market_metrics,
                "market_clusters": response.market_clusters,
                "fragmentation_analysis": response.fragmentation_analysis,
                "tam_estimate": response.market_metrics.get('total_tam_estimate', 0),
                "hhi_index": response.fragmentation_analysis.get('hhi_index', 0),
                "fragmentation_level": response.fragmentation_analysis.get('fragmentation_level', 'unknown')
            },
            
            # Lead intelligence
            "lead_intelligence": {
                "top_leads": response.top_leads,
                "lead_distribution": response.lead_distribution,
                "total_qualified_leads": sum(response.lead_distribution.values())
            },
            
            # Recommendations
            "recommendations": {
                "acquisition_opportunities": response.acquisition_recommendations,
                "market_opportunities": response.market_opportunities
            },
            
            # Data quality and sources
            "data_quality": {
                "overall_score": response.data_quality_score,
                "sources_used": response.data_sources_used,
                "cache_hit_rate": response.cache_hit_rate
            },
            
            # Performance metrics
            "performance": response.pipeline_performance,
            
            # Errors (if any)
            "errors": response.errors or []
        }
        
        # Ensure JSON-safe types recursively
        def _json_safe(obj):
            try:
                if obj is None:
                    return None
                if isinstance(obj, (str, int, float, bool)):
                    return obj
                if isinstance(obj, (np.integer,)):
                    return int(obj)
                if isinstance(obj, (np.floating,)):
                    return float(obj)
                if isinstance(obj, (np.ndarray,)):
                    return obj.tolist()
                if isinstance(obj, (date, datetime)):
                    return obj.isoformat()
                if isinstance(obj, Decimal):
                    return float(obj)
                if is_dataclass(obj):
                    return _json_safe(asdict(obj))
                if isinstance(obj, dict):
                    return {str(k): _json_safe(v) for k, v in obj.items()}
                if isinstance(obj, (list, tuple, set)):
                    return [_json_safe(v) for v in obj]
            except Exception:
                pass
            # Fallback to string representation for unknown objects
            return str(obj)

        safe = _json_safe(api_response)
        return JSONResponse(content=jsonable_encoder(safe))
        
    except Exception as e:
        logger.error(f"Market scan failed: {e}")
        raise HTTPException(status_code=500, detail=f"Market scan failed: {str(e)}")


@router.post("/leads", response_model=Dict[str, Any])
async def generate_qualified_leads(
    request: LeadGenerationRequest,
    db: Session = Depends(get_db)
):
    """
    Generate qualified leads with advanced scoring
    
    This endpoint focuses specifically on lead generation and scoring,
    applying advanced filters and ranking algorithms to identify the
    most promising acquisition targets.
    """
    try:
        # Create intelligence request focused on lead generation
        intel_request = IntelligenceRequest(
            location=request.location,
            industry=request.industry,
            max_businesses=request.max_leads * 2,  # Get more to filter down
            analysis_types=["lead_score", "succession_risk", "acquisition_attractiveness"],
            priority=1
        )
        
        # Process request
        response = await intelligence_service.process_intelligence_request(intel_request)
        
        # Filter and rank leads
        qualified_leads = []
        for business in response.businesses:
            analysis = business.get('analysis', {})
            lead_score = analysis.get('lead_score', {}).get('overall_score', 0)
            succession_risk = analysis.get('succession_risk', {}).get('succession_risk_score', 0)
            revenue = business['metrics']['estimated_revenue'] or 0
            
            # Apply filters
            if lead_score < request.min_lead_score:
                continue
            if request.succession_risk_min and succession_risk < request.succession_risk_min:
                continue
            if request.revenue_min and revenue < request.revenue_min:
                continue
            
            # Create lead entry
            lead = {
                "business_id": business['business_id'],
                "business_name": business['name'],
                "industry": business['category'],
                "location": business['address']['formatted_address'],
                
                # Lead scoring
                "lead_score": lead_score,
                "lead_grade": analysis.get('lead_score', {}).get('lead_grade', 'D'),
                "priority": analysis.get('lead_score', {}).get('priority', 'low'),
                "close_probability": analysis.get('lead_score', {}).get('estimated_close_probability', 0),
                
                # Business metrics
                "estimated_revenue": revenue,
                "employee_count": business['metrics']['employee_count'],
                "years_in_business": business['metrics']['years_in_business'],
                "rating": business['metrics']['rating'],
                "review_count": business['metrics']['review_count'],
                
                # Acquisition factors
                "succession_risk_score": succession_risk,
                "acquisition_attractiveness": analysis.get('acquisition_attractiveness', {}).get('overall_score', 0),
                "growth_potential": analysis.get('growth_potential', {}).get('exit_readiness_score', 0),
                
                # Contact information
                "contact": business['contact'],
                
                # Recommendations
                "follow_up_recommendations": analysis.get('lead_score', {}).get('follow_up_recommendations', []),
                "key_strengths": analysis.get('acquisition_attractiveness', {}).get('key_strengths', []),
                "key_concerns": analysis.get('acquisition_attractiveness', {}).get('key_concerns', []),
                
                # Data quality
                "data_quality": business['data_quality'],
                "last_updated": business['last_updated']
            }
            
            qualified_leads.append(lead)
        
        # Sort by lead score and take top results
        qualified_leads.sort(key=lambda x: x['lead_score'], reverse=True)
        qualified_leads = qualified_leads[:request.max_leads]
        
        # Generate summary statistics
        lead_summary = {
            "total_leads": len(qualified_leads),
            "average_lead_score": sum(lead['lead_score'] for lead in qualified_leads) / len(qualified_leads) if qualified_leads else 0,
            "average_succession_risk": sum(lead['succession_risk_score'] for lead in qualified_leads) / len(qualified_leads) if qualified_leads else 0,
            "total_market_value": sum(lead['estimated_revenue'] for lead in qualified_leads),
            "grade_distribution": {},
            "priority_distribution": {}
        }
        
        # Calculate distributions
        for lead in qualified_leads:
            grade = lead['lead_grade']
            priority = lead['priority']
            
            lead_summary['grade_distribution'][grade] = lead_summary['grade_distribution'].get(grade, 0) + 1
            lead_summary['priority_distribution'][priority] = lead_summary['priority_distribution'].get(priority, 0) + 1
        
        return {
            "request_id": response.request_id,
            "location": request.location,
            "industry": request.industry or "all",
            "timestamp": datetime.now().isoformat(),
            "qualified_leads": qualified_leads,
            "lead_summary": lead_summary,
            "processing_time": response.processing_time
        }
        
    except Exception as e:
        logger.error(f"Lead generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Lead generation failed: {str(e)}")


@router.post("/fragmentation", response_model=Dict[str, Any])
async def analyze_market_fragmentation(
    request: FragmentationAnalysisRequest,
    db: Session = Depends(get_db)
):
    """
    Analyze market fragmentation and consolidation opportunities
    
    This endpoint performs deep market fragmentation analysis using
    the Herfindahl-Hirschman Index and other concentration metrics
    to identify roll-up and consolidation opportunities.
    """
    try:
        # Create intelligence request focused on fragmentation
        intel_request = IntelligenceRequest(
            location=request.location,
            industry=request.industry,
            max_businesses=100,  # Get more businesses for better fragmentation analysis
            analysis_types=["market_fragmentation", "acquisition_attractiveness"],
            priority=1
        )
        
        # Process request
        response = await intelligence_service.process_intelligence_request(intel_request)
        
        fragmentation_data = response.fragmentation_analysis
        businesses = response.businesses
        
        # Calculate additional fragmentation metrics
        revenues = [b['metrics']['estimated_revenue'] or 0 for b in businesses]
        total_revenue = sum(revenues)
        
        # Market concentration ratios
        sorted_revenues = sorted(revenues, reverse=True)
        cr4 = sum(sorted_revenues[:4]) / total_revenue * 100 if total_revenue > 0 else 0
        cr8 = sum(sorted_revenues[:8]) / total_revenue * 100 if total_revenue > 0 else 0
        
        # Roll-up analysis
        roll_up_analysis = {}
        if request.include_roll_up_analysis:
            # Identify potential roll-up targets
            roll_up_targets = []
            for business in businesses:
                analysis = business.get('analysis', {})
                succession_risk = analysis.get('succession_risk', {}).get('succession_risk_score', 0)
                acquisition_score = analysis.get('acquisition_attractiveness', {}).get('overall_score', 0)
                revenue = business['metrics']['estimated_revenue'] or 0
                
                if succession_risk > 60 and revenue > 500000:  # Good roll-up candidate
                    roll_up_targets.append({
                        "business_name": business['name'],
                        "estimated_revenue": revenue,
                        "succession_risk": succession_risk,
                        "acquisition_score": acquisition_score,
                        "employee_count": business['metrics']['employee_count'],
                        "market_share": business['metrics']['market_share_percent']
                    })
            
            # Sort by acquisition attractiveness
            roll_up_targets.sort(key=lambda x: x['acquisition_score'], reverse=True)
            
            # Calculate roll-up potential
            total_roll_up_revenue = sum(target['estimated_revenue'] for target in roll_up_targets)
            synergy_estimate = total_roll_up_revenue * 0.15  # Assume 15% synergies
            
            roll_up_analysis = {
                "potential_targets": roll_up_targets[:20],  # Top 20 targets
                "total_targets": len(roll_up_targets),
                "total_target_revenue": total_roll_up_revenue,
                "estimated_synergies": synergy_estimate,
                "roll_up_feasibility": "high" if len(roll_up_targets) >= 5 else "medium" if len(roll_up_targets) >= 3 else "low",
                "estimated_market_share_post_rollup": min(35, (total_roll_up_revenue / total_revenue * 100)) if total_revenue > 0 else 0
            }
        
        return {
            "request_id": response.request_id,
            "location": request.location,
            "industry": request.industry,
            "timestamp": datetime.now().isoformat(),
            
            # Core fragmentation metrics
            "fragmentation_metrics": {
                "hhi_index": fragmentation_data.get('hhi_index', 0),
                "fragmentation_level": fragmentation_data.get('fragmentation_level', 'unknown'),
                "concentration_ratio_4": cr4,
                "concentration_ratio_8": cr8,
                "number_of_competitors": len(businesses),
                "market_leader_share": max([b['metrics']['market_share_percent'] or 0 for b in businesses]) if businesses else 0,
                "total_market_revenue": total_revenue
            },
            
            # Consolidation opportunity
            "consolidation_opportunity": {
                "level": fragmentation_data.get('consolidation_opportunity', 'unknown'),
                "consolidation_potential": fragmentation_data.get('roll_up_potential', 0),
                "barriers_to_consolidation": self._identify_consolidation_barriers(businesses),
                "optimal_strategy": self._recommend_consolidation_strategy(fragmentation_data)
            },
            
            # Roll-up analysis
            "roll_up_analysis": roll_up_analysis,
            
            # Market clusters
            "market_clusters": response.market_clusters,
            
            "processing_time": response.processing_time
        }
        
    except Exception as e:
        logger.error(f"Fragmentation analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Fragmentation analysis failed: {str(e)}")


@router.post("/opportunities", response_model=Dict[str, Any])
async def identify_market_opportunities(
    request: OpportunityRequest,
    db: Session = Depends(get_db)
):
    """
    Identify market opportunities across multiple industries
    
    This endpoint identifies various types of market opportunities including
    succession waves, consolidation plays, and growth markets.
    """
    try:
        opportunities = []
        
        # Analyze each industry
        industries_to_analyze = request.industries or ["hvac", "plumbing", "electrical", "restaurant", "retail"]
        
        for industry in industries_to_analyze:
            # Create intelligence request for this industry
            intel_request = IntelligenceRequest(
                location=request.location,
                industry=industry,
                max_businesses=30,
                analysis_types=["succession_risk", "market_fragmentation", "tam_opportunity"],
                priority=2
            )
            
            # Process request
            response = await intelligence_service.process_intelligence_request(intel_request)
            
            # Analyze opportunities in this industry
            industry_opportunities = self._analyze_industry_opportunities(
                industry=industry,
                businesses=response.businesses,
                market_metrics=response.market_metrics,
                fragmentation=response.fragmentation_analysis,
                opportunity_types=request.opportunity_types
            )
            
            opportunities.extend(industry_opportunities)
        
        # Sort opportunities by potential impact
        opportunities.sort(key=lambda x: x.get('impact_score', 0), reverse=True)
        
        # Generate opportunity summary
        opportunity_summary = {
            "total_opportunities": len(opportunities),
            "high_impact_opportunities": len([o for o in opportunities if o.get('impact_score', 0) > 80]),
            "industries_analyzed": len(industries_to_analyze),
            "total_market_value": sum(o.get('market_value', 0) for o in opportunities),
            "opportunity_types": list(set(o['opportunity_type'] for o in opportunities))
        }
        
        return {
            "location": request.location,
            "timestamp": datetime.now().isoformat(),
            "opportunities": opportunities[:25],  # Top 25 opportunities
            "opportunity_summary": opportunity_summary,
            "recommendations": self._generate_opportunity_recommendations(opportunities)
        }
        
    except Exception as e:
        logger.error(f"Opportunity identification failed: {e}")
        raise HTTPException(status_code=500, detail=f"Opportunity identification failed: {str(e)}")


@router.get("/status/{request_id}")
async def get_request_status(request_id: str):
    """
    Get the status of a processing request
    
    This endpoint allows monitoring of long-running intelligence requests.
    """
    try:
        status = intelligence_service.get_request_status(request_id)
        return status
        
    except Exception as e:
        logger.error(f"Status check failed: {e}")
        raise HTTPException(status_code=500, detail=f"Status check failed: {str(e)}")


@router.get("/health")
async def get_pipeline_health():
    """
    Get health status of the intelligence pipeline
    
    This endpoint provides monitoring information about the backend
    architecture components and overall system health.
    """
    try:
        health = intelligence_service.get_pipeline_health()
        return health
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")


# Helper methods (these would be part of the class if this were a class-based router)

def _identify_consolidation_barriers(businesses: List[Dict[str, Any]]) -> List[str]:
    """Identify barriers to market consolidation"""
    barriers = []
    
    # Check for strong incumbents
    strong_players = [b for b in businesses if b['metrics']['estimated_revenue'] and b['metrics']['estimated_revenue'] > 5000000]
    if strong_players:
        barriers.append("Presence of large incumbent players")
    
    # Check for high customer loyalty (high ratings)
    high_rated = [b for b in businesses if b['metrics']['rating'] and b['metrics']['rating'] > 4.5]
    if len(high_rated) / len(businesses) > 0.3:
        barriers.append("High customer loyalty across market")
    
    # Check for regulatory barriers (industry-specific)
    regulated_industries = ["healthcare", "restaurant", "construction"]
    if any(b['category'] in regulated_industries for b in businesses):
        barriers.append("Regulatory licensing requirements")
    
    return barriers


def _recommend_consolidation_strategy(fragmentation_data: Dict[str, Any]) -> str:
    """Recommend consolidation strategy based on fragmentation analysis"""
    hhi = fragmentation_data.get('hhi_index', 0)
    fragmentation_level = fragmentation_data.get('fragmentation_level', 'unknown')
    
    if fragmentation_level == "highly_fragmented" and hhi < 1000:
        return "aggressive_roll_up"
    elif fragmentation_level == "moderately_fragmented":
        return "selective_acquisition"
    elif fragmentation_level == "concentrated":
        return "market_entry_challenge"
    else:
        return "market_analysis_required"


def _analyze_industry_opportunities(
    industry: str,
    businesses: List[Dict[str, Any]],
    market_metrics: Dict[str, Any],
    fragmentation: Dict[str, Any],
    opportunity_types: Optional[List[str]]
) -> List[Dict[str, Any]]:
    """Analyze opportunities in a specific industry"""
    opportunities = []
    
    # Succession wave opportunity
    if not opportunity_types or "succession_wave" in opportunity_types:
        avg_succession_risk = market_metrics.get('average_succession_risk', 0)
        if avg_succession_risk > 65:
            high_risk_businesses = [
                b for b in businesses 
                if b.get('analysis', {}).get('succession_risk', {}).get('succession_risk_score', 0) > 70
            ]
            
            if len(high_risk_businesses) >= 3:
                opportunities.append({
                    "opportunity_type": "succession_wave",
                    "industry": industry,
                    "description": f"High succession risk in {industry} - {len(high_risk_businesses)} businesses at risk",
                    "businesses_affected": len(high_risk_businesses),
                    "market_value": sum(b['metrics']['estimated_revenue'] or 0 for b in high_risk_businesses),
                    "impact_score": min(100, avg_succession_risk + len(high_risk_businesses) * 5),
                    "urgency": "high" if avg_succession_risk > 80 else "medium",
                    "estimated_timeline": "1-3 years"
                })
    
    # Market consolidation opportunity
    if not opportunity_types or "market_consolidation" in opportunity_types:
        fragmentation_level = fragmentation.get('fragmentation_level', 'unknown')
        if fragmentation_level == "highly_fragmented":
            total_revenue = sum(b['metrics']['estimated_revenue'] or 0 for b in businesses)
            
            opportunities.append({
                "opportunity_type": "market_consolidation",
                "industry": industry,
                "description": f"Highly fragmented {industry} market suitable for roll-up strategy",
                "businesses_available": len(businesses),
                "total_market_value": total_revenue,
                "hhi_index": fragmentation.get('hhi_index', 0),
                "impact_score": min(100, (len(businesses) * 2) + (total_revenue / 1000000)),
                "urgency": "medium",
                "estimated_timeline": "2-5 years"
            })
    
    # Large market opportunity
    if not opportunity_types or "large_market" in opportunity_types:
        total_tam = market_metrics.get('total_tam_estimate', 0)
        if total_tam > 50000000:  # $50M+ TAM
            opportunities.append({
                "opportunity_type": "large_market",
                "industry": industry,
                "description": f"Large {industry} market with significant TAM",
                "total_tam": total_tam,
                "businesses_in_market": len(businesses),
                "impact_score": min(100, total_tam / 1000000),
                "urgency": "low",
                "estimated_timeline": "3-7 years"
            })
    
    return opportunities


def _generate_opportunity_recommendations(opportunities: List[Dict[str, Any]]) -> List[str]:
    """Generate actionable recommendations from opportunities"""
    recommendations = []
    
    # Count opportunity types
    succession_opportunities = [o for o in opportunities if o['opportunity_type'] == 'succession_wave']
    consolidation_opportunities = [o for o in opportunities if o['opportunity_type'] == 'market_consolidation']
    
    if len(succession_opportunities) >= 2:
        recommendations.append("Focus on succession opportunities - multiple industries showing high owner transition risk")
    
    if len(consolidation_opportunities) >= 3:
        recommendations.append("Consider roll-up strategy across multiple fragmented industries")
    
    # High-impact opportunities
    high_impact = [o for o in opportunities if o.get('impact_score', 0) > 85]
    if high_impact:
        top_industry = high_impact[0]['industry']
        recommendations.append(f"Prioritize {top_industry} industry - highest impact opportunity identified")
    
    return recommendations


# Export router
__all__ = ['router']
