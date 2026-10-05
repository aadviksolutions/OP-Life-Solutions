"use client";

import React from "react";
import { X, CheckCircle2, Phone, MessageSquare, ArrowRight, ShieldCheck } from "lucide-react";
import { ServiceCategory } from "@/lib/constants";

interface ServiceDetailModalProps {
  service: ServiceCategory | null;
  onClose: () => void;
}

export default function ServiceDetailModal({ service, onClose }: ServiceDetailModalProps) {
  if (!service) return null;

  const waPhone = "916268819299";
  const waText = encodeURIComponent(
    `Namaste Om Prakash Sahu ji, I want to consult regarding ${service.name} coverage with OP Life Solutions.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Image */}
        <div className="relative h-56 sm:h-64 w-full shrink-0">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06223B] via-[#06223B]/60 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-md transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9A441] text-[#06223B] text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              OP Life Solutions Advisory
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {service.name}
            </h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Overview
            </h4>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              {service.fullDesc}
            </p>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="text-xs font-bold text-[#06223B] uppercase tracking-wider mb-3">
              Coverage Highlights
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {service.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-[#0B666B] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ideal For */}
          <div className="bg-[#FEF7E6] p-4 rounded-xl border border-[#D9A441]/30">
            <h5 className="text-xs font-bold text-[#B3832B] uppercase tracking-wider">
              Recommended For
            </h5>
            <p className="text-xs sm:text-sm text-[#06223B] font-medium mt-1">
              {service.idealFor}
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            No automated checkout. Speak with Mr. Om Prakash Sahu for customized quotes.
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={`https://api.whatsapp.com/send?phone=${waPhone}&text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#0B666B] hover:bg-[#07474B] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <a
              href="tel:+916268819299"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#06223B] hover:bg-[#0B314D] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition"
            >
              <Phone className="w-4 h-4 text-[#D9A441]" />
              <span>Call +91 62688 19299</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
