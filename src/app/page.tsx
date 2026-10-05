import React from "react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import PolicyLookupSection from "@/components/PolicyLookupSection";
import PartnersSection from "@/components/PartnersSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AdvisorSection from "@/components/AdvisorSection";
import FaqSection from "@/components/FaqSection";
import CtaBanner from "@/components/CtaBanner";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // Refresh dynamic settings periodically

export default async function HomePage() {
  let settings = null;
  try {
    settings = await prisma.adminSettings.findUnique({
      where: { id: "default-settings" },
    });
  } catch (e) {
    console.error("Settings fetch error:", e);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBar
        phone={settings?.phone || "+91 62688 19299"}
        email={settings?.email || "contact@oplifesolutions.in"}
        address={`${settings?.address || "Shop No. 12, Pandri"}, ${settings?.city || "Raipur"}, ${settings?.state || "CG"}`}
      />
      <Navbar />
      <main className="flex-1">
        <Hero
          headline={settings?.heroHeadline || "Protecting What Matters Most"}
          subheading={settings?.heroSubheading || "Reliable insurance solutions for you, your family and your future."}
          yearsExperience={settings?.yearsExperience || "15+"}
          customersServed={settings?.customersServed || "2500+"}
          claimsSupportRate={settings?.claimsSupportRate || "99.4%"}
        />
        <AboutSection />
        <ServicesSection />
        <PolicyLookupSection />
        <PartnersSection />
        <TestimonialsSection />
        <AdvisorSection />
        <FaqSection />
        <CtaBanner />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
