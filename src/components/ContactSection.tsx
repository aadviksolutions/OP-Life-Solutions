"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    insuranceType: "Health Insurance",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) {
      setError("Please enter your name and mobile number.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit enquiry.");
      }

      setSuccess(true);
      setFormData({
        name: "",
        mobile: "",
        email: "",
        insuranceType: "Health Insurance",
        message: "",
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please call us directly.");
    } finally {
      setLoading(false);
    }
  };

  const waPhone = "916268819299";
  const waText = encodeURIComponent(
    "Namaste Om Prakash Sahu ji (OP Life Solutions), I want to talk to an advisor regarding insurance coverage."
  );

  return (
    <section id="contact" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Info & Assistance */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#06223B]/10 border border-[#06223B]/20 text-[#06223B] text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D9A441]" />
              <span>Direct Advisor Desk</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#06223B] tracking-tight leading-tight mb-4">
              Need Assistance?
            </h2>

            <p className="text-slate-600 text-base sm:text-lg mb-8 leading-relaxed">
              Talk to our insurance advisor for the right plan, renewal or claim support. We are here to guide you with honest comparisons and prompt assistance.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <a
                href="tel:+916268819299"
                className="inline-flex items-center gap-2 bg-[#06223B] hover:bg-[#0B314D] text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md transition"
              >
                <Phone className="w-4 h-4 text-[#D9A441]" />
                <span>Call Now</span>
              </a>

              <a
                href={`https://api.whatsapp.com/send?phone=${waPhone}&text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0B666B] hover:bg-[#07474B] text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Contact details list */}
            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-start gap-3.5 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                <MapPin className="w-5 h-5 text-[#D9A441] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#06223B]">Office Location</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Shop No. 12, Commercial Complex, Pandri Market, Raipur, Chhattisgarh - 492004
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                <Phone className="w-5 h-5 text-[#0B666B] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#06223B]">Phone & Mobile</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    +91 62688 19299
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                <Mail className="w-5 h-5 text-[#D9A441] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#06223B]">Email Inquiries</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    contact@oplifesolutions.in
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                <Clock className="w-5 h-5 text-[#0B666B] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#06223B]">Working Hours</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Monday to Saturday: 9:30 AM – 7:30 PM (Sunday by appointment for emergencies)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200">
              <h3 className="text-2xl font-extrabold text-[#06223B] mb-2">
                Send an Enquiry
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                Fill in your details below and Om Prakash Sahu will contact you directly with customized options.
              </p>

              {success ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center animate-fadeIn">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h4 className="text-lg font-bold">Enquiry Received Successfully!</h4>
                  <p className="text-xs sm:text-sm text-emerald-700 mt-1">
                    Thank you for reaching out. Advisor Om Prakash Sahu will call or WhatsApp you shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 text-xs font-bold text-emerald-900 underline"
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#06223B] mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rameshwar Sahu"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B666B] text-slate-800 text-sm shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#06223B] mb-1.5">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        placeholder="e.g. 9826011223"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B666B] text-slate-800 text-sm shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#06223B] mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. yourname@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B666B] text-slate-800 text-sm shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#06223B] mb-1.5">
                        Insurance Type *
                      </label>
                      <select
                        value={formData.insuranceType}
                        onChange={(e) => setFormData({ ...formData, insuranceType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B666B] text-slate-800 text-sm shadow-xs bg-white"
                      >
                        <option value="Health Insurance">Health Insurance (Family / Mediclaim)</option>
                        <option value="Motor Insurance">Motor Insurance (Car / Bike / Commercial)</option>
                        <option value="Life Insurance">Life & Term Insurance</option>
                        <option value="Travel Insurance">Travel Insurance (Domestic / Overseas)</option>
                        <option value="Home Insurance">Home & Property Insurance</option>
                        <option value="Business Insurance">Business / Commercial Risk Insurance</option>
                        <option value="Policy Renewal">Policy Renewal Assistance</option>
                        <option value="Claim Support">Claim Support / TPA Guidance</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#06223B] mb-1.5">
                      Your Message or Policy Requirements
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your coverage requirements, family members to be covered, or policy renewal date..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B666B] text-slate-800 text-sm shadow-xs"
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[#06223B] hover:bg-[#0B314D] text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition disabled:opacity-70 text-sm group"
                  >
                    <Send className="w-4 h-4 text-[#F2C96B] group-hover:translate-x-0.5 transition-transform" />
                    <span>{loading ? "Submitting..." : "Send Enquiry to Advisor"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
