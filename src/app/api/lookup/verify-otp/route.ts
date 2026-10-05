import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { otpCache } from "../request-otp/route";

export async function POST(req: NextRequest) {
  try {
    const { query, otp } = await req.json();
    if (!query || !otp) {
      return NextResponse.json({ error: "Missing query or OTP" }, { status: 400 });
    }

    const cleanQuery = query.trim().replace(/\s+/g, "");
    const cached = otpCache.get(cleanQuery);

    // Allow master test code "123456" for instant demo/testing convenience or matching generated OTP
    const isMasterOtp = otp.trim() === "123456";
    const isGeneratedOtp = cached && cached.otp === otp.trim() && cached.expires > Date.now();

    if (!isMasterOtp && !isGeneratedOtp) {
      return NextResponse.json({ error: "Invalid or expired verification code. Please try again or request a new code." }, { status: 400 });
    }

    let customerId = cached?.customerId;

    if (!customerId) {
      // Find customer by query
      const customer = await prisma.customer.findFirst({
        where: {
          OR: [
            { mobile: cleanQuery },
            { alternateMobile: cleanQuery },
            { policies: { some: { policyNumber: cleanQuery } } },
          ],
        },
      });
      if (!customer) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 });
      }
      customerId = customer.id;
    }

    // Fetch verified customer with all policies and documents
    const customerData = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        policies: {
          include: {
            documents: true,
            reminders: {
              take: 3,
              orderBy: { scheduledDate: "desc" },
            },
          },
          orderBy: { expiryDate: "asc" },
        },
        documents: true,
      },
    });

    if (!customerData) {
      return NextResponse.json({ error: "Customer record not found" }, { status: 404 });
    }

    // Calculate days remaining and update live status badges dynamically
    const now = new Date();
    const formattedPolicies = customerData.policies.map((pol) => {
      const expiry = new Date(pol.expiryDate);
      const diffTime = expiry.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let computedStatus = pol.policyStatus;
      if (diffDays < 0) {
        computedStatus = "EXPIRED";
      } else if (diffDays <= 30) {
        computedStatus = "EXPIRING_SOON";
      } else {
        computedStatus = "ACTIVE";
      }

      return {
        ...pol,
        daysRemaining: diffDays,
        computedStatus,
      };
    });

    // Remove OTP after successful verification
    otpCache.delete(cleanQuery);

    return NextResponse.json({
      success: true,
      customer: {
        id: customerData.id,
        customerId: customerData.customerId,
        name: customerData.name,
        mobile: customerData.mobile,
        email: customerData.email,
        city: customerData.city,
        state: customerData.state,
      },
      policies: formattedPolicies,
    });
  } catch (error) {
    console.error("OTP Verify Error:", error);
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
  }
}
