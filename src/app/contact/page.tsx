import React from "react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import FaqSection from "@/components/FaqSection";

export const metadata = {
  title: "Contact Us | OP LIFE SOLUTIONS",
  description: "Get in touch with OP Life Solutions in Raipur, Chhattisgarh for personalized insurance guidance and claims advocacy by Om Prakash Sahu.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBar />
      <Navbar />
      <main className="flex-1">
        <section className="bg-[#06223B] text-white py-14 sm:py-16 text-center relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <span className="inline-block text-xs font-bold text-[#F2C96B] uppercase tracking-widest mb-2">
              Advisory Desk & Claims Helpline
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Contact OP Life Solutions
            </h1>
            <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
              We are located in Pandri Market, Raipur. Reach out for consultations, quote comparisons, or claim support.
            </p>
          </div>
        </section>

        <ContactSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
