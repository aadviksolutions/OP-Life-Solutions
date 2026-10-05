import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// In-memory OTP store for session verification (keyed by query/mobile)
// In production with multiple instances, Redis or DB table can be used
const otpCache = new Map<string, { otp: string; expires: number; customerId: string }>();

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Please enter a valid Mobile Number or Policy Number" }, { status: 400 });
    }

    const cleanQuery = query.trim().replace(/\s+/g, "");

    // Search by mobile (exact or partial match) or policy number
    let customer = await prisma.customer.findFirst({
      where: {
        OR: [
          { mobile: cleanQuery },
          { alternateMobile: cleanQuery },
          {
            policies: {
              some: {
                policyNumber: {
                  equals: cleanQuery,
                },
              },
            },
          },
        ],
      },
      include: {
        policies: true,
      },
    });

    // If query is formatted like 10-digit without country code, or with +91
    if (!customer && cleanQuery.length >= 10) {
      const last10 = cleanQuery.slice(-10);
      customer = await prisma.customer.findFirst({
        where: {
          OR: [
            { mobile: { contains: last10 } },
            { alternateMobile: { contains: last10 } },
          ],
        },
        include: {
          policies: true,
        },
      });
    }

    if (!customer) {
      return NextResponse.json(
        { error: "No policy records found matching this Mobile Number or Policy Number. Please contact your advisor at +91 62688 19299." },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpCache.set(cleanQuery, { otp, expires, customerId: customer.id });

    // Mask phone number for security, e.g. 98260XXXXX
    const rawMobile = customer.mobile;
    const maskedMobile = rawMobile.length >= 10 
      ? rawMobile.substring(0, 4) + "XXXX" + rawMobile.substring(rawMobile.length - 2)
      : rawMobile.substring(0, 2) + "****";

    return NextResponse.json({
      success: true,
      message: `Verification code sent to registered number ending in ${customer.mobile.slice(-4)}`,
      maskedMobile,
      // For immediate convenience during testing/review, provide demoOtp
      devOtp: otp,
      query: cleanQuery,
    });
  } catch (error) {
    console.error("OTP Request Error:", error);
    return NextResponse.json({ error: "Failed to send verification code. Please try again." }, { status: 500 });
  }
}

export { otpCache };
