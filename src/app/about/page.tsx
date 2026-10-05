import React from "react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";
import AdvisorSection from "@/components/AdvisorSection";
import PartnersSection from "@/components/PartnersSection";
import CtaBanner from "@/components/CtaBanner";
import { ShieldCheck, Award, Users, HeartHandshake } from "lucide-react";

export const metadata = {
  title: "About Us | OP LIFE SOLUTIONS",
  description: "Learn about OP Life Solutions — trusted insurance advisory firm founded by Om Prakash Sahu in Raipur, Chhattisgarh with 15+ years of dedicated service.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBar />
      <Navbar />
      <main className="flex-1">
        {/* Page Header Banner */}
        <section className="bg-[#06223B] text-white py-16 sm:py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1600&q=80"
              alt="Advisory"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block text-xs font-bold text-[#F2C96B] uppercase tracking-widest mb-3">
              15+ Years of Dedicated Service
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              About OP Life Solutions
            </h1>
            <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
              Your trusted partner in navigating insurance policies, claims advocacy, and uncompromised family security across Chhattisgarh.
            </p>
          </div>
        </section>

        {/* Core Values Strip */}
        <section className="py-12 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
                <ShieldCheck className="w-8 h-8 text-[#0B666B] shrink-0" />
                <div>
                  <h4 className="font-bold text-[#06223B] text-sm">Customer First</h4>
                  <p className="text-xs text-slate-500 mt-1">Unbiased advisory tailored to your exact family needs, never quotas.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
                <Award className="w-8 h-8 text-[#D9A441] shrink-0" />
                <div>
                  <h4 className="font-bold text-[#06223B] text-sm">Claims Priority</h4>
                  <p className="text-xs text-slate-500 mt-1">On-ground assistance with hospital TPAs and garage surveyors.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
                <Users className="w-8 h-8 text-[#0B666B] shrink-0" />
                <div>
                  <h4 className="font-bold text-[#06223B] text-sm">2,500+ Families</h4>
                  <p className="text-xs text-slate-500 mt-1">Generations of policyholders who rely on us for seamless renewals.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
                <HeartHandshake className="w-8 h-8 text-[#D9A441] shrink-0" />
                <div>
                  <h4 className="font-bold text-[#06223B] text-sm">Lifetime Support</h4>
                  <p className="text-xs text-slate-500 mt-1">We don&apos;t disappear after policy purchase. We are with you always.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AboutSection />
        <AdvisorSection />
        <PartnersSection />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
