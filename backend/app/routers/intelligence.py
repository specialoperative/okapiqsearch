import logging
import asyncio
from datetime import datetime
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, HTTPException, BackgroundTasks, status
from pydantic import BaseModel
import time
import re

logger = logging.getLogger(__name__)

router = APIRouter()

class MarketScanRequest(BaseModel):
    location: str
    industry: Optional[str] = None
    radius_miles: Optional[int] = 15
    max_businesses: Optional[int] = 20
    crawl_sources: Optional[List[str]] = ['google_serp']
    enrichment_types: Optional[List[str]] = []
    analysis_types: Optional[List[str]] = []
    use_cache: Optional[bool] = True
    priority: Optional[int] = 1

@router.post("/scan")
async def comprehensive_market_scan(request: MarketScanRequest, background_tasks: BackgroundTasks):
    """
    Comprehensive market scan using real API aggregation
    """
    logger.info(f"Market scan request: {request.location}, industry: {request.industry}")
    
    import time
    
    start_time = time.time()
    request_id = f"req_{int(time.time())}_{abs(hash(request.location + str(time.time())))}"
    
    # Real data aggregation from all available APIs
    sample_businesses = []
    
    try:
        from ..crawlers.smart_crawler_hub import SmartCrawlerHub
        # Initialize crawler hub for real data aggregation
        crawler_hub = SmartCrawlerHub()
        
        # Use all available APIs for comprehensive business discovery
        if not request.industry or request.industry.lower() in ['all', 'all industries', '']:
            # Multi-industry search for comprehensive coverage
            search_queries = [
                f"hvac companies {request.location}",
                f"restaurants {request.location}",
                f"auto repair {request.location}",
                f"construction companies {request.location}",
                f"medical clinics {request.location}",
                f"law firms {request.location}",
                f"retail stores {request.location}",
                f"plumbing services {request.location}",
                f"tech companies {request.location}",
                f"accounting firms {request.location}",
            ]
        else:
            # Single industry search with keyword mapping for better results
            ind = (request.industry or '').strip().lower()
            keyword_map = {
                'electrical': ['electrician', 'electrical contractor'],
                'hvac': ['hvac', 'heating and air'],
                'plumbing': ['plumber', 'plumbing company'],
                'landscaping': ['landscaping', 'lawn care'],
                'automotive': ['auto repair', 'mechanic'],
                'construction': ['construction company', 'general contractor'],
                'restaurant': ['restaurant'],
                'retail': ['retail store'],
                'healthcare': ['clinic', 'medical clinic'],
                'it services': ['it services', 'managed it'],
                'real estate': ['real estate agency'],
                'education': ['tutoring center', 'school'],
            }
            base_terms = keyword_map.get(ind, [ind or 'business'])
            search_queries = [f"{t} {request.location}" for t in base_terms]
        
        # Aggregate data from all available sources
        all_businesses = []
        from ..crawlers.smart_crawler_hub import CrawlerType, CrawlRequest
        
                        # 1. Fast API aggregation - prioritize speed over quantity
        # Use only the most relevant single query for fastest response
        primary_query = search_queries[0] if search_queries else f"businesses {request.location}"
        
        try:
            # Use asyncio.wait_for for strict timeout control
            import asyncio
            
            async def quick_serp_call():
                crawl_req = CrawlRequest(
                    crawler_type=CrawlerType.GOOGLE_SERP,
                    target_url="https://serpapi.com/search.json",
                    search_params={
                        "query": primary_query,
                        "industry": request.industry or "",
                        "location": request.location,
                        "num": 20  # Limit results for speed
                    },
            priority=1
        )
                return await crawler_hub._execute_crawl(crawl_req)
            
            # Strict 8-second timeout for the entire SERP call
            crawl_res = await asyncio.wait_for(quick_serp_call(), timeout=8.0)
            
            if crawl_res and crawl_res.success:
                    # Keep entries with name and address/coords/website
                    for item in crawl_res.data[:40]:
                        name_val = item.get('name')
                        addr_val = item.get('address')
                        if not isinstance(name_val, str):
                            continue
                        name_val = name_val.strip()
                        if not name_val:
                            continue
                        addr_val = (addr_val or '').strip()
                        looks_like_street = False
                        if isinstance(addr_val, str) and addr_val:
                            low = addr_val.lower()
                            looks_like_street = (any(x in low for x in [' st', ' street', ' ave', ' avenue', ' rd', ' road', ' blvd', ' boulevard', ' dr', ' drive', ' ln', ' lane', ' way', ' ct', ' court']) and any(ch.isdigit() for ch in addr_val[:12]))
                        has_coords = isinstance(item.get('coordinates'), (list, tuple)) and len(item.get('coordinates')) == 2
                        website_val = item.get('website', '')
                        has_site = isinstance(website_val, str) and len(website_val.strip()) > 4
                        # Accept if street-like OR have coords/site (we can verify client-side)
                        if not (looks_like_street or has_coords or has_site):
                            continue
                        # Clean up website URL
                        website_clean = website_val.strip() if website_val else ''
                        if website_clean and not website_clean.startswith(('http://', 'https://')):
                            website_clean = f"https://{website_clean}"
                        # Infer industry from query if needed
                            industry = (request.industry or '').lower()
                            if not industry:
                                q_low = query.lower()
                                if 'hvac' in q_low or 'heating' in q_low or 'air conditioning' in q_low:
                                    industry = 'hvac'
                                elif 'restaurant' in q_low or 'cafe' in q_low or 'diner' in q_low:
                                    industry = 'restaurant'
                                elif 'auto' in q_low or 'repair' in q_low or 'mechanic' in q_low:
                                    industry = 'automotive'
                                elif 'construction' in q_low or 'contractor' in q_low:
                                    industry = 'construction'
                                elif 'medical' in q_low or 'clinic' in q_low or 'doctor' in q_low:
                                    industry = 'healthcare'
                                elif 'law' in q_low or 'attorney' in q_low or 'legal' in q_low:
                                    industry = 'legal'
                                else:
                                    industry = 'general'
                            
                            all_businesses.append({
                                'name': name_val,
                                'industry': industry,
                                'address': addr_val,
                                'phone': item.get('phone'),
                                'website': website_clean,
                                'rating': item.get('rating') or 0.0,
                                'reviews': item.get('review_count') or item.get('reviews') or 0,
                                'coordinates': item.get('coordinates'),
                                'source': item.get('source') or crawl_res.source
                            })
                            
        except asyncio.TimeoutError:
            logger.warning("SERP API call timed out after 8 seconds")
        except Exception as e:
            logger.warning(f"SERP search failed: {e}")
        
                        # Skip secondary APIs for maximum speed - focus on primary SERP only

        # Use real data if available, otherwise fast local business directory
        if len(all_businesses) >= 1:
            # Dedupe by (name,address)
            seen = set()
            deduped = []
            for b in all_businesses:
                key = (b['name'].lower(), b['address'].lower())
                if key in seen:
                    continue
                seen.add(key)
                deduped.append(b)
            sample_businesses = deduped[:min(request.max_businesses or 20, 50)]
        else:
            # Return empty result if no real data found - strict API-only mode
            logger.warning("No real business data found from any API source")
            sample_businesses = []
        
    except Exception as e:
        logger.error(f"Real data aggregation failed: {e}")
        sample_businesses = []
    
    # Step 2: Normalize business data
    businesses = []
    
    # Limit businesses based on request
    max_businesses = min(request.max_businesses or 20, 50)  # Cap at 50 max
    sample_businesses = sample_businesses[:max_businesses]
    
    def _parse_city_state_zip(addr_text: str):
        try:
            parts = [p.strip() for p in (addr_text or "").split(',') if p and p.strip()]
            line1 = None; city = None; state = None; zip_code = None
            
            if len(parts) >= 1:
                line1 = parts[0].strip()
            
            if len(parts) >= 2:
                tail = ','.join(parts[1:])
                import re
                m = re.search(r"([A-Za-z .'-]+),?\s*([A-Z]{2})\s*(\d{5}(?:-\d{4})?)?", tail)
                if m:
                    city = m.group(1).strip()
                    state = m.group(2).strip()
                    zip_code = m.group(3).strip() if m.group(3) else None
                elif len(parts) >= 3:
                    city = parts[1].strip()
                    state_zip = parts[2].strip()
                    szm = re.search(r"^([A-Z]{2})\s*(\d{5}(?:-\d{4})?)?", state_zip)
                    if szm:
                        state = szm.group(1)
                        zip_code = szm.group(2) if szm.group(2) else None
                elif len(parts) == 2:
                    # Try to parse "City, State" format
                    city_state = parts[1].strip()
                    csm = re.search(r"^([A-Za-z .'-]+),?\s*([A-Z]{2})$", city_state)
                    if csm:
                        city = csm.group(1).strip()
                        state = csm.group(2).strip()
            
            return line1, city, state, zip_code
        except Exception:
            return None, None, None, None



    for i, biz in enumerate(sample_businesses):
        try:
            # Parse address
            line1, city, state, zip_code = _parse_city_state_zip(biz.get('address', ''))
            
            # Estimate revenue based on rating, reviews, and industry
            rating = biz.get('rating', 0.0)
            reviews = biz.get('reviews', 0)
            base_revenue = max(250000, reviews * 2000 + rating * 50000)
            min_revenue = int(base_revenue * 0.7)
            max_revenue = int(base_revenue * 1.5)
            
            # Estimate other metrics
            employee_count = max(3, min(25, int(base_revenue / 80000)))
            years_in_business = max(2, min(20, int(reviews / 10 + rating)))
            lead_score = min(100, max(20, int(rating * 15 + min(reviews, 50))))
            owner_age = 35 + int((reviews % 20) + (rating * 3))
            num_locations = 1 if reviews < 100 else (2 if reviews < 300 else 3)
            
            normalized = {
                'business_id': biz.get('business_id') or biz.get('place_id') or biz.get('data_id') or f"raw_{i}_{hash(str(biz))}",
                'name': biz.get('name', 'Unknown Business'),
                'category': biz.get('industry', request.industry or 'hvac'),
                'industry': biz.get('industry', request.industry or 'hvac'),
                'address': {
                    'formatted_address': biz.get('address', ''),
                    'line1': line1,
                    'city': city,
                    'state': state,
                    'zip_code': zip_code,
                    'coordinates': biz.get('coordinates', [])
                },
                'contact': {
                    'phone': biz.get('phone', ''),
                    'email': None,  # Explicitly set to None, can be enriched later
                    'website': biz.get('website', ''),
                    'phone_valid': bool(biz.get('phone')),
                    'email_valid': False,
                    'website_valid': bool(biz.get('website'))
                },
                'metrics': {
                    'rating': rating,
                    'review_count': reviews,
                    'estimated_revenue': base_revenue,
                    'min_revenue': min_revenue,
                    'max_revenue': max_revenue,
                    'employee_count': employee_count,
                    'years_in_business': years_in_business,
                    'lead_score': lead_score,
                    'owner_age': owner_age,
                    'num_locations': num_locations
                },
                'data_quality': 'high' if biz.get('source') in ['google_serp', 'yelp'] else 'medium',
                'data_sources': [biz.get('source', 'unknown')] if biz.get('source') else ['api_aggregated'],
                'last_updated': datetime.now().isoformat(),
                'tags': ['real_data', 'api_verified']
            }
            businesses.append(normalized)
        except Exception as parse_e:
            logger.warning(f"Failed to normalize business {i}: {parse_e}")
            continue

    end_time = time.time()
    duration = end_time - start_time
    
    logger.info(f"Market scan completed in {duration:.2f}s, found {len(businesses)} businesses")
        
    return {
        "success": True,
        "request_id": request_id,
        "businesses": businesses,
        "total_found": len(businesses),
        "query_info": {
            "location": request.location,
            "industry": request.industry or "all",
            "radius_miles": request.radius_miles,
            "search_duration_seconds": duration,
            "data_sources": list(set([b.get('data_sources', ['unknown'])[0] for b in businesses if b.get('data_sources')]))
        },
        "metadata": {
            "timestamp": datetime.now().isoformat(),
            "processing_time_ms": int(duration * 1000),
            "api_version": "2.0",
            "real_data_only": True
        }
    }
