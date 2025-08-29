#!/usr/bin/env python3
"""
Test website enrichment across multiple industries
"""
import requests
import json
import time

def test_industry_websites(industry, location="San Francisco"):
    """Test website enrichment for a specific industry"""
    url = "http://localhost:8000/intelligence/scan"
    payload = {
        "location": location,
        "industry": industry,
        "radius_miles": 15,
        "max_businesses": 10,
        "crawl_sources": ["google_serp", "apify_gmaps", "yelp"],
        "use_cache": False
    }
    
    print(f"\n📋 Testing {industry.upper()}...")
    try:
        response = requests.post(url, json=payload, timeout=30)
        if response.status_code == 200:
            data = response.json()
            businesses = data.get('businesses', [])
            
            # Count websites found
            with_website = 0
            samples = []
            for b in businesses:
                website = b.get('contact', {}).get('website', '')
                if website and website != 'N/A':
                    with_website += 1
                    if len(samples) < 3:
                        samples.append({
                            'name': b.get('name', 'Unknown'),
                            'website': website
                        })
            
            print(f"  ✓ Found {len(businesses)} businesses")
            print(f"  🌐 Websites: {with_website}/{len(businesses)} ({with_website*100//len(businesses) if businesses else 0}%)")
            
            if samples:
                print("  📝 Sample websites:")
                for s in samples:
                    # Truncate long names and URLs for display
                    name = s['name'][:30] + '...' if len(s['name']) > 30 else s['name']
                    website = s['website'].replace('https://', '').replace('http://', '')
                    website = website[:40] + '...' if len(website) > 40 else website
                    print(f"     • {name}: {website}")
            
            return with_website, len(businesses)
        else:
            print(f"  ✗ Failed: {response.status_code}")
            return 0, 0
            
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return 0, 0

def main():
    print("🔍 Testing Website Enrichment Across Industries")
    print("=" * 50)
    
    industries = [
        "restaurant",
        "hvac", 
        "electrical",
        "plumbing",
        "accounting firms",
        "security guards",
        "fire and safety"
    ]
    
    total_with_website = 0
    total_businesses = 0
    
    for industry in industries:
        with_website, num_businesses = test_industry_websites(industry)
        total_with_website += with_website
        total_businesses += num_businesses
        time.sleep(1)  # Rate limit between requests
    
    print("\n" + "=" * 50)
    print("📊 SUMMARY")
    print(f"Total businesses scanned: {total_businesses}")
    print(f"Total with websites: {total_with_website}")
    print(f"Overall website coverage: {total_with_website*100//total_businesses if total_businesses else 0}%")
    print("\n✅ Website enrichment test complete!")

if __name__ == "__main__":
    main()
