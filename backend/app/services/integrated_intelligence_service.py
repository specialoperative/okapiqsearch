"""
Integrated Intelligence Service - Complete pipeline orchestration

This service orchestrates the entire backend architecture pipeline:
[Smart Crawler Hub] → [Data Normalizer] → [Enrichment Engine] → [Scoring + Vectorizer] → [Lead DB + API Layer]

Features:
- Complete end-to-end business intelligence pipeline
- Orchestrates all backend components
- Provides unified API for frontend consumption
- Handles caching, error recovery, and performance optimization
"""

import asyncio
import json
import time
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import logging
from dataclasses import dataclass, asdict

# Internal imports - the complete architecture stack
from ..crawlers.smart_crawler_hub import SmartCrawlerHub, CrawlerType
from ..processors.data_normalizer import DataNormalizer, NormalizedBusiness
from ..enrichment.enrichment_engine import EnrichmentEngine
from ..analytics.scoring_vectorizer import ScoringVectorizer, ScoreType
from ..core.config import settings


@dataclass
class IntelligenceRequest:
    """Request for business intelligence analysis"""
    location: str
    industry: Optional[str] = None
    radius_miles: int = 25
    max_businesses: int = 50
    crawl_sources: List[str] = None
    enrichment_types: List[str] = None
    analysis_types: List[str] = None
    use_cache: bool = True
    priority: int = 1  # 1=high, 5=low


@dataclass
class IntelligenceResponse:
    """Complete business intelligence response"""
    # Request metadata
    request_id: str
    location: str
    industry: str
    processing_time: float
    timestamp: datetime
    
    # Business data
    businesses: List[Dict[str, Any]]
    business_count: int
    
    # Market intelligence
    market_metrics: Dict[str, Any]
    market_clusters: List[Dict[str, Any]]
    fragmentation_analysis: Dict[str, Any]
    
    # Lead scoring
    top_leads: List[Dict[str, Any]]
    lead_distribution: Dict[str, int]
    
    # Data quality and sources
    data_sources_used: List[str]
    data_quality_score: float
    cache_hit_rate: float
    
    # Recommendations
    acquisition_recommendations: List[Dict[str, Any]]
    market_opportunities: List[Dict[str, Any]]
    
    # Metadata
    pipeline_performance: Dict[str, float]
    errors: List[str] = None


class IntegratedIntelligenceService:
    """
    Master orchestration service that runs the complete backend pipeline
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        
        # Initialize all pipeline components
        self.crawler_hub = SmartCrawlerHub()
        self.data_normalizer = DataNormalizer()
        self.enrichment_engine = EnrichmentEngine()
        self.scoring_engine = ScoringVectorizer()
        
        # Performance tracking
        self.pipeline_metrics = {}
        self.cache = {}
        self.cache_ttl = timedelta(hours=6)  # 6-hour cache
        
        # Request tracking
        self.active_requests = {}
        
    async def process_intelligence_request(
        self, 
        request: IntelligenceRequest
    ) -> IntelligenceResponse:
        """
        Main entry point for complete business intelligence processing
        
        This orchestrates the entire pipeline:
        1. Smart Crawler Hub - Data procurement
        2. Data Normalizer - Data standardization  
        3. Enrichment Engine - Data augmentation
        4. Scoring + Vectorizer - Analysis and scoring
        5. Response compilation - Final intelligence package
        """
        
        start_time = time.time()
        request_id = f"req_{int(time.time())}_{hash(request.location)}"
        
        self.logger.info(f"Starting intelligence request {request_id} for {request.location}")
        
        try:
            # Track this request
            self.active_requests[request_id] = {
                'start_time': start_time,
                'location': request.location,
                'status': 'processing'
            }
            
            # Check cache first
            cache_key = self._generate_cache_key(request)
            if request.use_cache and cache_key in self.cache:
                cached_response = self.cache[cache_key]
                if datetime.now() - cached_response['timestamp'] < self.cache_ttl:
                    self.logger.info(f"Cache hit for request {request_id}")
                    cached_response['request_id'] = request_id
                    cached_response['cache_hit_rate'] = 1.0
                    return IntelligenceResponse(**cached_response)
            
            # Initialize pipeline performance tracking
            pipeline_performance = {}
            errors = []
            
            # STEP 1: Smart Crawler Hub - Data Procurement
            crawl_start = time.time()
            self.logger.info(f"Step 1: Running Smart Crawler Hub for {request.location}")
            
            crawl_sources = request.crawl_sources or ['google_maps', 'google_serp', 'yelp']
            crawler_types = [CrawlerType(source) for source in crawl_sources if source in [e.value for e in CrawlerType]]
            
            crawl_results = await self.crawler_hub.crawl_business_data(
                location=request.location,
                industry=request.industry,
                sources=crawler_types
            )
            
            pipeline_performance['crawling'] = time.time() - crawl_start
            
            # Check if crawling was successful
            if not any(result.success for result in crawl_results.values()):
                raise Exception("All crawling sources failed")
            
            # STEP 2: Data Normalizer - Data Standardization
            normalize_start = time.time()
            self.logger.info(f"Step 2: Running Data Normalizer")
            
            normalized_businesses = self.data_normalizer.normalize_crawl_results(
                crawl_results,
                merge_duplicates=True
            )
            
            pipeline_performance['normalization'] = time.time() - normalize_start
            
            # Limit businesses to max requested
            if len(normalized_businesses) > request.max_businesses:
                # Sort by data quality and take top businesses
                normalized_businesses.sort(
                    key=lambda b: (b.overall_quality.value, b.metrics.lead_score or 0),
                    reverse=True
                )
                normalized_businesses = normalized_businesses[:request.max_businesses]
            
            # STEP 3: Enrichment Engine - Data Augmentation
            enrich_start = time.time()
            self.logger.info(f"Step 3: Running Enrichment Engine")
            
            enrichment_types = request.enrichment_types or ['census', 'irs', 'sos', 'nlp', 'market_intelligence', 'web_ai']
            enriched_businesses = await self.enrichment_engine.enrich_businesses(
                normalized_businesses,
                enrichment_types=enrichment_types
            )
            
            pipeline_performance['enrichment'] = time.time() - enrich_start
            
            # STEP 4: Scoring + Vectorizer - Analysis and Scoring
            scoring_start = time.time()
            self.logger.info(f"Step 4: Running Scoring + Vectorizer")
            
            analysis_types = request.analysis_types or [
                'succession_risk', 'tam_opportunity', 'market_fragmentation', 
                'growth_potential', 'acquisition_attractiveness', 'lead_score'
            ]
            score_types = [ScoreType(analysis) for analysis in analysis_types if analysis in [e.value for e in ScoreType]]
            
            scoring_results = self.scoring_engine.analyze_businesses(
                enriched_businesses,
                analysis_types=score_types
            )
            
            pipeline_performance['scoring'] = time.time() - scoring_start
            
            # STEP 5: Response Compilation - Final Intelligence Package
            compile_start = time.time()
            self.logger.info(f"Step 5: Compiling Intelligence Response")
            
            response = await self._compile_intelligence_response(
                request_id=request_id,
                request=request,
                enriched_businesses=enriched_businesses,
                scoring_results=scoring_results,
                crawl_results=crawl_results,
                pipeline_performance=pipeline_performance,
                start_time=start_time
            )
            
            pipeline_performance['compilation'] = time.time() - compile_start
            pipeline_performance['total'] = time.time() - start_time
            
            response.pipeline_performance = pipeline_performance
            
            # Cache the response
            if request.use_cache:
                cache_data = asdict(response)
                cache_data['timestamp'] = datetime.now()
                self.cache[cache_key] = cache_data
            
            # Clean up request tracking
            self.active_requests[request_id]['status'] = 'completed'
            
            self.logger.info(
                f"Intelligence request {request_id} completed in {pipeline_performance['total']:.2f}s"
            )
            
            return response
            
        except Exception as e:
            self.logger.error(f"Intelligence request {request_id} failed: {e}")
            
            # Create error response
            error_response = IntelligenceResponse(
                request_id=request_id,
                location=request.location,
                industry=request.industry or "unknown",
                processing_time=time.time() - start_time,
                timestamp=datetime.now(),
                businesses=[],
                business_count=0,
                market_metrics={},
                market_clusters=[],
                fragmentation_analysis={},
                top_leads=[],
                lead_distribution={},
                data_sources_used=[],
                data_quality_score=0.0,
                cache_hit_rate=0.0,
                acquisition_recommendations=[],
                market_opportunities=[],
                pipeline_performance={},
                errors=[str(e)]
            )
            
            # Clean up request tracking
            if request_id in self.active_requests:
                self.active_requests[request_id]['status'] = 'failed'
            
            return error_response
    
    async def _compile_intelligence_response(
        self,
        request_id: str,
        request: IntelligenceRequest,
        enriched_businesses: List[NormalizedBusiness],
        scoring_results: Dict[str, Dict[str, Any]],
        crawl_results: Dict[str, Any],
        pipeline_performance: Dict[str, float],
        start_time: float
    ) -> IntelligenceResponse:
        """Compile the final intelligence response"""
        
        # Convert businesses to response format
        businesses_data = []
        for business in enriched_businesses:
            business_scores = scoring_results.get(business.business_id, {})
            
            business_data = {
                'business_id': business.business_id,
                'name': business.name,
                'category': business.category.value,
                'industry': business.industry,
                'address': {
                    'formatted_address': business.address.formatted_address,
                    'city': business.address.city,
                    'state': business.address.state,
                    'zip_code': business.address.zip_code,
                    'coordinates': [
                        business.address.coordinates.latitude,
                        business.address.coordinates.longitude
                    ] if business.address.coordinates else None
                },
                'contact': {
                    'phone': business.contact.phone,
                    'email': business.contact.email,
                    'website': business.contact.website,
                    'phone_valid': business.contact.phone_valid,
                    'email_valid': business.contact.email_valid,
                    'website_valid': business.contact.website_valid
                },
                'metrics': {
                    'rating': business.metrics.rating,
                    'review_count': business.metrics.review_count,
                    'estimated_revenue': business.metrics.estimated_revenue,
                    'employee_count': business.metrics.employee_count,
                    'years_in_business': business.metrics.years_in_business,
                    'market_share_percent': business.metrics.market_share_percent,
                    'succession_risk_score': business.metrics.succession_risk_score,
                    'owner_age_estimate': business.metrics.owner_age_estimate,
                    'lead_score': business.metrics.lead_score,
                    'digital_presence_score': business.metrics.digital_presence_score
                },
                'owner': {
                    'name': business.owner.name if business.owner else None,
                    'age_estimate': business.owner.age_estimate if business.owner else None,
                    'detection_source': business.owner.detection_source if business.owner else None,
                    'confidence_score': business.owner.confidence_score if business.owner else None
                } if business.owner else None,
                'data_quality': business.overall_quality.value,
                'data_sources': [source.source.value for source in business.data_sources],
                'last_updated': business.last_updated.isoformat(),
                'tags': list(business.tags),
                
                # Add scoring results
                'analysis': business_scores
            }
            
            businesses_data.append(business_data)
        
        # Calculate market metrics
        market_metrics = self._calculate_market_metrics(enriched_businesses, scoring_results)
        
        # Extract market clusters
        market_clusters = []
        if '_market_clusters' in scoring_results:
            market_clusters = [asdict(cluster) for cluster in scoring_results['_market_clusters']]
        
        # Calculate fragmentation analysis
        fragmentation_analysis = self._calculate_overall_fragmentation(enriched_businesses, scoring_results)
        
        # Generate top leads
        top_leads = self._generate_top_leads(businesses_data)
        
        # Calculate lead distribution
        lead_distribution = self._calculate_lead_distribution(businesses_data)
        
        # Calculate data quality score
        data_quality_score = self._calculate_overall_data_quality(enriched_businesses)
        
        # Get data sources used
        data_sources_used = list(set(
            source for result in crawl_results.values() 
            for source in [result.source] if result.success
        ))
        
        # Generate recommendations
        acquisition_recommendations = self._generate_acquisition_recommendations(businesses_data)
        market_opportunities = self._generate_market_opportunities(market_metrics, fragmentation_analysis)
        
        return IntelligenceResponse(
            request_id=request_id,
            location=request.location,
            industry=request.industry or "general",
            processing_time=time.time() - start_time,
            timestamp=datetime.now(),
            businesses=businesses_data,
            business_count=len(businesses_data),
            market_metrics=market_metrics,
            market_clusters=market_clusters,
            fragmentation_analysis=fragmentation_analysis,
            top_leads=top_leads,
            lead_distribution=lead_distribution,
            data_sources_used=data_sources_used,
            data_quality_score=data_quality_score,
            cache_hit_rate=0.0,  # Will be updated if cache is used
            acquisition_recommendations=acquisition_recommendations,
            market_opportunities=market_opportunities,
            pipeline_performance={}  # Will be filled by caller
        )
    
    def _calculate_market_metrics(
        self, 
        businesses: List[NormalizedBusiness],
        scoring_results: Dict[str, Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Calculate overall market metrics"""
        
        if not businesses:
            return {}
        
        # Revenue analysis
        revenues = [b.metrics.estimated_revenue or 0 for b in businesses]
        total_revenue = sum(revenues)
        avg_revenue = total_revenue / len(businesses)
        
        # Rating analysis
        ratings = [b.metrics.rating or 0 for b in businesses if b.metrics.rating]
        avg_rating = sum(ratings) / len(ratings) if ratings else 0
        
        # Age analysis
        ages = [b.metrics.years_in_business or 0 for b in businesses if b.metrics.years_in_business]
        avg_age = sum(ages) / len(ages) if ages else 0
        
        # Succession risk analysis
        succession_risks = [
            b.metrics.succession_risk_score or 50 
            for b in businesses if b.metrics.succession_risk_score
        ]
        avg_succession_risk = sum(succession_risks) / len(succession_risks) if succession_risks else 50
        
        # TAM/SAM analysis from scoring results
        tam_estimates = []
        for business_id, scores in scoring_results.items():
            if 'tam_analysis' in scores:
                tam_estimates.append(scores['tam_analysis'].tam_estimate)
        
        total_tam = sum(tam_estimates) if tam_estimates else 0
        
        return {
            'total_businesses': len(businesses),
            'total_market_revenue': total_revenue,
            'average_revenue_per_business': avg_revenue,
            'average_rating': avg_rating,
            'average_business_age': avg_age,
            'average_succession_risk': avg_succession_risk,
            'total_tam_estimate': total_tam,
            'market_concentration': self._calculate_market_concentration(revenues),
            'digital_maturity': self._calculate_digital_maturity(businesses),
            'acquisition_readiness': self._calculate_acquisition_readiness(businesses)
        }
    
    def _calculate_overall_fragmentation(
        self, 
        businesses: List[NormalizedBusiness],
        scoring_results: Dict[str, Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Calculate overall market fragmentation"""
        
        # Get fragmentation analysis from first business that has it
        for business_id, scores in scoring_results.items():
            if 'fragmentation' in scores:
                return asdict(scores['fragmentation'])
        
        # Fallback calculation
        revenues = [b.metrics.estimated_revenue or 0 for b in businesses]
        total_revenue = sum(revenues)
        
        if total_revenue == 0:
            return {}
        
        # Calculate HHI
        market_shares = [(rev / total_revenue) ** 2 for rev in revenues]
        hhi = sum(market_shares) * 10000  # Scale to standard HHI
        
        if hhi < 1500:
            fragmentation_level = "highly_fragmented"
        elif hhi < 2500:
            fragmentation_level = "moderately_fragmented"
        else:
            fragmentation_level = "concentrated"
        
        return {
            'hhi_index': hhi,
            'fragmentation_level': fragmentation_level,
            'number_of_competitors': len(businesses),
            'consolidation_opportunity': "high" if hhi < 1500 else "medium" if hhi < 2500 else "low"
        }
    
    def _generate_top_leads(self, businesses_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate top leads based on scoring"""
        
        # Sort by lead score
        sorted_businesses = sorted(
            businesses_data,
            key=lambda b: b.get('analysis', {}).get('lead_score', {}).get('overall_score', 0),
            reverse=True
        )
        
        # Take top 10 leads
        top_leads = []
        for business in sorted_businesses[:10]:
            lead_data = {
                'business_id': business['business_id'],
                'name': business['name'],
                'lead_score': business.get('analysis', {}).get('lead_score', {}).get('overall_score', 0),
                'lead_grade': business.get('analysis', {}).get('lead_score', {}).get('lead_grade', 'D'),
                'succession_risk': business.get('analysis', {}).get('succession_risk', {}).get('succession_risk_score', 0),
                'estimated_revenue': business['metrics']['estimated_revenue'],
                'contact': business['contact'],
                'priority': business.get('analysis', {}).get('lead_score', {}).get('priority', 'low'),
                'acquisition_attractiveness': business.get('analysis', {}).get('acquisition_attractiveness', {}).get('overall_score', 0)
            }
            top_leads.append(lead_data)
        
        return top_leads
    
    def _calculate_lead_distribution(self, businesses_data: List[Dict[str, Any]]) -> Dict[str, int]:
        """Calculate distribution of lead grades"""
        
        distribution = {'A': 0, 'B': 0, 'C': 0, 'D': 0}
        
        for business in businesses_data:
            grade = business.get('analysis', {}).get('lead_score', {}).get('lead_grade', 'D')
            if grade in distribution:
                distribution[grade] += 1
        
        return distribution
    
    def _calculate_overall_data_quality(self, businesses: List[NormalizedBusiness]) -> float:
        """Calculate overall data quality score"""
        
        if not businesses:
            return 0.0
        
        quality_scores = []
        quality_mapping = {'high': 1.0, 'medium': 0.7, 'low': 0.4, 'poor': 0.2}
        
        for business in businesses:
            score = quality_mapping.get(business.overall_quality.value, 0.2)
            quality_scores.append(score)
        
        return sum(quality_scores) / len(quality_scores)
    
    def _generate_acquisition_recommendations(self, businesses_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate acquisition recommendations"""
        
        recommendations = []
        
        # Find high-value, high-risk businesses
        for business in businesses_data:
            analysis = business.get('analysis', {})
            
            acquisition_score = analysis.get('acquisition_attractiveness', {}).get('overall_score', 0)
            succession_risk = analysis.get('succession_risk', {}).get('succession_risk_score', 0)
            revenue = business['metrics']['estimated_revenue'] or 0
            
            if acquisition_score > 70 and succession_risk > 60 and revenue > 1000000:
                recommendations.append({
                    'business_id': business['business_id'],
                    'business_name': business['name'],
                    'recommendation_type': 'priority_acquisition',
                    'reason': 'High acquisition attractiveness with succession opportunity',
                    'acquisition_score': acquisition_score,
                    'succession_risk': succession_risk,
                    'estimated_revenue': revenue,
                    'urgency': 'high' if succession_risk > 80 else 'medium'
                })
        
        # Find roll-up opportunities
        category_groups = {}
        for business in businesses_data:
            category = business['category']
            if category not in category_groups:
                category_groups[category] = []
            category_groups[category].append(business)
        
        for category, businesses in category_groups.items():
            if len(businesses) >= 3:  # Multiple businesses in same category
                total_revenue = sum(b['metrics']['estimated_revenue'] or 0 for b in businesses)
                if total_revenue > 3000000:  # Significant combined revenue
                    recommendations.append({
                        'recommendation_type': 'roll_up_opportunity',
                        'category': category,
                        'business_count': len(businesses),
                        'total_revenue': total_revenue,
                        'reason': f'Multiple {category} businesses available for roll-up strategy',
                        'urgency': 'medium'
                    })
        
        return recommendations
    
    def _generate_market_opportunities(
        self, 
        market_metrics: Dict[str, Any],
        fragmentation_analysis: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Generate market opportunity insights"""
        
        opportunities = []
        
        # Market consolidation opportunity
        if fragmentation_analysis.get('fragmentation_level') == 'highly_fragmented':
            opportunities.append({
                'opportunity_type': 'market_consolidation',
                'description': 'Highly fragmented market presents roll-up opportunity',
                'potential_impact': 'high',
                'fragmentation_level': fragmentation_analysis.get('fragmentation_level'),
                'hhi_index': fragmentation_analysis.get('hhi_index', 0)
            })
        
        # High succession risk opportunity
        avg_succession_risk = market_metrics.get('average_succession_risk', 0)
        if avg_succession_risk > 65:
            opportunities.append({
                'opportunity_type': 'succession_wave',
                'description': 'High average succession risk indicates upcoming ownership transitions',
                'potential_impact': 'high',
                'average_succession_risk': avg_succession_risk
            })
        
        # Market size opportunity
        total_tam = market_metrics.get('total_tam_estimate', 0)
        if total_tam > 50000000:  # $50M+ TAM
            opportunities.append({
                'opportunity_type': 'large_market',
                'description': 'Large total addressable market with growth potential',
                'potential_impact': 'medium',
                'total_tam': total_tam
            })
        
        return opportunities
    
    def _calculate_market_concentration(self, revenues: List[float]) -> float:
        """Calculate market concentration using HHI"""
        total_revenue = sum(revenues)
        if total_revenue == 0:
            return 0
        
        market_shares = [(rev / total_revenue) ** 2 for rev in revenues]
        return sum(market_shares) * 10000  # Standard HHI scale
    
    def _calculate_digital_maturity(self, businesses: List[NormalizedBusiness]) -> float:
        """Calculate market digital maturity"""
        if not businesses:
            return 0
        
        digital_scores = [
            b.metrics.digital_presence_score or 0 
            for b in businesses if b.metrics.digital_presence_score
        ]
        
        return sum(digital_scores) / len(digital_scores) if digital_scores else 0
    
    def _calculate_acquisition_readiness(self, businesses: List[NormalizedBusiness]) -> float:
        """Calculate market acquisition readiness"""
        if not businesses:
            return 0
        
        readiness_factors = []
        for business in businesses:
            factors = 0
            
            # Has valid contact info
            if business.contact.phone_valid:
                factors += 1
            if business.contact.email_valid:
                factors += 1
            if business.contact.website_valid:
                factors += 1
            
            # Financial size
            if business.metrics.estimated_revenue and business.metrics.estimated_revenue > 1000000:
                factors += 2
            
            # Business maturity
            if business.metrics.years_in_business and business.metrics.years_in_business > 10:
                factors += 1
            
            readiness_factors.append(factors / 6 * 100)  # Normalize to 0-100
        
        return sum(readiness_factors) / len(readiness_factors)
    
    def _generate_cache_key(self, request: IntelligenceRequest) -> str:
        """Generate cache key for request"""
        key_components = [
            request.location.lower().replace(' ', '_'),
            request.industry or 'general',
            str(request.radius_miles),
            str(request.max_businesses),
            '_'.join(sorted(request.crawl_sources or [])),
            '_'.join(sorted(request.enrichment_types or [])),
            '_'.join(sorted(request.analysis_types or []))
        ]
        return 'intel_' + '_'.join(key_components)
    
    def get_request_status(self, request_id: str) -> Dict[str, Any]:
        """Get status of a processing request"""
        if request_id in self.active_requests:
            request_info = self.active_requests[request_id]
            processing_time = time.time() - request_info['start_time']
            
            return {
                'request_id': request_id,
                'status': request_info['status'],
                'processing_time': processing_time,
                'location': request_info['location']
            }
        else:
            return {
                'request_id': request_id,
                'status': 'not_found'
            }
    
    def get_pipeline_health(self) -> Dict[str, Any]:
        """Get health status of the intelligence pipeline"""
        return {
            'components': {
                'crawler_hub': 'operational',
                'data_normalizer': 'operational',
                'enrichment_engine': 'operational',
                'scoring_engine': 'operational'
            },
            'cache_size': len(self.cache),
            'active_requests': len(self.active_requests),
            'avg_processing_time': np.mean(list(self.pipeline_metrics.values())) if self.pipeline_metrics else 0,
            'last_updated': datetime.now().isoformat()
        }


# Export main service
__all__ = ['IntegratedIntelligenceService', 'IntelligenceRequest', 'IntelligenceResponse']
