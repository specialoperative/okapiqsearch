"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/ui/button";
import SolutionsPage from "@/components/solutions-page";

export default function FragmentFinderPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#fcfbfa]">
      {/* remove duplicate local nav; global top bar covers this */}

      <header className="bg-gradient-to-br from-okapi-brown-50 to-white py-12 border-b border-okapi-brown-200">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-okapi-brown-900">Fragment Finder</h1>
          <p className="text-okapi-brown-700 mt-4 text-lg max-w-3xl">
            Roll-up targeting and fragmentation analysis using mock data with HHI/geo tools.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Placeholder: we don't have a dedicated fragment analysis page; link users to Solutions for now */}
        <div className="bg-white rounded-lg border border-okapi-brown-200 p-6 mb-8 shadow-sm">
          <p className="text-okapi-brown-800">
            Dedicated analysis UI coming soon. Explore methodology and product tour below.
          </p>
        </div>
        <SolutionsPage onNavigate={(page: string) => router.push(`/?page=${page}`)} />
      </main>
    </div>
  );
}


