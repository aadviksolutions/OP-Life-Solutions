import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const type = searchParams.get("type")?.trim() || "";
    const company = searchParams.get("company")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const customerId = searchParams.get("customerId")?.trim() || "";

    const where: any = {};

    if (customerId) {
      where.customerId = customerId;
    }

    if (type && type !== "ALL") {
      where.policyType = type;
    }

    if (company && company !== "ALL") {
      where.insuranceCompany = company;
    }

    if (status && status !== "ALL") {
      where.policyStatus = status;
    }

    if (search) {
      where.OR = [
        { policyNumber: { contains: search } },
        { vehicleNumber: { contains: search } },
        { customer: { name: { contains: search } } },
        { customer: { mobile: { contains: search } } },
      ];
    }

    const policies = await prisma.policy.findMany({
      where,
      include: {
        customer: {
          select: { id: true, customerId: true, name: true, mobile: true, email: true },
        },
        documents: true,
        _count: {
          select: { documents: true, reminders: true },
        },
      },
      orderBy: { expiryDate: "asc" },
    });

    const now = new Date();
    const formatted = policies.map((p) => {
      const diffTime = new Date(p.expiryDate).getTime() - now.getTime();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return {
        ...p,
        daysRemaining,
      };
    });

    return NextResponse.json({ policies: formatted });
  } catch (error) {
    console.error("Policies list error:", error);
    return NextResponse.json({ error: "Failed to fetch policies" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const {
      customerId,
      policyType,
      policyNumber,
      insuranceCompany,
      purchaseDate,
      startDate,
      expiryDate,
      premiumAmount,
      sumInsured,
      vehicleNumber,
      insuredAsset,
      policyStatus,
      renewalDate,
      agentAdvisor,
      notes,
    } = data;

    if (!customerId || !policyType || !policyNumber || !insuranceCompany || !expiryDate) {
      return NextResponse.json(
        { error: "Customer, Policy Type, Policy Number, Insurance Company, and Expiry Date are required." },
        { status: 400 }
      );
    }

    // Check duplicate policy number
    const existing = await prisma.policy.findUnique({
      where: { policyNumber: policyNumber.trim() },
    });
    if (existing) {
      return NextResponse.json({ error: "A policy with this Policy Number already exists." }, { status: 409 });
    }

    const count = await prisma.policy.count();
    const policyId = `OPS-POL-${2001 + count}`;

    const expDate = new Date(expiryDate);
    const purDate = purchaseDate ? new Date(purchaseDate) : new Date();
    const strDate = startDate ? new Date(startDate) : purDate;

    // Determine status automatically if not explicitly given
    let status = policyStatus || "ACTIVE";
    const now = new Date();
    const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (!policyStatus) {
      if (diffDays < 0) status = "EXPIRED";
      else if (diffDays <= 30) status = "EXPIRING_SOON";
      else status = "ACTIVE";
    }

    const newPolicy = await prisma.policy.create({
      data: {
        policyId,
        customerId,
        policyType,
        policyNumber: policyNumber.trim(),
        insuranceCompany,
        purchaseDate: purDate,
        startDate: strDate,
        expiryDate: expDate,
        premiumAmount: parseFloat(premiumAmount) || 0,
        sumInsured: parseFloat(sumInsured) || 0,
        vehicleNumber: vehicleNumber ? vehicleNumber.trim() : null,
        insuredAsset: insuredAsset ? insuredAsset.trim() : null,
        policyStatus: status,
        renewalDate: renewalDate ? new Date(renewalDate) : expDate,
        agentAdvisor: agentAdvisor ? agentAdvisor.trim() : "Om Prakash Sahu",
        notes: notes ? notes.trim() : null,
      },
      include: {
        customer: true,
      },
    });

    // Create auto reminders: 30, 15, 7 days before expiry
    const thresholds = [30, 15, 7, 1];
    for (const t of thresholds) {
      const sched = new Date(expDate);
      sched.setDate(sched.getDate() - t);
      if (sched > now) {
        await prisma.reminder.create({
          data: {
            policyId: newPolicy.id,
            customerId: newPolicy.customerId,
            reminderType: `EXPIRY_${t}`,
            scheduledDate: sched,
            channel: "WHATSAPP",
            status: "PENDING",
            notes: `Auto reminder ${t} days prior to expiry`,
          },
        });
      }
    }

    await prisma.activityLog.create({
      data: {
        adminUserId: admin.id,
        action: "CREATE_POLICY",
        entity: "POLICY",
        entityId: newPolicy.id,
        details: `Created ${newPolicy.policyType} policy ${newPolicy.policyNumber} for ${newPolicy.customer.name}`,
      },
    });

    return NextResponse.json({ success: true, policy: newPolicy });
  } catch (error) {
    console.error("Create policy error:", error);
    return NextResponse.json({ error: "Failed to create policy" }, { status: 500 });
  }
}
