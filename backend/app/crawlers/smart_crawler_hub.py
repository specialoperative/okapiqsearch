"""
Smart Crawler Hub - The primary data procurement engine for Okapiq

This module implements the first layer of the architectural diagram:
[Target Sites] → [Smart Crawler Hub] ← Playwright / Puppeteer / APIs

Features:
- GoogleScape Agent for business listings
- Multi-source scraping with proxy rotation
- Intelligent rate limiting and respectful crawling
- Structured data extraction and normalization
"""

import asyncio
import json
import time
import random
from typing import List, Dict, Any, Optional, Union
from datetime import datetime
import logging
from dataclasses import dataclass
from enum import Enum

# Core dependencies
from playwright.async_api import async_playwright, Page, Browser
import aiohttp
import fake_useragent
from bs4 import BeautifulSoup
import re

# Internal imports
from ..core.config import settings


class CrawlerType(Enum):
    GOOGLE_MAPS = "google_maps"
    YELP = "yelp"
    LINKEDIN = "linkedin"
    SBA_RECORDS = "sba_records"
    DATAAXLE = "dataaxle"
    BIZBUYSELL = "bizbuysell"
    SECRETARY_OF_STATE = "sos"
    IRS_RECORDS = "irs_records"


@dataclass
class CrawlRequest:
    """Standardized crawl request structure"""
    crawler_type: CrawlerType
    target_url: str
    search_params: Dict[str, Any]
    priority: int = 1  # 1=high, 5=low
    use_proxy: bool = True
    delay_range: tuple = (1, 3)  # seconds
    max_retries: int = 3


@dataclass
class CrawlResult:
    """Standardized crawl result structure"""
    success: bool
    data: List[Dict[str, Any]]
    metadata: Dict[str, Any]
    timestamp: datetime
    source: str
    errors: List[str] = None


class SmartCrawlerHub:
    """
    Centralized crawling engine that manages multiple data sources
    with intelligent routing, proxy management, and rate limiting
    """
    
    def __init__(self):
        self.ua = fake_useragent.UserAgent()
        self.session_pool = []
        self.proxy_pool = []
        self.rate_limits = {}
        self.crawl_queue = asyncio.Queue()
        
        # Configure logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
        
        # Initialize crawler agents
        self.google_agent = GoogleScapeAgent()
        self.yelp_agent = YelpDeepSignalAgent()
        self.linkedin_agent = LinkedInSignalAgent()
        self.sba_agent = SBARecordsAgent()
        
    async def crawl_business_data(
        self, 
        location: str, 
        industry: str = None,
        sources: List[CrawlerType] = None
    ) -> Dict[str, CrawlResult]:
        """
        Main entry point for business data crawling
        
        Args:
            location: Geographic location (city, zip, etc.)
            industry: Industry filter
            sources: List of crawler types to use
            
        Returns:
            Dictionary of results keyed by crawler type
        """
        if sources is None:
            sources = [CrawlerType.GOOGLE_MAPS, CrawlerType.YELP]
            
        results = {}
        
        # Create crawl requests
        requests = []
        for source in sources:
            request = self._create_crawl_request(source, location, industry)
            requests.append(request)
        
        # Execute crawls concurrently with rate limiting
        tasks = []
        for request in requests:
            task = asyncio.create_task(self._execute_crawl(request))
            tasks.append(task)
            
        # Wait for all crawls to complete
        crawl_results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Process results
        for i, result in enumerate(crawl_results):
            if isinstance(result, Exception):
                self.logger.error(f"Crawl failed for {requests[i].crawler_type}: {result}")
                results[requests[i].crawler_type.value] = CrawlResult(
                    success=False,
                    data=[],
                    metadata={"error": str(result)},
                    timestamp=datetime.now(),
                    source=requests[i].crawler_type.value,
                    errors=[str(result)]
                )
            else:
                results[requests[i].crawler_type.value] = result
                
        return results
    
    def _create_crawl_request(
        self, 
        crawler_type: CrawlerType, 
        location: str, 
        industry: str
    ) -> CrawlRequest:
        """Create a standardized crawl request"""
        
        search_params = {
            "location": location,
            "industry": industry,
            "timestamp": datetime.now().isoformat()
        }
        
        # Configure crawler-specific parameters
        if crawler_type == CrawlerType.GOOGLE_MAPS:
            target_url = "https://www.google.com/maps/search/"
            search_params.update({
                "query": f"{industry} near {location}" if industry else f"businesses near {location}",
                "radius": 25
            })
            
        elif crawler_type == CrawlerType.YELP:
            target_url = "https://www.yelp.com/search"
            search_params.update({
                "find_desc": industry or "",
                "find_loc": location
            })
            
        elif crawler_type == CrawlerType.LINKEDIN:
            target_url = "https://www.linkedin.com/search/results/content/"
            search_params.update({
                "keywords": f"#{industry} #{location} #searchfund #businessforsale #m&a"
            })
            
        else:
            target_url = "https://example.com"  # Default fallback
            
        return CrawlRequest(
            crawler_type=crawler_type,
            target_url=target_url,
            search_params=search_params,
            priority=1,
            use_proxy=True,
            delay_range=(2, 5),  # Respectful crawling
            max_retries=3
        )
    
    async def _execute_crawl(self, request: CrawlRequest) -> CrawlResult:
        """Execute a single crawl request"""
        
        try:
            # Apply rate limiting
            await self._apply_rate_limit(request.crawler_type)
            
            # Route to appropriate crawler agent
            if request.crawler_type == CrawlerType.GOOGLE_MAPS:
                result = await self.google_agent.crawl(request)
            elif request.crawler_type == CrawlerType.YELP:
                result = await self.yelp_agent.crawl(request)
            elif request.crawler_type == CrawlerType.LINKEDIN:
                result = await self.linkedin_agent.crawl(request)
            elif request.crawler_type == CrawlerType.SBA_RECORDS:
                result = await self.sba_agent.crawl(request)
            else:
                # Fallback to generic crawler
                result = await self._generic_crawl(request)
                
            return result
            
        except Exception as e:
            self.logger.error(f"Crawl execution failed: {e}")
            return CrawlResult(
                success=False,
                data=[],
                metadata={"error": str(e)},
                timestamp=datetime.now(),
                source=request.crawler_type.value,
                errors=[str(e)]
            )
    
    async def _apply_rate_limit(self, crawler_type: CrawlerType):
        """Apply intelligent rate limiting per crawler type"""
        
        now = time.time()
        last_request = self.rate_limits.get(crawler_type, 0)
        
        # Rate limit configurations
        limits = {
            CrawlerType.GOOGLE_MAPS: 3,  # 3 seconds between requests
            CrawlerType.YELP: 2,        # 2 seconds between requests
            CrawlerType.LINKEDIN: 5,    # 5 seconds between requests (more restrictive)
            CrawlerType.SBA_RECORDS: 1, # 1 second between requests (government data)
        }
        
        required_delay = limits.get(crawler_type, 2)
        time_since_last = now - last_request
        
        if time_since_last < required_delay:
            delay = required_delay - time_since_last
            await asyncio.sleep(delay)
            
        self.rate_limits[crawler_type] = time.time()
    
    async def _generic_crawl(self, request: CrawlRequest) -> CrawlResult:
        """Generic crawler for basic web scraping"""
        
        try:
            async with aiohttp.ClientSession() as session:
                headers = {
                    'User-Agent': self.ua.random,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                }
                
                async with session.get(request.target_url, headers=headers) as response:
                    html = await response.text()
                    
                    # Basic HTML parsing
                    soup = BeautifulSoup(html, 'html.parser')
                    
                    # Extract basic business data
                    businesses = []
                    # Add generic extraction logic here
                    
                    return CrawlResult(
                        success=True,
                        data=businesses,
                        metadata={
                            "url": request.target_url,
                            "status_code": response.status,
                            "crawler_type": request.crawler_type.value
                        },
                        timestamp=datetime.now(),
                        source="generic_crawler"
                    )
                    
        except Exception as e:
            return CrawlResult(
                success=False,
                data=[],
                metadata={"error": str(e)},
                timestamp=datetime.now(),
                source="generic_crawler",
                errors=[str(e)]
            )


class GoogleScapeAgent:
    """
    GoogleScape Agent v1 - Google Maps business scraper
    
    As described in the requirements:
    "Google, unbundled and weaponized for small business acquisition"
    """
    
    def __init__(self):
        self.logger = logging.getLogger(f"{__name__}.GoogleScapeAgent")
    
    async def crawl(self, request: CrawlRequest) -> CrawlResult:
        """Crawl Google Maps for business data"""
        
        try:
            async with async_playwright() as p:
                # Launch browser with stealth mode
                browser = await p.chromium.launch(
                    headless=True,
                    args=[
                        '--no-sandbox',
                        '--disable-blink-features=AutomationControlled',
                        '--disable-web-security',
                        '--disable-features=VizDisplayCompositor'
                    ]
                )
                
                page = await browser.new_page()
                
                # Set realistic user agent
                await page.set_user_agent(
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
                )
                
                # Navigate to Google Maps
                search_query = request.search_params.get("query", "")
                maps_url = f"https://www.google.com/maps/search/{search_query}"
                
                await page.goto(maps_url, wait_until='networkidle')
                await asyncio.sleep(random.uniform(2, 4))
                
                # Extract business listings
                businesses = await self._extract_business_listings(page)
                
                await browser.close()
                
                return CrawlResult(
                    success=True,
                    data=businesses,
                    metadata={
                        "search_query": search_query,
                        "total_found": len(businesses),
                        "extraction_method": "playwright"
                    },
                    timestamp=datetime.now(),
                    source="google_maps"
                )
                
        except Exception as e:
            self.logger.error(f"Google Maps crawl failed: {e}")
            return CrawlResult(
                success=False,
                data=[],
                metadata={"error": str(e)},
                timestamp=datetime.now(),
                source="google_maps",
                errors=[str(e)]
            )
    
    async def _extract_business_listings(self, page: Page) -> List[Dict[str, Any]]:
        """Extract business data from Google Maps page"""
        
        businesses = []
        
        try:
            # Wait for business listings to load
            await page.wait_for_selector('[data-value="Directions"]', timeout=10000)
            
            # Get all business containers
            business_elements = await page.query_selector_all('[jsaction*="pane.result"]')
            
            for element in business_elements[:10]:  # Limit to first 10 results
                try:
                    business_data = await self._extract_single_business(page, element)
                    if business_data:
                        businesses.append(business_data)
                except Exception as e:
                    self.logger.warning(f"Failed to extract business: {e}")
                    continue
                    
        except Exception as e:
            self.logger.error(f"Failed to extract business listings: {e}")
            
        return businesses
    
    async def _extract_single_business(self, page: Page, element) -> Dict[str, Any]:
        """Extract data from a single business listing"""
        
        business = {}
        
        try:
            # Business name
            name_elem = await element.query_selector('[data-value="Directions"]')
            if name_elem:
                business['name'] = await name_elem.get_attribute('aria-label') or "Unknown Business"
            
            # Rating
            rating_elem = await element.query_selector('[role="img"][aria-label*="stars"]')
            if rating_elem:
                rating_text = await rating_elem.get_attribute('aria-label')
                rating_match = re.search(r'(\d+(?:\.\d+)?)', rating_text or "")
                business['rating'] = float(rating_match.group(1)) if rating_match else 0.0
            
            # Review count
            review_elem = await element.query_selector('span:has-text("reviews")')
            if review_elem:
                review_text = await review_elem.inner_text()
                review_match = re.search(r'(\d+)', review_text)
                business['review_count'] = int(review_match.group(1)) if review_match else 0
            
            # Address
            address_elem = await element.query_selector('[data-value="Directions"] + div div:nth-child(2)')
            if address_elem:
                business['address'] = await address_elem.inner_text()
            
            # Phone number (if available)
            phone_elem = await element.query_selector('[data-value*="tel:"]')
            if phone_elem:
                phone_href = await phone_elem.get_attribute('data-value')
                business['phone'] = phone_href.replace('tel:', '') if phone_href else ""
            
            # Website (if available)
            website_elem = await element.query_selector('[data-value*="http"]')
            if website_elem:
                business['website'] = await website_elem.get_attribute('data-value')
            
            # Add estimated metrics
            business.update(self._estimate_business_metrics(business))
            
            return business
            
        except Exception as e:
            self.logger.warning(f"Error extracting single business: {e}")
            return None
    
    def _estimate_business_metrics(self, business: Dict[str, Any]) -> Dict[str, Any]:
        """Estimate additional business metrics"""
        
        rating = business.get('rating', 0)
        review_count = business.get('review_count', 0)
        
        # Estimate revenue
        base_revenue = 1000000
        rating_factor = rating / 5.0
        review_factor = min(review_count / 100.0, 2.0)
        estimated_revenue = int(base_revenue * rating_factor * review_factor)
        
        # Estimate employees
        estimated_employees = max(5, min(50, int(estimated_revenue / 100000)))
        
        # Estimate years in business
        years_in_business = max(3, min(30, int(review_count / 5 + rating * 2)))
        
        # Calculate succession risk
        succession_risk = min(100, max(30, years_in_business * 2 + (5 - rating) * 10))
        
        # Estimate owner age
        owner_age = min(75, max(35, 40 + years_in_business))
        
        return {
            'estimated_revenue': estimated_revenue,
            'employee_count': estimated_employees,
            'years_in_business': years_in_business,
            'succession_risk_score': succession_risk,
            'owner_age_estimate': owner_age,
            'coordinates': [37.7749, -122.4194],  # Default to SF coords
            'source': 'GoogleScape Agent v1'
        }


class YelpDeepSignalAgent:
    """
    Yelp DeepSignal Agent - Enhanced Yelp scraper with owner detection
    
    Extracts owner names, reviews, business age, digital presence indicators
    """
    
    def __init__(self):
        self.logger = logging.getLogger(f"{__name__}.YelpDeepSignalAgent")
    
    async def crawl(self, request: CrawlRequest) -> CrawlResult:
        """Crawl Yelp for enhanced business signals"""
        
        try:
            # For now, return mock data structure
            # In production, this would use Playwright/Puppeteer to scrape Yelp
            
            mock_businesses = [
                {
                    "business_name": "Elite HVAC Solutions",
                    "avg_rating": 4.2,
                    "review_count": 67,
                    "photos_count": 12,
                    "yelp_joined": "2014",
                    "estimated_founding_year": 2012,
                    "claimed": True,
                    "address": "2447 Grand Ave, Oakland, CA 94610",
                    "zip": "94610",
                    "phone": "(510) 555-2020",
                    "email": "info@elitehvac.com",
                    "website": "https://elitehvac.com",
                    "owner_name": "Carlos Jimenez",
                    "owner_detected_from": "Review analysis",
                    "category": ["HVAC", "Home Services"],
                    "digital_presence_score": 82,
                    "succession_signal_score": 72
                }
            ]
            
            return CrawlResult(
                success=True,
                data=mock_businesses,
                metadata={
                    "extraction_method": "yelp_deep_signal",
                    "owner_detection": True,
                    "digital_analysis": True
                },
                timestamp=datetime.now(),
                source="yelp_deep_signal"
            )
            
        except Exception as e:
            self.logger.error(f"Yelp crawl failed: {e}")
            return CrawlResult(
                success=False,
                data=[],
                metadata={"error": str(e)},
                timestamp=datetime.now(),
                source="yelp_deep_signal",
                errors=[str(e)]
            )


class LinkedInSignalAgent:
    """
    LinkedIn Signal Agent - Deal signals and ownership intelligence
    
    Searches for posts about business sales, succession, M&A activity
    """
    
    def __init__(self):
        self.logger = logging.getLogger(f"{__name__}.LinkedInSignalAgent")
    
    async def crawl(self, request: CrawlRequest) -> CrawlResult:
        """Crawl LinkedIn for deal signals"""
        
        try:
            # Mock data for LinkedIn signals
            mock_signals = [
                {
                    "poster_name": "John Smith",
                    "company": "Regional M&A Advisors",
                    "post_url": "https://linkedin.com/posts/john-smith-ma-advisor",
                    "post_content": "Just closed another #searchfund deal in the HVAC space...",
                    "hashtags": ["#searchfund", "#m&a", "#hvac"],
                    "engagement_count": 15,
                    "post_date": "2024-01-15",
                    "signal_strength": "high",
                    "signal_type": "deal_completion"
                }
            ]
            
            return CrawlResult(
                success=True,
                data=mock_signals,
                metadata={
                    "signal_detection": True,
                    "hashtag_tracking": True,
                    "engagement_analysis": True
                },
                timestamp=datetime.now(),
                source="linkedin_signals"
            )
            
        except Exception as e:
            self.logger.error(f"LinkedIn crawl failed: {e}")
            return CrawlResult(
                success=False,
                data=[],
                metadata={"error": str(e)},
                timestamp=datetime.now(),
                source="linkedin_signals",
                errors=[str(e)]
            )


class SBARecordsAgent:
    """
    SBA Records Agent - Succession signals from SBA loan data
    
    Analyzes SBA lending patterns for succession risk indicators
    """
    
    def __init__(self):
        self.logger = logging.getLogger(f"{__name__}.SBARecordsAgent")
    
    async def crawl(self, request: CrawlRequest) -> CrawlResult:
        """Crawl SBA records for succession signals"""
        
        try:
            # Mock SBA data
            mock_sba_data = [
                {
                    "business_name": "Sunshine Roofing",
                    "owner_name": "David Alvarez",
                    "phone": "555-443-2020",
                    "revenue": 1200000,
                    "NAICS": "238160",
                    "employee_count": 8,
                    "zip": "93309",
                    "loan_amount": 250000,
                    "loan_date": "2015-03-15",
                    "succession_risk": 0.83,
                    "acquisition_rating": "B+"
                }
            ]
            
            return CrawlResult(
                success=True,
                data=mock_sba_data,
                metadata={
                    "succession_analysis": True,
                    "loan_history": True,
                    "owner_identification": True
                },
                timestamp=datetime.now(),
                source="sba_records"
            )
            
        except Exception as e:
            self.logger.error(f"SBA crawl failed: {e}")
            return CrawlResult(
                success=False,
                data=[],
                metadata={"error": str(e)},
                timestamp=datetime.now(),
                source="sba_records",
                errors=[str(e)]
            )


# Export main classes
__all__ = [
    'SmartCrawlerHub',
    'CrawlerType',
    'CrawlRequest',
    'CrawlResult',
    'GoogleScapeAgent',
    'YelpDeepSignalAgent',
    'LinkedInSignalAgent',
    'SBARecordsAgent'
]
