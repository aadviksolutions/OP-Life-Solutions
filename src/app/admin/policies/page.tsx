"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Search,
  Filter,
  Plus,
  Download,
  FileSpreadsheet,
  Clock,
  Trash2,
  Edit,
  ExternalLink,
  RefreshCw,
  X,
  AlertCircle,
  FileText,
} from "lucide-react";

export default function PoliciesManagementPage() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [companyFilter, setCompanyFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    customerId: "",
    policyType: "MOTOR",
    policyNumber: "",
    insuranceCompany: "HDFC ERGO General Insurance",
    purchaseDate: new Date().toISOString().split("T")[0],
    startDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    premiumAmount: "",
    sumInsured: "",
    vehicleNumber: "",
    insuredAsset: "",
    policyStatus: "ACTIVE",
    notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (typeFilter !== "ALL") params.append("type", typeFilter);
      if (companyFilter !== "ALL") params.append("company", companyFilter);
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const res = await fetch(`/api/admin/policies?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setPolicies(json.policies || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/admin/customers");
      if (res.ok) {
        const json = await res.json();
        setCustomers(json.customers || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPolicies();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, typeFilter, companyFilter, statusFilter]);

  const handleOpenAdd = () => {
    setEditingPolicy(null);
    setFormData({
      customerId: customers[0]?.id || "",
      policyType: "MOTOR",
      policyNumber: "",
      insuranceCompany: "HDFC ERGO General Insurance",
      purchaseDate: new Date().toISOString().split("T")[0],
      startDate: new Date().toISOString().split("T")[0],
      expiryDate: "",
      premiumAmount: "",
      sumInsured: "",
      vehicleNumber: "",
      insuredAsset: "",
      policyStatus: "ACTIVE",
      notes: "",
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingPolicy(p);
    setFormData({
      customerId: p.customerId,
      policyType: p.policyType,
      policyNumber: p.policyNumber,
      insuranceCompany: p.insuranceCompany,
      purchaseDate: p.purchaseDate ? p.purchaseDate.split("T")[0] : "",
      startDate: p.startDate ? p.startDate.split("T")[0] : "",
      expiryDate: p.expiryDate ? p.expiryDate.split("T")[0] : "",
      premiumAmount: p.premiumAmount ? p.premiumAmount.toString() : "",
      sumInsured: p.sumInsured ? p.sumInsured.toString() : "",
      vehicleNumber: p.vehicleNumber || "",
      insuredAsset: p.insuredAsset || "",
      policyStatus: p.policyStatus || "ACTIVE",
      notes: p.notes || "",
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string, polNum: string) => {
    if (!confirm(`Delete policy #${polNum}?`)) return;
    try {
      const res = await fetch(`/api/admin/policies/${id}`, { method: "DELETE" });
      if (res.ok) fetchPolicies();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId || !formData.policyNumber.trim() || !formData.expiryDate) {
      setFormError("Please fill required fields (Customer, Policy Number, Expiry Date).");
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      const url = editingPolicy ? `/api/admin/policies/${editingPolicy.id}` : "/api/admin/policies";
      const method = editingPolicy ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save policy.");
      }

      setModalOpen(false);
      fetchPolicies();
    } catch (err: any) {
      setFormError(err.message || "Failed to save policy.");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = (format: "csv" | "xlsx") => {
    window.location.href = `/api/admin/export?type=policies&format=${format}`;
  };

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#06223B]">Policy Management</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Track policy schedules, insurance companies, expiry dates, and insured assets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => handleExport("xlsx")}
            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={() => handleExport("csv")}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 bg-[#D9A441] hover:bg-[#c28f30] text-[#06223B] text-xs sm:text-sm font-extrabold px-4 py-2.5 rounded-xl shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Policy</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by policy number, vehicle, customer name..."
              className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B666B]"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white"
            >
              <option value="ALL">All Policy Types</option>
              <option value="MOTOR">Motor Insurance</option>
              <option value="HEALTH">Health Insurance</option>
              <option value="LIFE">Life Insurance</option>
              <option value="TRAVEL">Travel Insurance</option>
              <option value="HOME">Home Insurance</option>
              <option value="BUSINESS">Business Insurance</option>
            </select>
          </div>

          <div>
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white"
            >
              <option value="ALL">All Insurers</option>
              <option value="Star Health & Allied Insurance">Star Health</option>
              <option value="HDFC ERGO General Insurance">HDFC ERGO</option>
              <option value="ICICI Lombard General Insurance">ICICI Lombard</option>
              <option value="Life Insurance Corporation of India (LIC)">LIC</option>
              <option value="Tata AIG General Insurance">Tata AIG</option>
              <option value="Care Health Insurance">Care Health</option>
              <option value="Bajaj Allianz General Insurance">Bajaj Allianz</option>
              <option value="The New India Assurance Co. Ltd.">New India</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="EXPIRING_SOON">EXPIRING SOON</option>
              <option value="EXPIRED">EXPIRED</option>
              <option value="PENDING">PENDING</option>
            </select>
          </div>
        </div>
      </div>

      {/* Policies Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold">
                <th className="py-3.5 px-4">Policy Number</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Type / Insurer</th>
                <th className="py-3.5 px-4">Premium & Sum</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && policies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0B666B]" />
                    <span>Loading policies...</span>
                  </td>
                </tr>
              ) : policies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No policies found matching selected filters.
                  </td>
                </tr>
              ) : (
                policies.map((p) => {
                  const isExp = p.daysRemaining < 0;
                  const isUrgent = p.daysRemaining >= 0 && p.daysRemaining <= 30;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[#06223B] block">
                          {p.policyNumber}
                        </span>
                        {(p.vehicleNumber || p.insuredAsset) && (
                          <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">
                            {p.vehicleNumber || p.insuredAsset}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <a
                          href={`/admin/customers/${p.customer.id}`}
                          className="font-bold text-[#06223B] hover:text-[#0B666B] hover:underline block"
                        >
                          {p.customer.name}
                        </a>
                        <span className="text-[11px] text-slate-400 font-mono">
                          +91 {p.customer.mobile}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 block">{p.insuranceCompany}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#06223B]/10 text-[#06223B] uppercase inline-block mt-0.5">
                          {p.policyType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#06223B] block">
                          {formatCurrency(p.premiumAmount)}
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          Cover: {formatCurrency(p.sumInsured)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-medium text-slate-800 block">
                          {new Date(p.expiryDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className={`text-[10px] font-bold ${
                          isExp ? "text-rose-600" : isUrgent ? "text-amber-700" : "text-emerald-700"
                        }`}>
                          {isExp ? `${Math.abs(p.daysRemaining)} days ago` : `${p.daysRemaining} days left`}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isExp
                            ? "bg-rose-100 text-rose-700"
                            : isUrgent
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {p.policyStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#0B666B] hover:bg-slate-100 transition"
                            title="Edit Policy"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.policyNumber)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Delete Policy"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Policy Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="p-6 bg-[#06223B] text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  {editingPolicy ? `Edit Policy #${editingPolicy.policyNumber}` : "Add New Policy"}
                </h3>
                <span className="text-xs text-[#F2C96B]">
                  Register insurance coverage and schedule
                </span>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-white hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#06223B] mb-1">
                    Select Customer *
                  </label>
                  <select
                    disabled={!!editingPolicy}
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="">-- Choose Customer --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (+91 {c.mobile}) - {c.customerId}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#06223B] mb-1">
                    Policy Type *
                  </label>
                  <select
                    value={formData.policyType}
                    onChange={(e) => setFormData({ ...formData, policyType: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="MOTOR">Motor Insurance</option>
                    <option value="HEALTH">Health Insurance</option>
                    <option value="LIFE">Life Insurance</option>
                    <option value="TRAVEL">Travel Insurance</option>
                    <option value="HOME">Home Insurance</option>
                    <option value="BUSINESS">Business Insurance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#06223B] mb-1">
                    Policy Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.policyNumber}
                    onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                    placeholder="e.g. HDFC-MOT-889911"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#06223B] mb-1">
                    Insurance Company *
                  </label>
                  <select
                    value={formData.insuranceCompany}
                    onChange={(e) => setFormData({ ...formData, insuranceCompany: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Star Health & Allied Insurance">Star Health & Allied Insurance</option>
                    <option value="HDFC ERGO General Insurance">HDFC ERGO General Insurance</option>
                    <option value="ICICI Lombard General Insurance">ICICI Lombard General Insurance</option>
                    <option value="Life Insurance Corporation of India (LIC)">Life Insurance Corporation of India (LIC)</option>
                    <option value="Tata AIG General Insurance">Tata AIG General Insurance</option>
                    <option value="Care Health Insurance">Care Health Insurance</option>
                    <option value="Bajaj Allianz General Insurance">Bajaj Allianz General Insurance</option>
                    <option value="The New India Assurance Co. Ltd.">The New India Assurance Co. Ltd.</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#06223B] mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#06223B] mb-1">Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#06223B] mb-1">Policy Status</label>
                  <select
                    value={formData.policyStatus}
                    onChange={(e) => setFormData({ ...formData, policyStatus: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="EXPIRING_SOON">EXPIRING SOON</option>
                    <option value="EXPIRED">EXPIRED</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#06223B] mb-1">Premium Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.premiumAmount}
                    onChange={(e) => setFormData({ ...formData, premiumAmount: e.target.value })}
                    placeholder="e.g. 18500"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#06223B] mb-1">Sum Insured (₹)</label>
                  <input
                    type="number"
                    value={formData.sumInsured}
                    onChange={(e) => setFormData({ ...formData, sumInsured: e.target.value })}
                    placeholder="e.g. 1500000"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#06223B] mb-1">Vehicle Number (if motor)</label>
                  <input
                    type="text"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    placeholder="CG 04 MX 1122"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#06223B] mb-1">Insured Asset Description</label>
                  <input
                    type="text"
                    value={formData.insuredAsset}
                    onChange={(e) => setFormData({ ...formData, insuredAsset: e.target.value })}
                    placeholder="e.g. Creta SX / Factory Stock / Family"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#06223B] mb-1">Policy Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional conditions, add-on covers..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
                />
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#06223B] text-white text-xs sm:text-sm font-bold shadow-md disabled:opacity-70"
                >
                  {saving ? "Saving..." : editingPolicy ? "Update Policy" : "Create Policy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
