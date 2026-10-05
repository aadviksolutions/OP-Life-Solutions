"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  Printer,
  ShieldCheck,
  Users,
  Clock,
  Calendar,
  RefreshCw,
  PieChart,
} from "lucide-react";

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleExport = (type: string, format: "csv" | "xlsx") => {
    window.location.href = `/api/admin/export?type=${type}&format=${format}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-[#0B666B] animate-spin" />
      </div>
    );
  }

  const s = data?.summary || {};
  const byType = data?.distribution?.byType || {};
  const byCompany = data?.distribution?.byCompany || {};

  return (
    <div className="space-y-8 animate-fadeIn print:p-0">
      {/* Header and Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-black text-[#06223B]">Operational Reports & Analytics</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Portfolio summaries, insurance company allocation, and customer retention metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          <button
            onClick={() => handleExport("policies", "xlsx")}
            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Policies (Excel)</span>
          </button>

          <button
            onClick={() => handleExport("customers", "xlsx")}
            className="inline-flex items-center gap-1.5 bg-[#06223B] hover:bg-[#0B314D] text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Customers (Excel)</span>
          </button>
        </div>
      </div>

      {/* Print Title Header */}
      <div className="hidden print:block text-center border-b pb-4 mb-6">
        <h1 className="text-2xl font-black">OM PRAKASH SAHU INSURANCE SERVICES</h1>
        <p className="text-xs">Agency Portfolio & Policy Retention Report — Raipur, Chhattisgarh</p>
        <p className="text-[10px] text-slate-400">Generated on: {new Date().toLocaleDateString("en-IN")}</p>
      </div>

      {/* Summary Matrix Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Total Insured Portfolio
          </span>
          <div className="text-3xl font-black text-[#06223B] mt-1">
            {s.totalPolicies || 0} Policies
          </div>
          <span className="text-xs text-[#0B666B] font-semibold mt-1 block">
            Across {s.totalCustomers || 0} Verified Clients
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            In-Force Active Protection
          </span>
          <div className="text-3xl font-black text-emerald-700 mt-1">
            {s.activePolicies || 0} Active
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {((s.activePolicies / (s.totalPolicies || 1)) * 100).toFixed(0)}% Healthy Portfolio
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Expiries in Next 30 Days
          </span>
          <div className="text-3xl font-black text-amber-600 mt-1">
            {s.expiringSoon || 0} Due
          </div>
          <span className="text-xs text-amber-700 font-semibold mt-1 block">
            Immediate Follow-up Required
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Total Premium Value
          </span>
          <div className="text-2xl font-black text-[#06223B] mt-1">
            {formatCurrency(s.totalPremium || 0)}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            Sum Insured: {formatCurrency(s.totalSumInsured || 0)}
          </span>
        </div>
      </div>

      {/* Two Column Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Breakdown by Insurance Type */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-[#06223B]">
                Distribution by Insurance Category
              </h3>
              <p className="text-xs text-slate-500">Breakdown of active policy types</p>
            </div>
            <PieChart className="w-5 h-5 text-[#0B666B]" />
          </div>

          <div className="space-y-4 pt-2">
            {Object.entries(byType).map(([type, count]: any) => {
              const pct = Math.round((count / (s.totalPolicies || 1)) * 100);
              return (
                <div key={type} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-bold text-slate-800">{type} Insurance</span>
                    <span className="text-slate-600 font-semibold">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-[#0B666B] h-2.5 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Breakdown by Insurance Company */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-[#06223B]">
                Distribution by Insurance Company
              </h3>
              <p className="text-xs text-slate-500">Insurer tie-up volume & placement</p>
            </div>
            <BarChart3 className="w-5 h-5 text-[#D9A441]" />
          </div>

          <div className="space-y-4 pt-2">
            {Object.entries(byCompany).map(([comp, count]: any) => {
              const pct = Math.round((count / (s.totalPolicies || 1)) * 100);
              return (
                <div key={comp} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-bold text-slate-800 truncate pr-2">{comp}</span>
                    <span className="text-slate-600 font-semibold shrink-0">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-[#D9A441] h-2.5 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
