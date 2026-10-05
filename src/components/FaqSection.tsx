"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, PhoneCall, ShieldCheck } from "lucide-react";
import { FAQS } from "@/lib/constants";

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading and Photo matching mockup */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B666B]/10 border border-[#0B666B]/30 text-[#0B666B] text-xs font-bold uppercase tracking-wider mb-4">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Common Inquiries</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#06223B] tracking-tight leading-tight mb-6">
              Insurance Made Easy
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
              We eliminate complex insurance jargon so you understand exactly what you are paying for, how your claims will be approved, and what happens at renewal.
            </p>

            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80"
                alt="Family caring for elder in India"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06223B]/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <h4 className="text-white font-bold text-base">Still Have Questions?</h4>
                  <p className="text-slate-200 text-xs mt-0.5">
                    Speak directly with Om Prakash Sahu for clarification.
                  </p>
                  <a
                    href="tel:+919826145892"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F2C96B] hover:underline mt-2"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call +91 98261 45892</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-7 space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "bg-slate-50 border-[#0B666B]/50 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-[#06223B]"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <span className="p-1 rounded-full bg-slate-200/60 shrink-0 text-[#06223B]">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-200/50 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
