"use client";

import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Shield,
  Clock,
  ArrowRight,
  ShieldCheck,
  Lock,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#06223B] text-slate-300 pt-16 pb-10 border-t-2 border-[#D9A441]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-navy-800">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 px-2 py-1 rounded-lg overflow-hidden shrink-0 border border-slate-700 bg-white flex items-center justify-center">
                <img
                  src="/images/op-life-solutions-logo.jpg"
                  alt="OP Life Solutions Logo"
                  className="h-full w-auto object-contain"
                />
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight block leading-tight">
                  OP LIFE SOLUTIONS
                </span>
                <span className="text-[11px] font-semibold tracking-wider text-[#F2C96B] uppercase block">
                  SECURE TODAY | BRIGHTER TOMORROW
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Trusted insurance advisory firm founded by Mr. Om Prakash Sahu, headquartered in Raipur, Chhattisgarh. Specializing in customized health mediclaim, motor insurance, life & term protection, and corporate asset safeguarding.
            </p>

            <div className="inline-block py-1.5 px-3 rounded-lg bg-[#0B666B]/30 border border-[#0B666B]/50 text-xs font-semibold text-[#F2C96B]">
              Tagline: SECURE TODAY | BRIGHTER TOMORROW
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider text-[#F2C96B]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="/" className="hover:text-white transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#D9A441]" />
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#D9A441]" />
                  <span>About Us</span>
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-white transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#D9A441]" />
                  <span>Insurance Services</span>
                </a>
              </li>
              <li>
                <a href="/policy-details" className="hover:text-white transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#D9A441]" />
                  <span>Check Policy Details</span>
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#D9A441]" />
                  <span>Contact Advisor</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Insurance Plans */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider text-[#F2C96B]">
              Coverage Portfolio
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="/services" className="hover:text-white transition">
                  • Motor & Vehicle Insurance (Zero Dep)
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-white transition">
                  • Health & Family Mediclaim
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-white transition">
                  • Pure Term & Life Protection
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-white transition">
                  • International & Domestic Travel
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-white transition">
                  • Home & Property Structure Cover
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-white transition">
                  • Commercial & Business Fire / Transit
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Branch */}
          <div className="lg:col-span-3 space-y-3 text-xs sm:text-sm">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider text-[#F2C96B]">
              Advisory Desk
            </h4>
            <div className="flex items-start gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-[#D9A441] shrink-0 mt-0.5" />
              <span>Shop No. 12, Commercial Complex, Pandri Market, Raipur, CG - 492004</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-4 h-4 text-[#0B666B] shrink-0" />
              <span>+91 62688 19299</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-4 h-4 text-[#D9A441] shrink-0" />
              <span>contact@oplifesolutions.in</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-[#0B666B] shrink-0" />
              <span>Mon – Sat: 9:30 AM – 7:30 PM</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {currentYear} OP Life Solutions. All rights reserved. Insurance is the subject matter of solicitation.
          </p>

          <div className="flex items-center gap-6">
            <span>Raipur, Chhattisgarh, India</span>
            <span>•</span>
            <a
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#F2C96B] transition font-medium"
            >
              <Lock className="w-3 h-3" />
              <span>Staff / Admin Portal</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
