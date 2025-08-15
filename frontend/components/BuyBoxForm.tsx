"use client";

import React from "react";
import { useAuth } from "@/components/auth/AuthProvider";

interface BuyBox {
  id?: number;
  name: string;
  industries: string[];
  location_type: string;
  allowed_locations: string[];
  min_ebitda: number | null;
  min_revenue: number | null;
  min_ebitda_multiple: number | null;
  min_purchase_price: number | null;
  max_purchase_price: number | null;
  requires_management: boolean;
  remote_ownable: boolean;
  overseas_outsourcing: boolean;
  recurring_revenue: boolean;
  low_customer_concentration: boolean;
  max_customer_concentration: number | null;
  asset_purchase: boolean;
  stock_purchase: boolean;
  seller_financing: boolean;
  sba_guidelines: boolean;
  contact_emails: string[];
  contact_phones: string[];
  contact_notes: string;
}

interface BuyBoxFormProps {
  buyBox?: BuyBox;
  onSave: (buyBox: BuyBox) => void;
  onCancel: () => void;
}

const INDUSTRY_OPTIONS = [
  "Business Services",
  "Consumer Services", 
  "Distribution",
  "Manufacturing",
  "Technology",
  "Healthcare",
  "Retail",
  "Food & Beverage",
  "Construction",
  "Transportation",
  "Real Estate",
  "Financial Services"
];

export default function BuyBoxForm({ buyBox, onSave, onCancel }: BuyBoxFormProps) {
  const { token } = useAuth();
  const [formData, setFormData] = React.useState<BuyBox>({
    name: "",
    industries: [],
    location_type: "us_only",
    allowed_locations: [],
    min_ebitda: null,
    min_revenue: null,
    min_ebitda_multiple: null,
    min_purchase_price: null,
    max_purchase_price: null,
    requires_management: false,
    remote_ownable: false,
    overseas_outsourcing: false,
    recurring_revenue: false,
    low_customer_concentration: false,
    max_customer_concentration: null,
    asset_purchase: true,
    stock_purchase: true,
    seller_financing: true,
    sba_guidelines: false,
    contact_emails: [],
    contact_phones: [],
    contact_notes: "",
    ...buyBox
  });

  const [contactEmailInput, setContactEmailInput] = React.useState("");
  const [contactPhoneInput, setContactPhoneInput] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleIndustryChange = (industry: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        industries: [...prev.industries, industry]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        industries: prev.industries.filter(i => i !== industry)
      }));
    }
  };

  const addContactEmail = () => {
    if (contactEmailInput.trim() && !formData.contact_emails.includes(contactEmailInput.trim())) {
      setFormData(prev => ({
        ...prev,
        contact_emails: [...prev.contact_emails, contactEmailInput.trim()]
      }));
      setContactEmailInput("");
    }
  };

  const removeContactEmail = (email: string) => {
    setFormData(prev => ({
      ...prev,
      contact_emails: prev.contact_emails.filter(e => e !== email)
    }));
  };

  const addContactPhone = () => {
    if (contactPhoneInput.trim() && !formData.contact_phones.includes(contactPhoneInput.trim())) {
      setFormData(prev => ({
        ...prev,
        contact_phones: [...prev.contact_phones, contactPhoneInput.trim()]
      }));
      setContactPhoneInput("");
    }
  };

  const removeContactPhone = (phone: string) => {
    setFormData(prev => ({
      ...prev,
      contact_phones: prev.contact_phones.filter(p => p !== phone)
    }));
  };

  const createAvilaPeakTemplate = async () => {
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, "");
    try {
      const res = await fetch(`${apiBase}/buy-box/template/avila-peak`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setFormData(data);
      }
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          {buyBox ? 'Edit Buy Box' : 'Create Buy Box'}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={createAvilaPeakTemplate}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Load Avila Peak Template
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buy Box Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full border rounded-md px-3 py-2"
            placeholder="e.g., Avila Peak Partners Acquisition Criteria"
          />
        </div>

        {/* Industries */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Industries
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {INDUSTRY_OPTIONS.map(industry => (
              <label key={industry} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.industries.includes(industry)}
                  onChange={(e) => handleIndustryChange(industry, e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">{industry}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Financial Criteria */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum EBITDA ($)
            </label>
            <input
              type="number"
              value={formData.min_ebitda || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, min_ebitda: e.target.value ? Number(e.target.value) : null }))}
              className="w-full border rounded-md px-3 py-2"
              placeholder="300000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Revenue ($)
            </label>
            <input
              type="number"
              value={formData.min_revenue || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, min_revenue: e.target.value ? Number(e.target.value) : null }))}
              className="w-full border rounded-md px-3 py-2"
              placeholder="1500000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum EBITDA Multiple
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.min_ebitda_multiple || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, min_ebitda_multiple: e.target.value ? Number(e.target.value) : null }))}
              className="w-full border rounded-md px-3 py-2"
              placeholder="3.0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Price Range ($)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={formData.min_purchase_price || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, min_purchase_price: e.target.value ? Number(e.target.value) : null }))}
                className="w-full border rounded-md px-3 py-2"
                placeholder="1500000"
              />
              <span className="self-center">to</span>
              <input
                type="number"
                value={formData.max_purchase_price || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, max_purchase_price: e.target.value ? Number(e.target.value) : null }))}
                className="w-full border rounded-md px-3 py-2"
                placeholder="7000000"
              />
            </div>
          </div>
        </div>

        {/* Operational Criteria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Operational Requirements
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.requires_management}
                onChange={(e) => setFormData(prev => ({ ...prev, requires_management: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm">Strong second-level management in place</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.remote_ownable}
                onChange={(e) => setFormData(prev => ({ ...prev, remote_ownable: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm">Remotely ownable operations</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.overseas_outsourcing}
                onChange={(e) => setFormData(prev => ({ ...prev, overseas_outsourcing: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm">Overseas outsourcing capabilities</span>
            </label>
          </div>
        </div>

        {/* Preferred Attributes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Attributes
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.recurring_revenue}
                onChange={(e) => setFormData(prev => ({ ...prev, recurring_revenue: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm">Recurring revenue models</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.low_customer_concentration}
                onChange={(e) => setFormData(prev => ({ ...prev, low_customer_concentration: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm">Low customer concentration</span>
            </label>
          </div>
          {formData.low_customer_concentration && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Customer Concentration (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={formData.max_customer_concentration || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, max_customer_concentration: e.target.value ? Number(e.target.value) : null }))}
                className="w-32 border rounded-md px-3 py-2"
                placeholder="0.25"
              />
              <span className="ml-2 text-sm text-gray-500">(e.g., 0.25 for 25%)</span>
            </div>
          )}
        </div>

        {/* Deal Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deal Types
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.asset_purchase}
                onChange={(e) => setFormData(prev => ({ ...prev, asset_purchase: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm">Asset purchases</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.stock_purchase}
                onChange={(e) => setFormData(prev => ({ ...prev, stock_purchase: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm">Stock purchases</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.seller_financing}
                onChange={(e) => setFormData(prev => ({ ...prev, seller_financing: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm">Open to seller financing</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.sba_guidelines}
                onChange={(e) => setFormData(prev => ({ ...prev, sba_guidelines: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm">Per SBA guidelines</span>
            </label>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Emails
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="email"
              value={contactEmailInput}
              onChange={(e) => setContactEmailInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addContactEmail())}
              className="flex-1 border rounded-md px-3 py-2"
              placeholder="Add contact email"
            />
            <button
              type="button"
              onClick={addContactEmail}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.contact_emails.map(email => (
              <span key={email} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-sm">
                {email}
                <button
                  type="button"
                  onClick={() => removeContactEmail(email)}
                  className="ml-1 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Contact Phone Numbers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Phone Numbers
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="tel"
              value={contactPhoneInput}
              onChange={(e) => setContactPhoneInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addContactPhone())}
              className="flex-1 border rounded-md px-3 py-2"
              placeholder="Add contact phone number"
            />
            <button
              type="button"
              onClick={addContactPhone}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.contact_phones.map(phone => (
              <span key={phone} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-sm">
                {phone}
                <button
                  type="button"
                  onClick={() => removeContactPhone(phone)}
                  className="ml-1 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Notes
          </label>
          <textarea
            value={formData.contact_notes}
            onChange={(e) => setFormData(prev => ({ ...prev, contact_notes: e.target.value }))}
            className="w-full border rounded-md px-3 py-2"
            rows={3}
            placeholder="Additional notes about the buyer or acquisition criteria"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            {buyBox ? 'Update' : 'Create'} Buy Box
          </button>
        </div>
      </form>
    </div>
  );
}
