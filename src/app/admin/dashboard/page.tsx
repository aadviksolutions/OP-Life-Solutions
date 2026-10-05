"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Calendar,
  MessageSquare,
  ArrowUpRight,
  Plus,
  RefreshCw,
  FileText,
  Download,
  Phone,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

export default function AdminDashboardPage() {
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
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#0B666B] animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Loading agency dashboard metrics...</span>
        </div>
      </div>
    );
  }

  const s = data?.summary || {};

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner with Quick Actions */}
      <div className="bg-gradient-to-r from-[#06223B] via-[#0B314D] to-[#07474B] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#D9A441]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="inline-block text-xs font-bold text-[#F2C96B] uppercase tracking-wider mb-1">
            Executive Overview
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome, Om Prakash Sahu
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Here is your live policy pipeline, upcoming renewals, and client activity for Raipur & Chhattisgarh operations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/admin/customers"
            className="inline-flex items-center gap-1.5 bg-[#D9A441] hover:bg-[#c49232] text-[#06223B] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </a>
          <a
            href="/admin/policies"
            className="inline-flex items-center gap-1.5 bg-[#0B666B] hover:bg-[#07474B] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Policy</span>
          </a>
          <button
            onClick={fetchStats}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards required by user prompt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Customers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Customers
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#06223B] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#06223B]">{s.totalCustomers || 0}</div>
          <a href="/admin/customers" className="text-[11px] font-semibold text-[#0B666B] hover:underline mt-1 inline-flex items-center gap-0.5">
            View All <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

        {/* Active Policies */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Policies
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700">{s.activePolicies || 0}</div>
          <span className="text-[11px] font-medium text-slate-400 mt-1 block">In-force protection</span>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Expiring Soon
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#D9A441]" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700">{s.expiringSoon || 0}</div>
          <a href="/admin/renewals?filter=30_DAYS" className="text-[11px] font-semibold text-amber-800 hover:underline mt-1 inline-flex items-center gap-0.5">
            Within 30 Days <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

        {/* Expired Policies */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
              Expired Policies
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600">{s.expiredPolicies || 0}</div>
          <a href="/admin/renewals?filter=EXPIRED" className="text-[11px] font-semibold text-rose-700 hover:underline mt-1 inline-flex items-center gap-0.5">
            Urgent Renewal <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

        {/* Renewals This Month */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              This Month
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#0B666B]/10 text-[#0B666B] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#06223B]">{s.renewalsThisMonth || 0}</div>
          <span className="text-[11px] font-medium text-slate-400 mt-1 block">Due by month-end</span>
        </div>

        {/* Pending Follow-ups */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Follow-ups
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-700">{s.pendingFollowups || 0}</div>
          <a href="/admin/enquiries" className="text-[11px] font-semibold text-purple-700 hover:underline mt-1 inline-flex items-center gap-0.5">
            Enquiries & Reminders <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Financial Portfolio Summary Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Annual Premium Under Management (APUM)
          </span>
          <div className="text-3xl font-black text-[#06223B] mt-0.5">
            {formatCurrency(s.totalPremium || 0)}
          </div>
        </div>
        <div className="sm:text-right">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Total In-Force Sum Insured
          </span>
          <div className="text-2xl font-black text-[#0B666B] mt-0.5">
            {formatCurrency(s.totalSumInsured || 0)}
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Expiries & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upcoming Expiries Watchlist */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-extrabold text-[#06223B]">
                Upcoming Policy Expiries & Renewals
              </h3>
              <p className="text-xs text-slate-500">Sorted by immediate expiry urgency</p>
            </div>
            <a
              href="/admin/renewals"
              className="text-xs font-bold text-[#0B666B] hover:underline inline-flex items-center gap-1"
            >
              <span>View Full Tracker</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                  <th className="py-3 px-2">Customer</th>
                  <th className="py-3 px-2">Policy No</th>
                  <th className="py-3 px-2">Type / Company</th>
                  <th className="py-3 px-2">Expiry</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(!data?.upcomingExpiries || data.upcomingExpiries.length === 0) ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">
                      No policies found.
                    </td>
                  </tr>
                ) : (
                  data.upcomingExpiries.map((p: any) => {
                    const isExp = p.daysRemaining < 0;
                    const isUrgent = p.daysRemaining >= 0 && p.daysRemaining <= 15;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-2">
                          <span className="font-bold text-slate-800 block">{p.customerName}</span>
                          <span className="text-[11px] text-slate-400 font-mono">+91 {p.mobile}</span>
                        </td>
                        <td className="py-3 px-2 font-mono font-medium text-slate-700">
                          {p.policyNumber}
                        </td>
                        <td className="py-3 px-2">
                          <span className="font-bold text-[#06223B] block">{p.insuranceCompany}</span>
                          <span className="text-[10px] text-slate-500 uppercase">{p.policyType}</span>
                        </td>
                        <td className="py-3 px-2 whitespace-nowrap">
                          <span className="block font-medium text-slate-700">
                            {new Date(p.expiryDate).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span className={`text-[10px] font-bold ${
                            isExp ? "text-rose-600" : isUrgent ? "text-amber-700" : "text-emerald-700"
                          }`}>
                            {isExp ? `${Math.abs(p.daysRemaining)} days ago` : `in ${p.daysRemaining} days`}
                          </span>
                        </td>
                        <td className="py-3 px-2 whitespace-nowrap">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            isExp
                              ? "bg-rose-100 text-rose-700"
                              : isUrgent
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}>
                            {p.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right whitespace-nowrap">
                          <a
                            href={`https://api.whatsapp.com/send?phone=91${p.mobile}&text=${encodeURIComponent(
                              `Namaste ${p.customerName} ji, reminder from Om Prakash Sahu Insurance Services: Your ${p.insuranceCompany} ${p.policyType} policy #${p.policyNumber} is due for renewal. Please contact +91 98261 45892.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-[#0B666B] hover:bg-[#07474B] text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold transition"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Category Distribution & Recent Enquiries */}
        <div className="lg:col-span-4 space-y-6">
          {/* Portfolio by Insurance Type */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-sm font-extrabold text-[#06223B]">
              Policies by Insurance Category
            </h4>
            <div className="space-y-3">
              {Object.entries(data?.distribution?.byType || {}).map(([type, count]: any) => (
                <div key={type} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{type} Insurance</span>
                    <span className="font-bold text-[#06223B]">{count} policies</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#0B666B] to-[#D9A441] h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, (count / (s.totalPolicies || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Web Enquiries */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-sm font-extrabold text-[#06223B]">Recent Web Enquiries</h4>
              <a href="/admin/enquiries" className="text-xs text-[#0B666B] font-bold hover:underline">
                View All
              </a>
            </div>

            <div className="space-y-3">
              {(!data?.recentEnquiries || data.recentEnquiries.length === 0) ? (
                <p className="text-xs text-slate-400">No new enquiries</p>
              ) : (
                data.recentEnquiries.map((enq: any) => (
                  <div key={enq.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{enq.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {enq.insuranceType}
                      </span>
                    </div>
                    <p className="text-slate-500 truncate">{enq.message}</p>
                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                      <span>+91 {enq.mobile}</span>
                      <a
                        href={`https://api.whatsapp.com/send?phone=91${enq.mobile}&text=${encodeURIComponent(
                          `Namaste ${enq.name} ji, thank you for inquiring about ${enq.insuranceType} with Om Prakash Sahu Insurance Services.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0B666B] font-bold hover:underline"
                      >
                        Reply WhatsApp
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
