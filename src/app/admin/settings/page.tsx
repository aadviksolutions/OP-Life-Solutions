"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Shield,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Key,
  Bell,
  RefreshCw,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState<any>({
    companyName: "",
    tagline: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    city: "Raipur",
    state: "Chhattisgarh",
    pincode: "492004",
    workingHours: "",
    heroHeadline: "",
    heroSubheading: "",
    yearsExperience: "",
    customersServed: "",
    claimsSupportRate: "",
    smsEnabled: false,
    smsApiKey: "",
    smsSenderId: "",
    whatsappEnabled: false,
    whatsappApiKey: "",
    emailEnabled: false,
    emailApiKey: "",
    emailFrom: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const json = await res.json();
        if (json.settings) {
          setFormData(json.settings);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to update settings");
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-[#0B666B] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-[#06223B]">Agency Configuration & Settings</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Update agency brand identity, contact numbers, public statistics, and notification gateways.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Card 1: Brand & Contact Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Shield className="w-5 h-5 text-[#D9A441]" />
            <h3 className="font-extrabold text-base text-[#06223B]">
              Agency Information & Public Contact
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#06223B] mb-1">Company Name</label>
              <input
                type="text"
                value={formData.companyName || ""}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#06223B] mb-1">Brand Tagline</label>
              <input
                type="text"
                value={formData.tagline || ""}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 font-semibold text-[#D9A441]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#06223B] mb-1">Primary Phone</label>
              <input
                type="text"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#06223B] mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={formData.whatsapp || ""}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#06223B] mb-1">Official Email</label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#06223B] mb-1">Office Address</label>
              <input
                type="text"
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#06223B] mb-1">Working Hours</label>
              <input
                type="text"
                value={formData.workingHours || ""}
                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Hero & Trust Statistics (Required by prompt: Editable from Admin Settings) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Clock className="w-5 h-5 text-[#0B666B]" />
            <h3 className="font-extrabold text-base text-[#06223B]">
              Hero Banner & Trust Statistics
            </h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#06223B] mb-1">Hero Headline</label>
            <input
              type="text"
              value={formData.heroHeadline || ""}
              onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#06223B] mb-1">Hero Subheading</label>
            <textarea
              rows={2}
              value={formData.heroSubheading || ""}
              onChange={(e) => setFormData({ ...formData, heroSubheading: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#06223B] mb-1">Years of Trust</label>
              <input
                type="text"
                value={formData.yearsExperience || ""}
                onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                placeholder="15+"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 font-bold text-[#D9A441]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#06223B] mb-1">Customers Served</label>
              <input
                type="text"
                value={formData.customersServed || ""}
                onChange={(e) => setFormData({ ...formData, customersServed: e.target.value })}
                placeholder="2500+"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 font-bold text-[#0B666B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#06223B] mb-1">Customer Support Rate</label>
              <input
                type="text"
                value={formData.claimsSupportRate || ""}
                onChange={(e) => setFormData({ ...formData, claimsSupportRate: e.target.value })}
                placeholder="99.4%"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 font-bold text-[#06223B]"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Notification Gateways Architecture */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-5 h-5 text-[#06223B]" />
            <h3 className="font-extrabold text-base text-[#06223B]">
              SMS, WhatsApp & Email Gateway Configuration
            </h3>
          </div>

          <p className="text-xs text-slate-500">
            Configure third-party gateways for automatic reminder dispatches. Gateways stay dormant until valid API credentials are supplied.
          </p>

          <div className="space-y-4">
            {/* WhatsApp */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#06223B]">WhatsApp Business API</span>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.whatsappEnabled || false}
                    onChange={(e) => setFormData({ ...formData, whatsappEnabled: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0B666B]"
                  />
                  <span>Active</span>
                </label>
              </div>
              <input
                type="password"
                value={formData.whatsappApiKey || ""}
                onChange={(e) => setFormData({ ...formData, whatsappApiKey: e.target.value })}
                placeholder="Enter WhatsApp API Token / Secret"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
              />
            </div>

            {/* SMS */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#06223B]">SMS Provider (DLT Compliant)</span>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.smsEnabled || false}
                    onChange={(e) => setFormData({ ...formData, smsEnabled: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0B666B]"
                  />
                  <span>Active</span>
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="password"
                  value={formData.smsApiKey || ""}
                  onChange={(e) => setFormData({ ...formData, smsApiKey: e.target.value })}
                  placeholder="SMS Gateway API Key"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  value={formData.smsSenderId || ""}
                  onChange={(e) => setFormData({ ...formData, smsSenderId: e.target.value })}
                  placeholder="Sender ID (e.g. OPSSAH)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Messages */}
        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2 animate-fadeIn font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Settings updated successfully! Changes are live across the website.</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2 animate-fadeIn font-semibold">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#06223B] hover:bg-[#0B314D] text-white text-sm font-extrabold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
          >
            <Save className="w-4 h-4 text-[#F2C96B]" />
            <span>{saving ? "Saving Changes..." : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
