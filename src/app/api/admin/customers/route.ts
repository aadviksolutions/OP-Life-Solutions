import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const city = searchParams.get("city")?.trim() || "";

    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { mobile: { contains: search } },
        { email: { contains: search } },
        { customerId: { contains: search } },
        {
          policies: {
            some: {
              policyNumber: { contains: search },
            },
          },
        },
      ];
    }

    if (city) {
      whereClause.city = { contains: city };
    }

    const customers = await prisma.customer.findMany({
      where: whereClause,
      include: {
        policies: {
          select: {
            id: true,
            policyNumber: true,
            policyType: true,
            insuranceCompany: true,
            expiryDate: true,
            premiumAmount: true,
            policyStatus: true,
          },
        },
        _count: {
          select: {
            policies: true,
            documents: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ customers });
  } catch (error) {
    console.error("Customers list error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const { name, mobile, alternateMobile, email, address, city, state, pincode, dob, notes } = data;

    if (!name || !mobile) {
      return NextResponse.json({ error: "Customer Name and Mobile Number are required" }, { status: 400 });
    }

    const cleanMobile = mobile.trim().replace(/\s+/g, "");

    // Check duplicate mobile
    const existing = await prisma.customer.findFirst({
      where: { mobile: cleanMobile },
    });
    if (existing) {
      return NextResponse.json({ error: "A customer with this mobile number already exists." }, { status: 409 });
    }

    // Auto-generate customer ID: OPS-CUST-XXXX
    const count = await prisma.customer.count();
    const customerId = `OPS-CUST-${1001 + count}`;

    const newCustomer = await prisma.customer.create({
      data: {
        customerId,
        name: name.trim(),
        mobile: cleanMobile,
        alternateMobile: alternateMobile ? alternateMobile.trim() : null,
        email: email ? email.trim() : null,
        address: address ? address.trim() : null,
        city: city ? city.trim() : "Raipur",
        state: state ? state.trim() : "Chhattisgarh",
        pincode: pincode ? pincode.trim() : null,
        dob: dob ? new Date(dob) : null,
        notes: notes ? notes.trim() : null,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        adminUserId: admin.id,
        action: "CREATE_CUSTOMER",
        entity: "CUSTOMER",
        entityId: newCustomer.id,
        details: `Created customer ${newCustomer.name} (${newCustomer.customerId})`,
      },
    });

    return NextResponse.json({ success: true, customer: newCustomer });
  } catch (error) {
    console.error("Create customer error:", error);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
