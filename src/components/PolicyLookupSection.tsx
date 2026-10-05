"use client";

import React, { useState } from "react";
import {
  Search,
  ShieldAlert,
  ShieldCheck,
  Calendar,
  FileText,
  Download,
  ExternalLink,
  Phone,
  MessageSquare,
  AlertCircle,
  Clock,
  Car,
  UserCheck,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Lock,
} from "lucide-react";

interface PolicyDocument {
  id: string;
  title: string;
  documentType: string;
  fileUrl: string;
  fileName: string;
}

interface Policy {
  id: string;
  policyId: string;
  policyType: string;
  policyNumber: string;
  insuranceCompany: string;
  purchaseDate: string;
  startDate: string;
  expiryDate: string;
  premiumAmount: number;
  sumInsured: number;
  vehicleNumber?: string | null;
  insuredAsset?: string | null;
  policyStatus: string;
  computedStatus: string;
  daysRemaining: number;
  renewalDate?: string | null;
  agentAdvisor?: string | null;
  notes?: string | null;
  documents: PolicyDocument[];
}

interface CustomerData {
  id: string;
  customerId: string;
  name: string;
  mobile: string;
  email?: string | null;
  city?: string | null;
  state?: string | null;
}

export default function PolicyLookupSection() {
  const [query, setQuery] = useState("");
  const [step, setStep] = useState<"SEARCH" | "OTP" | "VERIFIED">("SEARCH");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OTP state
  const [otp, setOtp] = useState("");
  const [maskedMobile, setMaskedMobile] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);

  // Verified data
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);

  // Step 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter your Mobile Number or Policy Number.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/lookup/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Lookup failed. Please verify your details.");
      }

      setMaskedMobile(data.maskedMobile);
      setDevOtp(data.devOtp || null);
      setOtp(data.devOtp || ""); // Pre-fill for immediate convenience
      setStep("OTP");
    } catch (err: any) {
      setError(err.message || "Unable to find policy records.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/lookup/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim(), otp: otp.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Verification failed.");
      }

      setCustomer(data.customer);
      setPolicies(data.policies);
      setStep("VERIFIED");
    } catch (err: any) {
      setError(err.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuery("");
    setOtp("");
    setDevOtp(null);
    setCustomer(null);
    setPolicies([]);
    setStep("SEARCH");
    setError(null);
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

  return (
    <section id="policy-lookup" className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title area */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#06223B]/10 border border-[#06223B]/20 text-[#06223B] text-xs font-bold uppercase tracking-wider mb-4">
            <Lock className="w-3.5 h-3.5 text-[#D9A441]" />
            <span>Secure Customer Portal</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#06223B] tracking-tight leading-tight mb-4">
            Check Your Policy Details
          </h2>

          <p className="text-slate-600 text-base sm:text-lg">
            Already a customer? You can view your policy schedules, expiry dates, and download documents uploaded by our advisory team.
          </p>
        </div>

        {/* STEP 1: Search Form */}
        {step === "SEARCH" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-10">
              <form onSubmit={handleRequestOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#06223B] mb-2">
                    Enter Mobile Number or Policy Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Search className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="e.g. 9826011223 or HDFC-MOT-889921"
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B666B] focus:border-transparent text-slate-800 placeholder-slate-400 text-base font-medium shadow-xs"
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#0B666B]" />
                    <span>Privacy protected: No password required. Verification code sent to your registered phone.</span>
                  </p>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#06223B] hover:bg-[#0B314D] text-white font-bold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-base group disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Checking Records...</span>
                    </>
                  ) : (
                    <>
                      <span>View Policy Details</span>
                      <ArrowRight className="w-5 h-5 text-[#F2C96B] group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Hint Banner for Easy Review */}
              <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500 bg-slate-50 -mx-8 -mb-8 p-6 rounded-b-3xl">
                <span className="font-bold text-[#06223B]">Demo Test Numbers:</span>{" "}
                <button
                  type="button"
                  onClick={() => setQuery("9826011223")}
                  className="underline hover:text-[#0B666B] font-mono mx-1"
                >
                  9826011223
                </button>{" "}
                (Rajesh Verma - Motor & Life) •{" "}
                <button
                  type="button"
                  onClick={() => setQuery("9425233445")}
                  className="underline hover:text-[#0B666B] font-mono mx-1"
                >
                  9425233445
                </button>{" "}
                (Sunita Agrawal - Health) •{" "}
                <button
                  type="button"
                  onClick={() => setQuery("HDFC-MOT-889921")}
                  className="underline hover:text-[#0B666B] font-mono mx-1"
                >
                  HDFC-MOT-889921
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: OTP Verification */}
        {step === "OTP" && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-10 animate-fadeIn">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-[#0B666B]/10 rounded-2xl flex items-center justify-center mx-auto mb-3 text-[#0B666B]">
                  <Lock className="w-7 h-7 text-[#0B666B]" />
                </div>
                <h3 className="text-xl font-bold text-[#06223B]">Security Verification</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Enter the verification code sent to <strong className="text-slate-900">{maskedMobile}</strong>
                </p>
                {devOtp && (
                  <div className="mt-2.5 inline-block bg-[#FEF7E6] border border-[#D9A441]/40 px-3 py-1 rounded-full text-xs font-semibold text-[#B3832B]">
                    Demo Code: <span className="font-mono font-bold text-slate-900">{devOtp}</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full text-center tracking-widest text-2xl font-mono py-3.5 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B666B] focus:border-transparent text-slate-800"
                    disabled={loading}
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#06223B] hover:bg-[#0B314D] text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition disabled:opacity-70"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <span>Verify & View Policies</span>
                  )}
                </button>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-slate-500 hover:text-slate-800"
                  >
                    ← Change Number
                  </button>
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    className="text-[#0B666B] font-semibold hover:underline"
                  >
                    Resend Code
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* STEP 3: Verified Customer Policy View */}
        {step === "VERIFIED" && customer && (
          <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
            {/* Customer Verified Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#06223B] to-[#0B666B] text-white flex items-center justify-center text-xl font-black shadow-md">
                  {customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-extrabold text-[#06223B]">{customer.name}</h3>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      <UserCheck className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-500 mt-1">
                    <span>ID: <strong className="text-slate-700">{customer.customerId}</strong></span>
                    <span>•</span>
                    <span>Mobile: <strong className="text-slate-700">+91 {customer.mobile}</strong></span>
                    {customer.city && (
                      <>
                        <span>•</span>
                        <span>{customer.city}, {customer.state}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Search Another Policy</span>
              </button>
            </div>

            {/* Policies List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-[#06223B]">
                  Your Insurance Policies ({policies.length})
                </h4>
                <span className="text-xs text-slate-500">
                  Data uploaded and managed by Om Prakash Sahu Insurance Services
                </span>
              </div>

              {policies.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 text-slate-500">
                  No policies recorded yet. Please contact your advisor at +91 98261 45892.
                </div>
              ) : (
                policies.map((pol) => {
                  const isExpired = pol.computedStatus === "EXPIRED";
                  const isExpiringSoon = pol.computedStatus === "EXPIRING_SOON";

                  return (
                    <div
                      key={pol.id}
                      className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      {/* Top ribbon banner for urgent renewal */}
                      {isExpired && (
                        <div className="bg-rose-600 text-white px-6 py-2 text-xs font-bold flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <ShieldAlert className="w-4 h-4" />
                            Policy Expired on {formatDate(pol.expiryDate)} — Immediate renewal required!
                          </span>
                          <a
                            href={`https://api.whatsapp.com/send?phone=919826145892&text=${encodeURIComponent(
                              `Namaste Om Prakash Sahu ji, my policy ${pol.policyNumber} is expired. Please help with instant renewal.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-rose-700 px-3 py-1 rounded-full text-xs font-extrabold hover:bg-slate-100 transition"
                          >
                            Renew Now via WhatsApp
                          </a>
                        </div>
                      )}

                      {isExpiringSoon && (
                        <div className="bg-[#D9A441] text-[#06223B] px-6 py-2 text-xs font-bold flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            Renewal Due in {pol.daysRemaining} days (Expires {formatDate(pol.expiryDate)})
                          </span>
                          <a
                            href={`https://api.whatsapp.com/send?phone=919826145892&text=${encodeURIComponent(
                              `Namaste Om Prakash Sahu ji, I want to renew my ${pol.insuranceCompany} policy ${pol.policyNumber} due in ${pol.daysRemaining} days.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#06223B] text-white px-3 py-1 rounded-full text-xs font-extrabold hover:bg-[#0B314D] transition"
                          >
                            Get Renewal Quote
                          </a>
                        </div>
                      )}

                      {/* Card Content */}
                      <div className="p-6 sm:p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#0B666B]/15 text-[#0B666B] uppercase">
                                {pol.policyType} INSURANCE
                              </span>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                                  isExpired
                                    ? "bg-rose-100 text-rose-700"
                                    : isExpiringSoon
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-emerald-100 text-emerald-700"
                                }`}
                              >
                                {isExpired ? "EXPIRED" : isExpiringSoon ? "EXPIRING SOON" : "ACTIVE"}
                              </span>
                            </div>
                            <h5 className="text-xl font-extrabold text-[#06223B]">
                              {pol.insuranceCompany}
                            </h5>
                            <p className="text-xs font-mono font-semibold text-slate-500 mt-0.5">
                              Policy Number: <span className="text-slate-800">{pol.policyNumber}</span>
                            </p>
                          </div>

                          <div className="text-left md:text-right">
                            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                              Premium Amount
                            </div>
                            <div className="text-2xl font-black text-[#06223B]">
                              {formatCurrency(pol.premiumAmount)}
                            </div>
                            <div className="text-xs text-slate-500 font-medium">
                              Sum Insured: {formatCurrency(pol.sumInsured)}
                            </div>
                          </div>
                        </div>

                        {/* Policy Details Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-100 text-xs sm:text-sm">
                          <div>
                            <span className="text-slate-400 block text-xs">Start Date</span>
                            <span className="font-bold text-slate-800">{formatDate(pol.startDate)}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-xs">Expiry Date</span>
                            <span className={`font-bold ${isExpired ? "text-rose-600" : isExpiringSoon ? "text-amber-700" : "text-slate-800"}`}>
                              {formatDate(pol.expiryDate)}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-xs">Insured Asset / Vehicle</span>
                            <span className="font-bold text-slate-800">
                              {pol.vehicleNumber || pol.insuredAsset || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-xs">Advisor in Charge</span>
                            <span className="font-bold text-[#0B666B]">
                              {pol.agentAdvisor || "Om Prakash Sahu"}
                            </span>
                          </div>
                        </div>

                        {/* Notes / Remarks if any */}
                        {pol.notes && (
                          <div className="py-3 text-xs text-slate-600 bg-slate-50 px-4 rounded-xl mt-4 border border-slate-100">
                            <strong className="text-slate-800">Advisor Notes:</strong> {pol.notes}
                          </div>
                        )}

                        {/* Documents Section */}
                        <div className="mt-6 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                              Policy Documents
                            </span>
                            {pol.documents.length === 0 ? (
                              <span className="text-xs text-slate-400 italic">
                                Document upload in progress by team. Contact advisor for instant copy.
                              </span>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {pol.documents.map((doc) => (
                                  <div
                                    key={doc.id}
                                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-xl transition"
                                  >
                                    <FileText className="w-4 h-4 text-[#06223B]" />
                                    <span className="text-xs font-semibold text-slate-700 truncate max-w-[180px]">
                                      {doc.title}
                                    </span>
                                    <a
                                      href={doc.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs font-bold text-[#0B666B] hover:underline flex items-center gap-0.5 ml-1"
                                      title="View Document"
                                    >
                                      View <ExternalLink className="w-3 h-3" />
                                    </a>
                                    <a
                                      href={doc.fileUrl}
                                      download
                                      className="text-xs font-bold text-[#06223B] hover:text-[#D9A441] ml-1"
                                      title="Download Document"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                    </a>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Quick Action Button for this Policy */}
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <a
                              href={`https://api.whatsapp.com/send?phone=919826145892&text=${encodeURIComponent(
                                `Namaste Om Prakash Sahu ji, I need assistance regarding my ${pol.insuranceCompany} policy #${pol.policyNumber}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-[#0B666B] hover:bg-[#07474B] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                            <a
                              href="tel:+919826145892"
                              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-[#06223B] hover:bg-[#0B314D] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition"
                            >
                              <Phone className="w-3.5 h-3.5 text-[#D9A441]" />
                              <span>Call Advisor</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Assistance Banner below policies */}
            <div className="bg-gradient-to-r from-[#06223B] via-[#0B314D] to-[#07474B] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#D9A441]/30">
              <div>
                <h4 className="text-xl sm:text-2xl font-extrabold text-white">
                  Need Assistance with a Claim or Renewal?
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                  Om Prakash Sahu is available for dedicated personal assistance, cashless garage and hospital coordination, and immediate policy renewals.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href="tel:+919826145892"
                  className="inline-flex items-center gap-2 bg-[#D9A441] hover:bg-[#c49232] text-[#06223B] font-bold px-5 py-3 rounded-xl shadow-md text-sm transition"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call +91 98261 45892</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
