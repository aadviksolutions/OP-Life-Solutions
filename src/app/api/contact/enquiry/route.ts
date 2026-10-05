import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, mobile, email, insuranceType, message } = await req.json();

    if (!name || !mobile || !insuranceType) {
      return NextResponse.json(
        { error: "Name, Mobile Number and Insurance Type are required." },
        { status: 400 }
      );
    }

    const cleanMobile = mobile.trim().replace(/\s+/g, "");

    // Check if mobile matches an existing customer
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        OR: [{ mobile: cleanMobile }, { alternateMobile: cleanMobile }],
      },
    });

    const enquiry = await prisma.enquiry.create({
      data: {
        name: name.trim(),
        mobile: cleanMobile,
        email: email ? email.trim() : null,
        insuranceType,
        message: message ? message.trim() : "Requested consultation for " + insuranceType,
        customerId: existingCustomer?.id || null,
        status: "NEW",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! Advisor Om Prakash Sahu will contact you shortly.",
      enquiryId: enquiry.id,
    });
  } catch (error) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry. Please call us directly at +91 98261 45892." },
      { status: 500 }
    );
  }
}
