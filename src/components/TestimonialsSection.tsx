"use client";

import React from "react";
import { Star, Quote, ShieldCheck } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B666B]/10 border border-[#0B666B]/30 text-[#0B666B] text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Client Experiences</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#06223B] tracking-tight leading-tight mb-4">
            Secured Lives, Happy Clients
          </h2>

          <p className="text-slate-600 text-base sm:text-lg">
            Hear from families and business owners across Chhattisgarh who trust Om Prakash Sahu Insurance Services for their protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-2xl p-8 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#D9A441]/40 transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div className="mb-6">
                <Quote className="w-10 h-10 text-[#D9A441]/40 mb-4 group-hover:text-[#D9A441] transition-colors" />
                
                {/* 5 Stars */}
                <div className="flex items-center gap-1 mb-4 text-[#D9A441]">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#06223B] text-sm sm:text-base">
                    {item.author}
                  </h4>
                  <p className="text-xs text-slate-500">{item.location}</p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#06223B]/10 text-[#06223B]">
                  {item.policyType}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
