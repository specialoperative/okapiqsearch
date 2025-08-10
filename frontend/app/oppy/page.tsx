"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import MarketScannerPage from "@/components/market-scanner-page";
import { Button } from "@/ui/button";

export default function OppyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Auto-open scanner with provided location
  useEffect(() => {
    // The MarketScannerPage already exposes controls; it will read location via props we pass below
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#fcfbfa]">
      <nav className="border-b border-okapi-brown-200 bg-white/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-okapi-brown-900">
              Okapiq
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/solutions">
                <Button variant="outline" className="border-okapi-brown-300 text-okapi-brown-700 hover:bg-okapi-brown-50">
                  Solutions
                </Button>
              </Link>
              <Link href="/contact">
                <Button className="bg-okapi-brown-600 hover:bg-okapi-brown-700 text-white">Book a Demo</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <header className="bg-gradient-to-br from-okapi-brown-50 to-white py-12 border-b border-okapi-brown-200">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-okapi-brown-900">Oppy – Opportunity Finder</h1>
          <p className="text-okapi-brown-700 mt-4 text-lg max-w-3xl">
            Scan markets without API keys. Use mock public data to find SMB leads, score opportunities, and export CRM-ready lists.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <MarketScannerPage
          showHeader={false}
          onNavigate={(page: string) => {
            // Keep SPA nav compatibility while allowing deep-links
            router.push(`/?page=${page}`);
          }}
          // Pass initial location from query if present
          initialLocation={searchParams.get("location") || undefined}
        />
      </main>
    </div>
  );
}


