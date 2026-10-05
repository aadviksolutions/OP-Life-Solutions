"use client";

import React, { useState } from "react";
import {
  Car,
  HeartPulse,
  ShieldCheck,
  Plane,
  Home,
  Briefcase,
  ArrowRight,
  Shield,
} from "lucide-react";
import { SERVICES, ServiceCategory } from "@/lib/constants";
import ServiceDetailModal from "./ServiceDetailModal";

const iconMap: Record<string, React.ReactNode> = {
  Car: <Car className="w-5 h-5 text-[#0B666B]" />,
  HeartPulse: <HeartPulse className="w-5 h-5 text-[#0B666B]" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-[#0B666B]" />,
  Plane: <Plane className="w-5 h-5 text-[#0B666B]" />,
  Home: <Home className="w-5 h-5 text-[#0B666B]" />,
  Briefcase: <Briefcase className="w-5 h-5 text-[#0B666B]" />,
};

export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null);

  return (
    <section id="services" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B666B]/10 border border-[#0B666B]/30 text-[#0B666B] text-xs font-bold uppercase tracking-wider mb-4">
            <Shield className="w-3.5 h-3.5 text-[#0B666B]" />
            <span>Our Insurance Services</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#06223B] tracking-tight leading-tight mb-4">
            Reliable Insurance, Anytime, Anywhere
          </h2>

          <p className="text-slate-600 text-base sm:text-lg">
            We partner with India&apos;s most reputed insurance companies to provide tailored coverage for your health, family, vehicles, and commercial enterprises.
          </p>
        </div>

        {/* 6 Category Cards Grid matching reference mockup */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((srv) => (
            <div
              key={srv.id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#D9A441]/50 transition-all duration-300 flex flex-col transform hover:-translate-y-1"
            >
              {/* Distinct High Quality Photo */}
              <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                <img
                  src={srv.image}
                  alt={srv.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06223B]/60 via-transparent to-transparent opacity-60" />

                {/* Floating Icon badge */}
                <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center border border-slate-100">
                  {iconMap[srv.iconName] || <ShieldCheck className="w-5 h-5 text-[#0B666B]" />}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#06223B] group-hover:text-[#0B666B] transition-colors mb-2.5">
                    {srv.name}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {srv.shortDesc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedService(srv)}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#06223B] group-hover:text-[#0B666B] transition-colors cursor-pointer"
                  >
                    <span>Know More</span>
                    <ArrowRight className="w-4 h-4 text-[#D9A441] group-hover:translate-x-1.5 transition-transform" />
                  </button>

                  <a
                    href={`https://api.whatsapp.com/send?phone=916268819299&text=${encodeURIComponent(
                      `Namaste Om Prakash Sahu ji, please advise me on ${srv.name} with OP Life Solutions.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-slate-400 hover:text-[#0B666B] transition"
                  >
                    Inquire
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />
    </section>
  );
}
