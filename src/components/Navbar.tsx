"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, PhoneCall, ShieldCheck, ArrowRight, FileText } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Insurance Services", href: "/services" },
    { name: "Policy Details", href: "/policy-details" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-2.5"
          : "bg-white border-b border-slate-100 py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo with OP LIFE SOLUTIONS from User Upload */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="relative h-11 sm:h-13 w-auto max-w-[220px] rounded-lg overflow-hidden shrink-0 bg-white flex items-center">
              <img
                src="/images/op-life-solutions-logo.jpg"
                alt="OP LIFE SOLUTIONS Logo"
                className="h-full w-auto object-contain group-hover:scale-102 transition-transform duration-300"
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-extrabold text-[#06223B] text-base sm:text-lg tracking-tight leading-tight group-hover:text-[#0B666B] transition-colors">
                OP LIFE SOLUTIONS
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#D9A441] uppercase">
                SECURE TODAY | BRIGHTER TOMORROW
              </span>
              <span className="text-[9px] text-slate-500 font-medium tracking-wide">
                Advisory Desk: Om Prakash Sahu
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-[#06223B] bg-slate-100 font-bold"
                      : "text-slate-700 hover:text-[#0B666B] hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Action: Get in Touch Button */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="/policy-details"
              className="hidden xl:inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B314D] hover:text-[#0B666B] px-3 py-2 rounded-lg hover:bg-slate-50 transition"
            >
              <FileText className="w-4 h-4 text-[#D9A441]" />
              Check Policy
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#06223B] hover:bg-[#0B314D] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all duration-200 group border border-[#D9A441]/30"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4 text-[#F2C96B] group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden gap-2">
            <a
              href="tel:+916268819299"
              className="inline-flex sm:hidden items-center gap-1 bg-[#06223B] text-white text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              <PhoneCall className="w-3 h-3 text-[#D9A441]" />
              Call
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-[#06223B] hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 pb-4 border-t border-slate-200 animate-fadeIn">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#06223B] text-white"
                        : "text-slate-700 hover:bg-slate-100 hover:text-[#0B666B]"
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
              <div className="pt-3 border-t border-slate-100 mt-2 flex flex-col gap-2">
                <a
                  href="/policy-details"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-slate-300 text-[#06223B] text-sm font-semibold hover:bg-slate-50 transition"
                >
                  <FileText className="w-4 h-4 text-[#D9A441]" />
                  Check Your Policy Details
                </a>
                <a
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#06223B] text-white text-sm font-semibold shadow hover:bg-[#0B314D] transition"
                >
                  <span>Talk to Om Prakash Sahu</span>
                  <ArrowRight className="w-4 h-4 text-[#F2C96B]" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
