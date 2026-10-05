"use client";

import React from "react";
import { Phone, MessageSquare, ArrowRight, ShieldCheck } from "lucide-react";

export default function CtaBanner() {
  const waPhone = "916268819299";
  const waText = encodeURIComponent(
    "Namaste Om Prakash Sahu ji (OP Life Solutions), I want to review my family's insurance coverage."
  );

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#06223B] via-[#0B314D] to-[#07474B] text-white shadow-2xl border border-[#D9A441]/40">
          {/* Background image overlay */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <img
              src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1400&q=80"
              alt="Secured Family"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 px-8 py-12 sm:px-12 sm:py-16 md:flex md:items-center md:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9A441]/20 border border-[#D9A441]/50 text-[#F2C96B] text-xs font-bold uppercase tracking-wider mb-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SECURE TODAY | BRIGHTER TOMORROW</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Secure What Matters Most!
              </h3>
              <p className="mt-3 text-slate-200 text-sm sm:text-base leading-relaxed">
                Connect with Mr. Om Prakash Sahu today. Get personalized policy comparisons, coverage audits for existing plans, and uncompromised claims advocacy.
              </p>
            </div>

            <div className="mt-8 md:mt-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <a
                href={`https://api.whatsapp.com/send?phone=${waPhone}&text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#0B666B] hover:bg-[#128288] text-white font-bold px-6 py-3.5 rounded-xl shadow-md text-sm transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Advisor</span>
              </a>

              <a
                href="tel:+916268819299"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D9A441] to-[#F2C96B] hover:from-[#c28f30] hover:to-[#deb353] text-[#06223B] font-bold px-6 py-3.5 rounded-xl shadow-lg text-sm transition"
              >
                <Phone className="w-4 h-4" />
                <span>Call +91 62688 19299</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
