"use client";

import React from "react";
import { CheckCircle, ShieldCheck, ArrowRight, PhoneCall } from "lucide-react";

export default function AboutSection() {
  const points = [
    { title: "Comprehensive Protection", desc: "Customized coverage across health, motor, life, and commercial risks." },
    { title: "Customizable Plans", desc: "Tailored to your family's budget and exact financial goals." },
    { title: "Fast Claims & Expert Support", desc: "Doorstep and on-ground claims coordination with 100% advocacy." },
    { title: "Direct Advisor Access", desc: "Speak directly with Mr. Om Prakash Sahu for honest guidance." },
  ];

  return (
    <section id="about" className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image with Experience Badge matching reference mockup */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Photo */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80"
                  alt="Om Prakash Sahu Insurance Advisory Consultation"
                  className="w-full h-[440px] sm:h-[500px] object-cover object-top hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06223B]/60 via-transparent to-transparent" />
              </div>

              {/* Floating Experience Badge (Navy/Teal with Gold Accent) */}
              <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:-right-6 bg-gradient-to-br from-[#06223B] to-[#0B314D] text-white p-6 sm:p-7 rounded-2xl shadow-2xl border-2 border-[#D9A441]/50 max-w-[220px]">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#F2C96B] leading-none mb-1">
                  15+
                </div>
                <div className="text-sm font-bold tracking-tight text-white uppercase">
                  Years Trusted
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  Insurance Advisory in Chhattisgarh
                </div>
              </div>

              {/* Decorative Subtle Accent */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#0B666B]/15 rounded-full filter blur-xl -z-10" />
            </div>
          </div>

          {/* Right Column: Content matching reference mockup */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B666B]/10 border border-[#0B666B]/30 text-[#0B666B] text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>About Om Prakash Sahu Insurance</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#06223B] tracking-tight leading-tight mb-6">
              Because Your Peace Matters
            </h2>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
              At <strong>Om Prakash Sahu Insurance Services</strong>, we believe insurance is not just a policy document — it is a promise of financial protection when life takes unexpected turns. Located in Raipur, Chhattisgarh, we have spent over 15 years safeguarding families, vehicles, properties, and enterprises.
            </p>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
              Unlike generic web aggregators that leave you stranded during hospital emergencies or vehicle accidents, our dedicated advisory provides personalized plan comparison, zero-hidden-clauses transparency, and relentless claim advocacy.
            </p>

            {/* Checkmark List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-9">
              {points.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
                  <CheckCircle className="w-5 h-5 text-[#0B666B] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#06223B]">{pt.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">{pt.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#06223B] hover:bg-[#0B314D] text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all group"
              >
                <span>Talk to an Advisor</span>
                <ArrowRight className="w-4 h-4 text-[#F2C96B] group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="tel:+919826145892"
                className="inline-flex items-center gap-2 border border-slate-300 hover:border-[#06223B] text-[#06223B] font-semibold text-sm px-5 py-3.5 rounded-xl hover:bg-slate-100 transition"
              >
                <PhoneCall className="w-4 h-4 text-[#0B666B]" />
                <span>+91 98261 45892</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
