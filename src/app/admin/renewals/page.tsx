"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Phone,
  Mail,
  RefreshCw,
  X,
  FileSpreadsheet,
  Download,
  ShieldCheck,
  Send,
} from "lucide-react";

export default function RenewalsManagementPage() {
  const [renewals, setRenewals] = useState<any[]>([]);
  const [counts, setCounts] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Filters
  const [filter, setFilter] = useState("ALL"); // ALL, 7_DAYS, 15_DAYS, 30_DAYS, EXPIRED
  const [search, setSearch] = useState("");

  // Reminder Dispatch Modal
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [channel, setChannel] = useState("WHATSAPP");
  const [customMsg, setCustomMsg] = useState("");
  const [sending, setSending] = useState(false);

  const fetchRenewals = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/renewals?filter=${filter}&search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const json = await res.json();
        setRenewals(json.renewals || []);
        setCounts(json.counts || {});
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRenewals();
    }, 250);
    return () => clearTimeout(timer);
  }, [filter, search]);

  const handleOpenReminder = (pol: any) => {
    setSelectedPolicy(pol);
    const expDate = new Date(pol.expiryDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const isExp = pol.daysRemaining < 0;
    const msg = isExp
      ? `Namaste ${pol.customer.name} ji, this is an urgent reminder from Om Prakash Sahu Insurance Services. Your ${pol.insuranceCompany} ${pol.policyType} policy (#${pol.policyNumber}) expired on ${expDate}. Please contact us at +91 98261 45892 for immediate renewal and break-in avoidance.`
      : `Namaste ${pol.customer.name} ji, reminder from Om Prakash Sahu Insurance Services regarding your ${pol.insuranceCompany} ${pol.policyType} policy (#${pol.policyNumber}) due for renewal on ${expDate} (in ${pol.daysRemaining} days). Kindly connect with us at +91 98261 45892 for seamless cashless renewal.`;

    setCustomMsg(msg);
  };

  const handleSendReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPolicy) return;

    setSending(true);
    try {
      const res = await fetch("/api/admin/renewals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          policyId: selectedPolicy.id,
          channel,
          customMessage: customMsg,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.whatsappUrl && channel === "WHATSAPP") {
          window.open(data.whatsappUrl, "_blank");
        } else {
          alert(data.message || "Reminder sent successfully");
        }
        setSelectedPolicy(null);
        fetchRenewals();
      } else {
        alert(data.error || "Failed to dispatch reminder");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const handleExport = (format: "csv" | "xlsx") => {
    window.location.href = `/api/admin/export?type=renewals&format=${format}`;
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Title & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9A441]/10 text-[#06223B] text-xs font-bold uppercase tracking-wider mb-1">
            <Clock className="w-3.5 h-3.5 text-[#D9A441]" />
            <span>Core Agency Engine</span>
          </div>
          <h2 className="text-2xl font-black text-[#06223B]">Renewals & Reminders Tracker</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Track policy expiry timelines, send automated reminders, and maintain zero-lapse retention.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleExport("xlsx")}
            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => handleExport("csv")}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition"
          >
            <Download className="w-4 h-4" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs with Dynamic Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setFilter("ALL")}
          className={`p-3.5 rounded-2xl border text-left transition ${
            filter === "ALL"
              ? "bg-[#06223B] text-white border-[#06223B] shadow-md"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <span className="text-xs font-bold block opacity-80">All Policies</span>
          <span className="text-xl font-black block mt-0.5">{counts.total || 0}</span>
        </button>

        <button
          onClick={() => setFilter("7_DAYS")}
          className={`p-3.5 rounded-2xl border text-left transition ${
            filter === "7_DAYS"
              ? "bg-amber-500 text-slate-950 border-amber-600 shadow-md font-bold"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <span className="text-xs font-bold block text-amber-700">Due in 7 Days</span>
          <span className="text-xl font-black block mt-0.5 text-amber-900">{counts.expiring7 || 0}</span>
        </button>

        <button
          onClick={() => setFilter("15_DAYS")}
          className={`p-3.5 rounded-2xl border text-left transition ${
            filter === "15_DAYS"
              ? "bg-[#D9A441] text-[#06223B] border-[#D9A441] shadow-md font-bold"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <span className="text-xs font-bold block text-amber-700">Due in 15 Days</span>
          <span className="text-xl font-black block mt-0.5 text-slate-800">{counts.expiring15 || 0}</span>
        </button>

        <button
          onClick={() => setFilter("30_DAYS")}
          className={`p-3.5 rounded-2xl border text-left transition ${
            filter === "30_DAYS"
              ? "bg-[#0B666B] text-white border-[#0B666B] shadow-md"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <span className="text-xs font-bold block opacity-80">Due in 30 Days</span>
          <span className="text-xl font-black block mt-0.5">{counts.expiring30 || 0}</span>
        </button>

        <button
          onClick={() => setFilter("EXPIRED")}
          className={`p-3.5 rounded-2xl border text-left transition ${
            filter === "EXPIRED"
              ? "bg-rose-600 text-white border-rose-600 shadow-md"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <span className="text-xs font-bold block text-rose-600">Expired</span>
          <span className="text-xl font-black block mt-0.5 text-rose-700">{counts.expired || 0}</span>
        </button>
      </div>

      {/* Search and Refresh */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, mobile, or policy number..."
            className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B666B]"
          />
        </div>
        <button
          onClick={fetchRenewals}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Renewals Table with Status Colors: Green = Active, Gold = Expiring Soon, Red = Expired */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Mobile</th>
                <th className="py-3.5 px-4">Policy Number</th>
                <th className="py-3.5 px-4">Type / Insurer</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4">Days Remaining</th>
                <th className="py-3.5 px-4">Reminder Status</th>
                <th className="py-3.5 px-4">Last Reminder</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && renewals.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0B666B]" />
                    <span>Loading renewal data...</span>
                  </td>
                </tr>
              ) : renewals.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400">
                    No renewals found for this filter.
                  </td>
                </tr>
              ) : (
                renewals.map((r) => {
                  const isExpired = r.daysRemaining < 0;
                  const isExpiringSoon = r.daysRemaining >= 0 && r.daysRemaining <= 30;

                  return (
                    <tr
                      key={r.id}
                      className={`hover:bg-slate-50/80 transition ${
                        isExpired
                          ? "bg-rose-50/20"
                          : isExpiringSoon
                          ? "bg-amber-50/20"
                          : ""
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <a
                          href={`/admin/customers/${r.customer.id}`}
                          className="font-bold text-[#06223B] hover:text-[#0B666B] hover:underline"
                        >
                          {r.customer.name}
                        </a>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700 whitespace-nowrap">
                        +91 {r.customer.mobile}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {r.policyNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 block">{r.insuranceCompany}</span>
                        <span className="text-[10px] text-slate-500 uppercase">{r.policyType}</span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-800">
                        {formatDate(r.expiryDate)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {/* Status Colors matching user prompt requirement: Green = Active, Gold = Expiring Soon, Red = Expired */}
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black ${
                            isExpired
                              ? "bg-rose-100 text-rose-700 border border-rose-200"
                              : isExpiringSoon
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          }`}
                        >
                          {isExpired
                            ? `${Math.abs(r.daysRemaining)} Days Expired`
                            : `${r.daysRemaining} Days Left`}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {r.nextReminder ? (
                          <span className="text-amber-700 font-semibold text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Scheduled ({r.nextReminder.reminderType})</span>
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-medium text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Up to date</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {r.lastReminder ? (
                          <div>
                            <span className="font-semibold text-slate-700 block">
                              {r.lastReminder.channel} ({formatDate(r.lastReminder.sentAt)})
                            </span>
                            <span className="text-[10px] text-emerald-700">{r.lastReminder.status}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None sent</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleOpenReminder(r)}
                          className="inline-flex items-center gap-1.5 bg-[#0B666B] hover:bg-[#07474B] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition"
                        >
                          <Send className="w-3 h-3 text-[#F2C96B]" />
                          <span>Send Reminder</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatch Reminder Modal */}
      {selectedPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 bg-[#06223B] text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Dispatch Renewal Notice</h3>
                <span className="text-xs text-[#F2C96B]">
                  To: {selectedPolicy.customer.name} (+91 {selectedPolicy.customer.mobile})
                </span>
              </div>
              <button
                onClick={() => setSelectedPolicy(null)}
                className="text-white hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendReminder} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#06223B] mb-1.5">
                  Select Notification Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setChannel("WHATSAPP")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      channel === "WHATSAPP"
                        ? "bg-[#0B666B] text-white border-[#0B666B]"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel("SMS")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      channel === "SMS"
                        ? "bg-[#06223B] text-white border-[#06223B]"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>SMS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel("EMAIL")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      channel === "EMAIL"
                        ? "bg-[#D9A441] text-[#06223B] border-[#D9A441]"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#06223B] mb-1.5">
                  Reminder Message Body
                </label>
                <textarea
                  rows={4}
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B666B] text-slate-800"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-500">
                <span className="font-bold text-slate-700">Note:</span> WhatsApp links open directly in WhatsApp Web with pre-formatted text. All reminders are archived in client reminder history.
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPolicy(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-5 py-2 rounded-xl bg-[#0B666B] hover:bg-[#07474B] text-white text-xs sm:text-sm font-bold shadow-md disabled:opacity-70 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sending ? "Sending..." : "Dispatch & Record"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
