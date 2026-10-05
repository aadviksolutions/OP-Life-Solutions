"use client";

import React from "react";
import { Phone, Shield, ArrowRight, CheckCircle2, Award, Users, Headphones } from "lucide-react";

interface HeroProps {
  headline?: string;
  subheading?: string;
  yearsExperience?: string;
  customersServed?: string;
  claimsSupportRate?: string;
}

export default function Hero({
  headline = "Protecting What Matters Most",
  subheading = "Reliable insurance solutions for you, your family and your future.",
  yearsExperience = "15+",
  customersServed = "2500+",
  claimsSupportRate = "99.4%",
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#06223B]">
      {/* Background Image with Dark Navy Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=2000&q=85"
          alt="Happy family protected by insurance"
          className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000"
        />
        {/* Subtle Dark Navy Multi-stop Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#06223B] via-[#06223B]/85 to-[#0B314D]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06223B] via-transparent to-transparent opacity-90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-24 sm:pb-32">
        <div className="max-w-3xl">
          {/* Badge with OP LIFE SOLUTIONS */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B666B]/30 border border-[#D9A441]/40 text-[#F2C96B] text-xs sm:text-sm font-semibold mb-6 backdrop-blur-sm shadow-sm">
            <Shield className="w-4 h-4 text-[#D9A441]" />
            <span>OP LIFE SOLUTIONS</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
            {headline}
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-200 font-normal leading-relaxed mb-8 max-w-2xl">
            {subheading}
          </p>

          {/* Trust Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D9A441] shrink-0" />
              <span>Independent & Unbiased Advisory</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D9A441] shrink-0" />
              <span>100% Dedicated Cashless Claim Assistance</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D9A441] shrink-0" />
              <span>Direct Assistance from Om Prakash Sahu</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D9A441] shrink-0" />
              <span>Partnered with India&apos;s Leading Insurers</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#D9A441] to-[#F2C96B] hover:from-[#c28f30] hover:to-[#deb353] text-[#06223B] font-bold px-7 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 group text-base"
            >
              <Phone className="w-5 h-5 text-[#06223B]" />
              <span>Talk to an Advisor</span>
              <ArrowRight className="w-4 h-4 text-[#06223B] group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-4 rounded-xl backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-200 text-base"
            >
              <span>View Insurance Plans</span>
            </a>
          </div>
        </div>
      </div>

      {/* Floating Trust Statistics Strip */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-14 pb-12">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {/* Stat 1 */}
          <div className="flex items-center gap-4 pt-2 sm:pt-0 sm:px-4 first:pl-0">
            <div className="w-14 h-14 rounded-2xl bg-[#06223B]/5 border border-[#06223B]/10 flex items-center justify-center shrink-0 text-[#06223B]">
              <Award className="w-7 h-7 text-[#D9A441]" />
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#06223B] tracking-tight">
                {yearsExperience}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                Years of Trust
              </div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-6">
            <div className="w-14 h-14 rounded-2xl bg-[#0B666B]/10 border border-[#0B666B]/20 flex items-center justify-center shrink-0 text-[#0B666B]">
              <Users className="w-7 h-7 text-[#0B666B]" />
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#06223B] tracking-tight">
                {customersServed}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                Customers Served
              </div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-6">
            <div className="w-14 h-14 rounded-2xl bg-[#D9A441]/10 border border-[#D9A441]/20 flex items-center justify-center shrink-0 text-[#D9A441]">
              <Headphones className="w-7 h-7 text-[#D9A441]" />
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#06223B] tracking-tight">
                {claimsSupportRate}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                Customer Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
