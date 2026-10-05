import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.adminSettings.findUnique({
      where: { id: "default-settings" },
      select: {
        companyName: true,
        tagline: true,
        logoUrl: true,
        phone: true,
        whatsapp: true,
        email: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        workingHours: true,
        heroHeadline: true,
        heroSubheading: true,
        yearsExperience: true,
        customersServed: true,
        claimsSupportRate: true,
        aboutStory: true,
      },
    });

    if (!settings) {
      settings = {
        companyName: "Om Prakash Sahu Insurance Services",
        tagline: "YOUR PROTECTION. OUR PRIORITY.",
        logoUrl: "/images/ops-logo.jpg",
        phone: "+91 98261 45892",
        whatsapp: "+91 98261 45892",
        email: "contact@opsinsurance.in",
        address: "Shop No. 12, Commercial Complex, Pandri Market",
        city: "Raipur",
        state: "Chhattisgarh",
        pincode: "492004",
        workingHours: "Mon - Sat: 9:30 AM - 7:30 PM",
        heroHeadline: "Protecting What Matters Most",
        heroSubheading: "Reliable insurance solutions for you, your family and your future.",
        yearsExperience: "15+",
        customersServed: "2500+",
        claimsSupportRate: "99.4%",
        aboutStory: "With over 15 years of dedicated insurance advisory experience in Raipur and throughout Chhattisgarh, Om Prakash Sahu Insurance Services has protected thousands of families and businesses with customized coverage and steadfast claims advocacy.",
      };
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Public settings GET error:", error);
    return NextResponse.json({ error: "Failed to load public settings" }, { status: 500 });
  }
}
