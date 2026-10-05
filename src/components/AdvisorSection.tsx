"use client";

import React from "react";
import { Award, Phone, Mail, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AdvisorSection() {
  const advisors = [
    {
      name: "Om Prakash Sahu",
      role: "Principal Insurance Advisor & Founder",
      exp: "15+ Years Experience",
      specialization: "Health, Term Life & Corporate Risk Advisory",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
      phone: "+91 98261 45892",
      email: "contact@opsinsurance.in",
      bio: "Dedicated insurance counselor with over a decade and a half of expertise helping clients navigate policy fine print and securing timely cashless claim approvals.",
    },
    {
      name: "Anjali Sahu",
      role: "Claims Advocacy Specialist",
      exp: "8+ Years Experience",
      specialization: "Cashless Hospitalization & Motor Claims TPA Coordination",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80",
      phone: "+91 98261 45892",
      email: "claims@opsinsurance.in",
      bio: "Manages hospital pre-authorizations, surveyor coordination, and claim documentation to ensure zero rejection and rapid reimbursement.",
    },
    {
      name: "Vikas Dewangan",
      role: "Motor & Property Risk Consultant",
      exp: "7+ Years Experience",
      specialization: "Bumper-to-Bumper Motor & Commercial Asset Policies",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
      phone: "+91 98261 45892",
      email: "motor@opsinsurance.in",
      bio: "Specializes in multi-vehicle fleet quotes, return-to-invoice add-ons, and comprehensive commercial shop & factory protection.",
    },
  ];

  return (
    <section className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#06223B]/10 border border-[#06223B]/20 text-[#06223B] text-xs font-bold uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5 text-[#D9A441]" />
            <span>Dedicated Counselors</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#06223B] tracking-tight leading-tight mb-4">
            Professional Advice, Personal Care
          </h2>

          <p className="text-slate-600 text-base sm:text-lg">
            Unlike automated online algorithms, you are guided by experienced human advisors committed to your family&apos;s peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advisors.map((adv, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#D9A441]/50 transition-all duration-300 flex flex-col group"
            >
              {/* Advisor Photo */}
              <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                <img
                  src={adv.image}
                  alt={adv.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06223B]/70 via-transparent to-transparent" />

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="bg-[#0B666B] text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                    {adv.exp}
                  </span>
                </div>
              </div>

              {/* Advisor Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-[#06223B] group-hover:text-[#0B666B] transition-colors">
                    {adv.name}
                  </h3>
                  <p className="text-xs font-bold text-[#D9A441] uppercase tracking-wider mt-0.5">
                    {adv.role}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-1 mb-4 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0B666B]" />
                    <span>{adv.specialization}</span>
                  </p>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {adv.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={`tel:${adv.phone}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#06223B] hover:text-[#0B666B] transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#D9A441]" />
                    <span>{adv.phone}</span>
                  </a>

                  <a
                    href={`https://api.whatsapp.com/send?phone=919826145892&text=${encodeURIComponent(
                      `Namaste ${adv.name} ji, I would like to schedule an insurance consultation.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#0B666B] hover:bg-[#07474B] px-3 py-1.5 rounded-lg transition"
                  >
                    <span>Connect</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
