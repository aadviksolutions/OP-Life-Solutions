"use client";

import React from "react";
import { INSURANCE_PARTNERS } from "@/lib/constants";

export default function PartnersSection() {
  return (
    <section className="py-12 bg-slate-50 border-y border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
          Authorized Advisory for India&apos;s Premier Insurance Institutions
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 items-center">
          {INSURANCE_PARTNERS.map((partner) => (
            <div
              key={partner.code}
              className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-center hover:border-[#D9A441] hover:shadow-md transition-all duration-200 group h-20"
            >
              <span className="font-extrabold text-sm text-[#06223B] group-hover:text-[#0B666B] transition-colors leading-tight">
                {partner.name}
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                {partner.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
