"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";

export type Crumb = { label: string; onClick?: () => void };

export default function BreadcrumbHeader({
  trail,
  onBack,
}: {
  trail: Crumb[];
  onBack: () => void;
}) {
  return (
    <div className="bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </button>
        {trail.map((t, i) => (
          <div key={`${t.label}-${i}`} className="flex items-center gap-2">
            <span className="text-sm text-gray-400">/</span>
            {t.onClick ? (
              <button onClick={t.onClick} className="text-sm text-emerald-700 hover:text-emerald-900">
                {t.label}
              </button>
            ) : (
              <span className="text-sm font-semibold text-gray-900">{t.label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


