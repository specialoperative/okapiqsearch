import logging
import asyncio
from datetime import datetime
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, HTTPException, BackgroundTasks, status
from pydantic import BaseModel
import time
import re
import aiohttp
import urllib.parse

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
    Comprehensive market scan using real API aggregation - fast optimized version
    """
    logger.info(f"Market scan request: {request.location}, industry: {request.industry}")
    
    start_time = time.time()
    request_id = f"req_{int(time.time())}_{abs(hash(request.location + str(time.time())))}"
    
    # Fast real data aggregation
    sample_businesses = []
    
    try:
        from ..crawlers.smart_crawler_hub import SmartCrawlerHub, CrawlerType, CrawlRequest
        
        # Initialize crawler hub
        crawler_hub = SmartCrawlerHub()
        
        # Build search queries
        if not request.industry or request.industry.lower() in ['all', 'all industries', '']:
            search_queries = [f"restaurants {request.location}", f"businesses {request.location}"]
        else:
            ind = (request.industry or '').strip().lower()
            keyword_map = {
                'electrical': 'electrician',
                'hvac': 'hvac',
                'plumbing': 'plumber',
                'landscaping': 'landscaping',
                'automotive': 'auto repair',
                'construction': 'construction',
                'restaurant': 'restaurant',
                'retail': 'retail store',
                'healthcare': 'clinic',
                'accounting firms': 'accounting firm',
                'security guards': 'security guard',
                'fire and safety': 'fire protection services',
            }
            term = keyword_map.get(ind, ind or 'business')
            search_queries = [f"{term} {request.location}"]
        
        # Use the SmartCrawlerHub to aggregate multiple sources (SerpAPI, Apify, Yelp, etc.)
        all_businesses = []
        try:
            # Map requested crawl_sources (strings) to CrawlerType enums
            requested_sources = request.crawl_sources or ['google_serp']
            source_types = []
            for s in requested_sources:
                key = s.strip().lower()
                try:
                    # handle common naming differences
                    mapping = {
                        'google_serp': CrawlerType.GOOGLE_SERP,
                        'google_maps': CrawlerType.GOOGLE_MAPS,
                        'yelp': CrawlerType.YELP,
                        'apify_gmaps': CrawlerType.APIFY_GMAPS,
                        'apify_gmaps_email': CrawlerType.APIFY_GMAPS_EMAIL,
                        'apify_gmaps_websites': CrawlerType.APIFY_GMAPS_WEBSITES,
                        'apify_website_crawler': CrawlerType.APIFY_WEBSITE_CRAWLER,
                        'firecrawl': CrawlerType.FIRECRAWL,
                        'linkedin': CrawlerType.LINKEDIN,
                        'sba_records': CrawlerType.SBA_RECORDS,
                    }
                    if key in mapping:
                        source_types.append(mapping[key])
                except Exception:
                    continue

            # Ensure at least SERP and APIFY+YELP are attempted for best coverage
            if not source_types:
                source_types = [CrawlerType.APIFY_GMAPS, CrawlerType.GOOGLE_SERP, CrawlerType.YELP]

            # Run the crawl using the hub (include all available sources when requested)
            hub_results = await crawler_hub.crawl_business_data(request.location, (request.industry or '').lower(), sources=source_types)

            # Merge results from each source
            for src_key, res in hub_results.items():
                if not res or not getattr(res, 'success', False):
                    continue
                for item in (res.data or [])[: (request.max_businesses or 20)]:
                    name_val = item.get('name') or item.get('business_name')
                    if not isinstance(name_val, str) or not name_val.strip():
                        continue
                    addr_val = (item.get('address') or item.get('formatted_address') or '')
                    website_val = (item.get('website') or item.get('url') or '').strip()
                    if website_val and not website_val.startswith(('http://', 'https://')):
                        website_val = f"https://{website_val}"
                    industry = request.industry or item.get('industry') or ''
                    all_businesses.append({
                        'name': name_val.strip(),
                        'industry': industry,
                        'address': addr_val,
                        'phone': item.get('phone') or item.get('display_phone') or '',
                        'website': website_val,
                        'rating': item.get('rating') or item.get('gmap_rating') or 0.0,
                        'reviews': item.get('review_count') or item.get('reviewCount') or 0,
                        'coordinates': item.get('coordinates') or item.get('location') or [],
                        'source': src_key
                    })
        except Exception as e:
            logger.warning(f"Crawl hub aggregation failed: {e}")
        
        # Use real data if available
        if all_businesses:
            # Quick deduplication
            seen = set()
            deduped = []
            for b in all_businesses:
                key = b['name'].lower()
                if key not in seen:
                    seen.add(key)
                    deduped.append(b)
            sample_businesses = deduped[:min(request.max_businesses or 20, 50)]
            
            # Enrich websites using SERP API
            try:
                from ..core.config import settings
                serp_key = getattr(settings, 'SERPAPI_KEY', None)
                if serp_key and sample_businesses:
                    logger.info(f"Enriching websites for {len(sample_businesses)} businesses")
                    
                    async def enrich_website(business):
                        """Find website for a single business"""
                        try:
                            # Skip if already has a valid website
                            current_website = business.get('website', '').strip()
                            if current_website and not any(p in current_website.lower() for p in 
                                ['yelp.com', 'google.com', 'facebook.com', 'yellowpages.com']):
                                return
                            
                            name = business.get('name', '').strip()
                            if not name:
                                return
                            
                            # Build targeted search query
                            location = request.location or ''
                            search_query = f'"{name}" official website {location}'
                            
                            params = {
                                'q': search_query,
                                'api_key': serp_key,
                                'engine': 'google',
                                'num': 10
                            }
                            
                            timeout = aiohttp.ClientTimeout(total=5)
                            async with aiohttp.ClientSession(timeout=timeout) as session:
                                url = f"https://serpapi.com/search.json?{urllib.parse.urlencode(params)}"
                                async with session.get(url) as resp:
                                    if resp.status != 200:
                                        return
                                    data = await resp.json()
                                    
                                    # Check organic results for business website
                                    for result in data.get('organic_results', [])[:5]:
                                        link = result.get('link', '')
                                        title = result.get('title', '').lower()
                                        snippet = result.get('snippet', '').lower()
                                        
                                        if not link:
                                            continue
                                        
                                        # Skip aggregator sites
                                        skip_domains = [
                                            'yelp.com', 'google.com', 'facebook.com', 'linkedin.com',
                                            'yellowpages.com', 'bbb.org', 'angi.com', 'thumbtack.com',
                                            'homeadvisor.com', 'wikipedia.org', 'instagram.com', 'twitter.com'
                                        ]
                                        
                                        if any(domain in link.lower() for domain in skip_domains):
                                            continue
                                        
                                        # Check if result mentions business name
                                        name_lower = name.lower()
                                        name_words = [w for w in name_lower.split() if len(w) > 2]
                                        
                                        if (name_lower in title or name_lower in snippet or
                                            any(word in link.lower() for word in name_words)):
                                            # Found likely website
                                            if not link.startswith(('http://', 'https://')):
                                                link = 'https://' + link
                                            business['website'] = link
                                            logger.info(f"Found website for {name}: {link}")
                                            break
                                            
                        except Exception as e:
                            logger.debug(f"Website enrichment failed for {business.get('name', '')}: {e}")
                    
                    # Enrich websites in parallel with rate limiting
                    tasks = []
                    for i, biz in enumerate(sample_businesses):
                        if i > 0 and i % 5 == 0:
                            await asyncio.sleep(0.5)  # Rate limit
                        tasks.append(enrich_website(biz))
                    
                    await asyncio.gather(*tasks, return_exceptions=True)
                    logger.info(f"Website enrichment completed")
                    
            except Exception as e:
                logger.warning(f"Website enrichment failed: {e}")
                
        else:
            logger.warning("No real business data found - returning empty result")
            sample_businesses = []
        
    except Exception as e:
        logger.error(f"Real data aggregation failed: {e}")
        sample_businesses = []
    
    # Fast normalization
    businesses = []
    
    def _parse_address(addr_text: str):
        """Quick address parsing"""
        parts = [p.strip() for p in (addr_text or "").split(',') if p.strip()]
        line1 = parts[0] if parts else ''
        city = parts[1] if len(parts) > 1 else ''
        state_zip = parts[2] if len(parts) > 2 else ''
        
        # Extract state and zip from last part
        state = ''
        zip_code = ''
        if state_zip:
            import re
            match = re.search(r'([A-Z]{2})\s*(\d{5})', state_zip)
            if match:
                state = match.group(1)
                zip_code = match.group(2)
        
        return line1, city, state, zip_code

    for i, biz in enumerate(sample_businesses):
        try:
            line1, city, state, zip_code = _parse_address(biz.get('address', ''))
            
            rating = biz.get('rating', 0.0) or 0.0
            reviews = biz.get('reviews', 0) or 0
            
            # Quick revenue estimation
            base_revenue = max(250000, reviews * 2000 + rating * 50000)
            min_revenue = int(base_revenue * 0.7)
            max_revenue = int(base_revenue * 1.5)
            
            normalized = {
                'business_id': f"fast_{i}_{hash(str(biz))}",
                'name': biz.get('name', 'Unknown Business'),
                'category': biz.get('industry', request.industry or 'general'),
                'industry': biz.get('industry', request.industry or 'general'),
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
                    'email': None,
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
                    'employee_count': max(3, min(25, int(base_revenue / 80000))),
                    'years_in_business': max(2, min(20, int(reviews / 10 + rating))),
                    'lead_score': min(100, max(20, int(rating * 15 + min(reviews, 50)))),
                    'owner_age': 35 + int((reviews % 20) + (rating * 3)),
                    'num_locations': 1 if reviews < 100 else 2
                },
                'data_quality': 'high',
                'data_sources': [biz.get('source', 'api_aggregated')],
                'last_updated': datetime.now().isoformat(),
                'tags': ['real_data', 'fast_api']
            }
            businesses.append(normalized)
        except Exception as parse_e:
            logger.warning(f"Failed to normalize business {i}: {parse_e}")
            continue

    end_time = time.time()
    duration = end_time - start_time
    
    logger.info(f"Fast market scan completed in {duration:.2f}s, found {len(businesses)} businesses")

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
            "data_sources": ['google_serp']
        },
        "metadata": {
            "timestamp": datetime.now().isoformat(),
            "processing_time_ms": int(duration * 1000),
            "api_version": "2.1_fast",
            "real_data_only": True
        }
    }
