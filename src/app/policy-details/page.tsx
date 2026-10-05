import React from "react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PolicyLookupSection from "@/components/PolicyLookupSection";
import FaqSection from "@/components/FaqSection";
import CtaBanner from "@/components/CtaBanner";

export const metadata = {
  title: "Check Policy Details | Om Prakash Sahu Insurance Services",
  description: "Securely check your policy schedules, expiry dates, and download documents uploaded by Om Prakash Sahu Insurance Services.",
};

export default function PolicyDetailsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBar />
      <Navbar />
      <main className="flex-1">
        <section className="bg-[#06223B] text-white py-14 sm:py-16 text-center relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <span className="inline-block text-xs font-bold text-[#F2C96B] uppercase tracking-widest mb-2">
              Customer Document & Expiry Portal
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Check Your Policy Details
            </h1>
            <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
              View your policy information, renewal alerts, and download official schedules uploaded by our team.
            </p>
          </div>
        </section>

        <PolicyLookupSection />
        <FaqSection />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
