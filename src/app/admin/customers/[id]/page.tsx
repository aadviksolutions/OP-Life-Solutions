"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Shield,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Upload,
  Plus,
  Clock,
  MessageSquare,
  AlertTriangle,
  Download,
  ExternalLink,
  Trash2,
  Edit,
  ArrowLeft,
  RefreshCw,
  X,
  CheckCircle2,
} from "lucide-react";

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [addPolicyModal, setAddPolicyModal] = useState(false);
  const [uploadDocModal, setUploadDocModal] = useState(false);
  const [reminderModal, setReminderModal] = useState<any>(null); // policy to remind

  // Policy Form State
  const [policyForm, setPolicyForm] = useState({
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

  // Doc Form State
  const [docTitle, setDocTitle] = useState("");
  const [docPolicyId, setDocPolicyId] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);

  // Reminder Custom Text
  const [reminderChannel, setReminderChannel] = useState("WHATSAPP");
  const [reminderCustomMsg, setReminderCustomMsg] = useState("");

  const [saving, setSaving] = useState(false);

  const fetchCustomer = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/customers/${id}`);
      if (res.ok) {
        const json = await res.json();
        setCustomer(json.customer);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const handleAddPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...policyForm,
          customerId: customer.id,
        }),
      });
      if (res.ok) {
        setAddPolicyModal(false);
        setPolicyForm({
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
        fetchCustomer();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create policy");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFile || !docTitle) {
      alert("Please enter title and select file");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("file", docFile);
      fd.append("title", docTitle);
      fd.append("customerId", customer.id);
      if (docPolicyId) fd.append("policyId", docPolicyId);

      const res = await fetch("/api/admin/documents", {
        method: "POST",
        body: fd,
      });

      if (res.ok) {
        setUploadDocModal(false);
        setDocTitle("");
        setDocFile(null);
        fetchCustomer();
      } else {
        alert("Upload failed");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleSendReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderModal) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/renewals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          policyId: reminderModal.id,
          channel: reminderChannel,
          customMessage: reminderCustomMsg,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.whatsappUrl && reminderChannel === "WHATSAPP") {
          window.open(data.whatsappUrl, "_blank");
        } else {
          alert(data.message || "Reminder sent");
        }
        setReminderModal(null);
        fetchCustomer();
      } else {
        alert(data.error || "Failed to send reminder");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePolicy = async (polId: string, polNum: string) => {
    if (!confirm(`Delete policy ${polNum}?`)) return;
    try {
      const res = await fetch(`/api/admin/policies/${polId}`, { method: "DELETE" });
      if (res.ok) fetchCustomer();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteDoc = async (docId: string, docTitle: string) => {
    if (!confirm(`Delete document "${docTitle}"?`)) return;
    try {
      const res = await fetch(`/api/admin/documents/${docId}`, { method: "DELETE" });
      if (res.ok) fetchCustomer();
    } catch (e) {
      console.error(e);
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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

  if (!customer) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-3xl">
        Customer not found. <a href="/admin/customers" className="text-[#0B666B] underline">Return to list</a>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Bar with Back Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <a
            href="/admin/customers"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#06223B] hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-[#06223B]">{customer.name}</h2>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800">
                {customer.customerId}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Registered on {formatDate(customer.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setAddPolicyModal(true)}
            className="inline-flex items-center gap-1.5 bg-[#D9A441] hover:bg-[#c28f30] text-[#06223B] text-xs sm:text-sm font-extrabold px-4 py-2.5 rounded-xl shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Policy</span>
          </button>

          <button
            onClick={() => setUploadDocModal(true)}
            className="inline-flex items-center gap-1.5 bg-[#06223B] hover:bg-[#0B314D] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition"
          >
            <Upload className="w-4 h-4 text-[#F2C96B]" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Customer Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Customer Profile & Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs sm:text-sm">
          <div>
            <span className="text-slate-400 block text-xs">Primary Mobile</span>
            <div className="font-bold text-[#06223B] flex items-center gap-1.5 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-[#0B666B]" />
              <span>+91 {customer.mobile}</span>
            </div>
            {customer.alternateMobile && (
              <span className="text-xs text-slate-500 block mt-0.5">
                Alt: +91 {customer.alternateMobile}
              </span>
            )}
          </div>

          <div>
            <span className="text-slate-400 block text-xs">Email Address</span>
            <div className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-[#D9A441]" />
              <span>{customer.email || "Not provided"}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-xs">City & State</span>
            <div className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#0B666B]" />
              <span>{customer.city || "Raipur"}, {customer.state || "Chhattisgarh"} {customer.pincode ? `(${customer.pincode})` : ""}</span>
            </div>
            {customer.address && (
              <span className="text-xs text-slate-500 block mt-0.5 truncate">
                {customer.address}
              </span>
            )}
          </div>

          <div>
            <span className="text-slate-400 block text-xs">Advisor Notes</span>
            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-1">
              {customer.notes || "No notes added yet."}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Policies Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#06223B]">
              Active & Historic Policies ({customer.policies?.length || 0})
            </h3>
            <p className="text-xs text-slate-500">
              Policies registered under this customer account
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {(!customer.policies || customer.policies.length === 0) ? (
            <div className="bg-white p-8 rounded-3xl text-center border border-slate-200 text-slate-400 text-sm">
              No policies registered for this customer yet. Click &quot;Add Policy&quot; above to create one.
            </div>
          ) : (
            customer.policies.map((p: any) => {
              const now = new Date();
              const diffTime = new Date(p.expiryDate).getTime() - now.getTime();
              const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              const isExpired = daysRemaining < 0;
              const isUrgent = daysRemaining >= 0 && daysRemaining <= 30;

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#06223B]/10 text-[#06223B] uppercase">
                          {p.policyType}
                        </span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          isExpired
                            ? "bg-rose-100 text-rose-700"
                            : isUrgent
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {isExpired ? "EXPIRED" : isUrgent ? "EXPIRING SOON" : "ACTIVE"}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-600">
                          #{p.policyNumber}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-[#06223B]">
                        {p.insuranceCompany}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setReminderModal(p);
                          setReminderCustomMsg(
                            `Namaste ${customer.name} ji, reminder from Om Prakash Sahu Insurance Services regarding your ${p.insuranceCompany} ${p.policyType} policy #${p.policyNumber} due on ${formatDate(p.expiryDate)}. Call +91 98261 45892 for renewal.`
                          );
                        }}
                        className="inline-flex items-center gap-1.5 bg-[#0B666B] hover:bg-[#07474B] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition"
                      >
                        <Clock className="w-3.5 h-3.5 text-[#F2C96B]" />
                        <span>Send Reminder</span>
                      </button>

                      <button
                        onClick={() => handleDeletePolicy(p.id, p.policyNumber)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-100"
                        title="Delete Policy"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-slate-400 block text-xs">Start Date</span>
                      <span className="font-bold text-slate-800">{formatDate(p.startDate)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-xs">Expiry Date</span>
                      <span className={`font-bold ${isExpired ? "text-rose-600" : isUrgent ? "text-amber-700" : "text-slate-800"}`}>
                        {formatDate(p.expiryDate)} ({isExpired ? `${Math.abs(daysRemaining)} days ago` : `${daysRemaining} days left`})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-xs">Premium Amount</span>
                      <span className="font-black text-[#06223B]">{formatCurrency(p.premiumAmount)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-xs">Sum Insured</span>
                      <span className="font-bold text-slate-800">{formatCurrency(p.sumInsured)}</span>
                    </div>
                  </div>

                  {(p.vehicleNumber || p.insuredAsset) && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <strong>Insured Asset / Vehicle:</strong> {p.vehicleNumber || p.insuredAsset}
                    </div>
                  )}

                  {/* Documents linked to this policy */}
                  {p.documents && p.documents.length > 0 && (
                    <div className="pt-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Linked Documents
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {p.documents.map((doc: any) => (
                          <div
                            key={doc.id}
                            className="flex items-center gap-2 bg-slate-100 text-xs px-3 py-1.5 rounded-xl"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#06223B]" />
                            <span className="font-medium text-slate-800">{doc.title}</span>
                            <a
                              href={doc.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0B666B] font-bold hover:underline"
                            >
                              View
                            </a>
                            <button
                              onClick={() => handleDeleteDoc(doc.id, doc.title)}
                              className="text-slate-400 hover:text-rose-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Customer Documents Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[#06223B]">
            All Uploaded Customer Documents ({customer.documents?.length || 0})
          </h3>
          <button
            onClick={() => setUploadDocModal(true)}
            className="text-xs font-bold text-[#0B666B] hover:underline inline-flex items-center gap-1"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Document</span>
          </button>
        </div>

        {(!customer.documents || customer.documents.length === 0) ? (
          <p className="text-xs text-slate-400">No documents uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {customer.documents.map((doc: any) => (
              <div
                key={doc.id}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#06223B] shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 line-clamp-1">{doc.title}</h5>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {formatDate(doc.uploadedAt)}
                    </span>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0B666B] font-bold hover:underline inline-flex items-center gap-1 mt-1 text-[11px]"
                    >
                      <span>View File</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteDoc(doc.id, doc.title)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                  title="Delete Document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reminder History Log */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-extrabold text-[#06223B]">
          Reminder & Notification History ({customer.reminderLogs?.length || 0})
        </h3>
        {(!customer.reminderLogs || customer.reminderLogs.length === 0) ? (
          <p className="text-xs text-slate-400">No reminders sent yet.</p>
        ) : (
          <div className="space-y-2">
            {customer.reminderLogs.map((log: any) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#06223B]">
                      {log.channel} Reminder Sent
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">Recipient: +91 {log.recipient}</span>
                  </div>
                  <p className="text-slate-600 mt-1 italic">&ldquo;{log.messageBody}&rdquo;</p>
                </div>
                <div className="text-right text-[11px] text-slate-400 whitespace-nowrap">
                  {new Date(log.sentAt).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: Add Policy */}
      {addPolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="p-6 bg-[#06223B] text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Add Policy for {customer.name}</h3>
                <span className="text-xs text-[#F2C96B]">Link new insurance policy</span>
              </div>
              <button onClick={() => setAddPolicyModal(false)} className="text-white hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPolicy} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#06223B] mb-1">Policy Type *</label>
                  <select
                    value={policyForm.policyType}
                    onChange={(e) => setPolicyForm({ ...policyForm, policyType: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
                  >
                    <option value="MOTOR">Motor Insurance</option>
                    <option value="HEALTH">Health Insurance</option>
                    <option value="LIFE">Life Insurance</option>
                    <option value="TRAVEL">Travel Insurance</option>
                    <option value="HOME">Home Insurance</option>
                    <option value="BUSINESS">Business Insurance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#06223B] mb-1">Policy Number *</label>
                  <input
                    type="text"
                    required
                    value={policyForm.policyNumber}
                    onChange={(e) => setPolicyForm({ ...policyForm, policyNumber: e.target.value })}
                    placeholder="e.g. HDFC-MOT-998811"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#06223B] mb-1">Insurance Company *</label>
                <select
                  value={policyForm.insuranceCompany}
                  onChange={(e) => setPolicyForm({ ...policyForm, insuranceCompany: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#06223B] mb-1">Start Date</label>
                  <input
                    type="date"
                    value={policyForm.startDate}
                    onChange={(e) => setPolicyForm({ ...policyForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#06223B] mb-1">Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={policyForm.expiryDate}
                    onChange={(e) => setPolicyForm({ ...policyForm, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#06223B] mb-1">Policy Status</label>
                  <select
                    value={policyForm.policyStatus}
                    onChange={(e) => setPolicyForm({ ...policyForm, policyStatus: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
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
                    value={policyForm.premiumAmount}
                    onChange={(e) => setPolicyForm({ ...policyForm, premiumAmount: e.target.value })}
                    placeholder="e.g. 15400"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#06223B] mb-1">Sum Insured (₹)</label>
                  <input
                    type="number"
                    value={policyForm.sumInsured}
                    onChange={(e) => setPolicyForm({ ...policyForm, sumInsured: e.target.value })}
                    placeholder="e.g. 1000000"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#06223B] mb-1">Vehicle Number (if motor)</label>
                  <input
                    type="text"
                    value={policyForm.vehicleNumber}
                    onChange={(e) => setPolicyForm({ ...policyForm, vehicleNumber: e.target.value })}
                    placeholder="CG 04 MX 1234"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#06223B] mb-1">Insured Asset Description</label>
                  <input
                    type="text"
                    value={policyForm.insuredAsset}
                    onChange={(e) => setPolicyForm({ ...policyForm, insuredAsset: e.target.value })}
                    placeholder="e.g. Hyundai Creta / 2BHK Flat"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#06223B] mb-1">Policy Notes</label>
                <textarea
                  rows={2}
                  value={policyForm.notes}
                  onChange={(e) => setPolicyForm({ ...policyForm, notes: e.target.value })}
                  placeholder="Additional conditions, add-on covers..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAddPolicyModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#06223B] text-white text-xs sm:text-sm font-bold shadow-md"
                >
                  {saving ? "Saving..." : "Save Policy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Upload Document */}
      {uploadDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 bg-[#06223B] text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Upload Policy Document</h3>
                <span className="text-xs text-[#F2C96B]">Attach schedule or certificate</span>
              </div>
              <button onClick={() => setUploadDocModal(false)} className="text-white hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadDoc} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#06223B] mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. HDFC ERGO Policy Schedule 2025"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#06223B] mb-1">Link to Policy (Optional)</label>
                <select
                  value={docPolicyId}
                  onChange={(e) => setDocPolicyId(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
                >
                  <option value="">General Customer Document</option>
                  {customer.policies?.map((pol: any) => (
                    <option key={pol.id} value={pol.id}>
                      {pol.insuranceCompany} ({pol.policyNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#06223B] mb-1">Select File (PDF / Image) *</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 text-xs text-slate-600 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUploadDocModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#06223B] text-white text-xs sm:text-sm font-bold shadow-md"
                >
                  {saving ? "Uploading..." : "Upload Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Send Renewal Reminder */}
      {reminderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 bg-[#0B666B] text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Send Renewal Reminder</h3>
                <span className="text-xs text-[#F2C96B]">
                  Policy #{reminderModal.policyNumber} ({reminderModal.insuranceCompany})
                </span>
              </div>
              <button onClick={() => setReminderModal(null)} className="text-white hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendReminder} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#06223B] mb-1">Reminder Channel</label>
                <select
                  value={reminderChannel}
                  onChange={(e) => setReminderChannel(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
                >
                  <option value="WHATSAPP">WhatsApp Message</option>
                  <option value="SMS">SMS Text Message</option>
                  <option value="EMAIL">Email Notification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#06223B] mb-1">Message Preview</label>
                <textarea
                  rows={4}
                  value={reminderCustomMsg}
                  onChange={(e) => setReminderCustomMsg(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 text-slate-800"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReminderModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#0B666B] text-white text-xs sm:text-sm font-bold shadow-md"
                >
                  {saving ? "Sending..." : "Dispatch Reminder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
