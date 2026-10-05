"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  Trash2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

export default function EnquiriesManagementPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/enquiries?status=${statusFilter}`);
      if (res.ok) {
        const json = await res.json();
        setEnquiries(json.enquiries || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchEnquiries();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
      if (res.ok) fetchEnquiries();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#06223B]">Website Enquiries & Leads</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Messages and quote requests submitted via website contact form.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New Enquiries</option>
            <option value="CONTACTED">Contacted</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CLOSED">Closed / Converted</option>
          </select>

          <button
            onClick={fetchEnquiries}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Enquiries List */}
      <div className="space-y-4">
        {loading && enquiries.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0B666B]" />
            <span>Loading enquiries...</span>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400">
            No enquiries found for this status.
          </div>
        ) : (
          enquiries.map((enq) => {
            const waPhone = enq.mobile.replace(/\D/g, "");
            const fullPhone = waPhone.startsWith("91") ? waPhone : "91" + waPhone;
            const waUrl = `https://api.whatsapp.com/send?phone=${fullPhone}&text=${encodeURIComponent(
              `Namaste ${enq.name} ji, thank you for reaching out to Om Prakash Sahu Insurance Services regarding ${enq.insuranceType}. How can I assist you?`
            )}`;

            return (
              <div
                key={enq.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#06223B]/10 text-[#06223B] font-black flex items-center justify-center text-sm">
                      {enq.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-[#06223B]">{enq.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>+91 {enq.mobile}</span>
                        {enq.email && <span>• {enq.email}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                      {enq.insuranceType}
                    </span>

                    <select
                      value={enq.status}
                      onChange={(e) => handleUpdateStatus(enq.id, e.target.value)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border transition cursor-pointer ${
                        enq.status === "NEW"
                          ? "bg-amber-100 text-amber-800 border-amber-300"
                          : enq.status === "CONTACTED"
                          ? "bg-blue-100 text-blue-800 border-blue-300"
                          : enq.status === "IN_PROGRESS"
                          ? "bg-purple-100 text-purple-800 border-purple-300"
                          : "bg-emerald-100 text-emerald-800 border-emerald-300"
                      }`}
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>

                    <button
                      onClick={() => handleDelete(enq.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">Inquiry Message:</span>
                  {enq.message}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-2">
                  <span className="text-slate-400">
                    Received on {new Date(enq.createdAt).toLocaleString("en-IN")}
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#0B666B] hover:bg-[#07474B] text-white font-bold px-3.5 py-2 rounded-xl transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Reply on WhatsApp</span>
                    </a>

                    <a
                      href={`tel:+91${enq.mobile}`}
                      className="inline-flex items-center gap-1.5 bg-[#06223B] hover:bg-[#0B314D] text-white font-bold px-3.5 py-2 rounded-xl transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#D9A441]" />
                      <span>Call Client</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
