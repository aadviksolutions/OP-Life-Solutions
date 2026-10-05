"use client";

import React from "react";
import { MapPin, Phone, Mail, Clock, MessageSquare } from "lucide-react";

interface TopBarProps {
  phone?: string;
  email?: string;
  address?: string;
}

export default function TopBar({
  phone = "+91 98261 45892",
  email = "contact@opsinsurance.in",
  address = "Pandri Commercial Complex, Raipur, Chhattisgarh",
}: TopBarProps) {
  const cleanPhone = phone.replace(/\D/g, "");
  const waPhone = cleanPhone.startsWith("91") ? cleanPhone : "91" + cleanPhone;

  return (
    <div className="bg-[#06223B] text-slate-200 text-xs py-2.5 border-b border-navy-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Left items: Location & Hours */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6">
          <div className="flex items-center gap-1.5 text-slate-300 hover:text-white transition">
            <MapPin className="w-3.5 h-3.5 text-[#D9A441] shrink-0" />
            <span>{address}</span>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-[#0B666B] shrink-0" />
            <span>Mon - Sat: 9:30 AM - 7:30 PM</span>
          </div>
        </div>

        {/* Right items: Contact & WhatsApp Direct */}
        <div className="flex items-center gap-5">
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-1.5 text-slate-300 hover:text-[#F2C96B] transition"
          >
            <Mail className="w-3.5 h-3.5 text-[#D9A441] shrink-0" />
            <span>{email}</span>
          </a>
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-1.5 font-medium text-white hover:text-[#F2C96B] transition"
          >
            <Phone className="w-3.5 h-3.5 text-[#0B666B] shrink-0" />
            <span>{phone}</span>
          </a>
          <a
            href={`https://api.whatsapp.com/send?phone=${waPhone}&text=${encodeURIComponent(
              "Namaste Om Prakash Sahu ji, I would like to inquire about insurance services."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 bg-[#0B666B] hover:bg-[#128288] text-white px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition"
          >
            <MessageSquare className="w-3 h-3" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
