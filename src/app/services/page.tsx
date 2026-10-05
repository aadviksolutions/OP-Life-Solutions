import React from "react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicesSection from "@/components/ServicesSection";
import PartnersSection from "@/components/PartnersSection";
import CtaBanner from "@/components/CtaBanner";
import ContactSection from "@/components/ContactSection";

export const metadata = {
  title: "Insurance Services | Om Prakash Sahu Insurance Services",
  description: "Explore Motor, Health, Life, Travel, Home, and Business Insurance plans tailored by Om Prakash Sahu Insurance Services.",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBar />
      <Navbar />
      <main className="flex-1">
        {/* Banner */}
        <section className="bg-[#06223B] text-white py-16 sm:py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span className="inline-block text-xs font-bold text-[#F2C96B] uppercase tracking-widest mb-3">
              Comprehensive Protection Portfolio
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Insurance Plans & Advisory
            </h1>
            <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
              Customized coverage across motor, health, life, travel, home, and commercial assets. Compare benefits and speak with Mr. Om Prakash Sahu.
            </p>
          </div>
        </section>

        <ServicesSection />
        <PartnersSection />
        <CtaBanner />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
