import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const data = await req.json();

    const expDate = data.expiryDate ? new Date(data.expiryDate) : undefined;
    const purDate = data.purchaseDate ? new Date(data.purchaseDate) : undefined;
    const strDate = data.startDate ? new Date(data.startDate) : undefined;
    const renDate = data.renewalDate ? new Date(data.renewalDate) : expDate;

    let computedStatus = data.policyStatus;
    if (!computedStatus && expDate) {
      const now = new Date();
      const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) computedStatus = "EXPIRED";
      else if (diffDays <= 30) computedStatus = "EXPIRING_SOON";
      else computedStatus = "ACTIVE";
    }

    const updated = await prisma.policy.update({
      where: { id },
      data: {
        policyType: data.policyType,
        policyNumber: data.policyNumber ? data.policyNumber.trim() : undefined,
        insuranceCompany: data.insuranceCompany,
        purchaseDate: purDate,
        startDate: strDate,
        expiryDate: expDate,
        premiumAmount: data.premiumAmount !== undefined ? parseFloat(data.premiumAmount) : undefined,
        sumInsured: data.sumInsured !== undefined ? parseFloat(data.sumInsured) : undefined,
        vehicleNumber: data.vehicleNumber !== undefined ? (data.vehicleNumber ? data.vehicleNumber.trim() : null) : undefined,
        insuredAsset: data.insuredAsset !== undefined ? (data.insuredAsset ? data.insuredAsset.trim() : null) : undefined,
        policyStatus: computedStatus,
        renewalDate: renDate,
        agentAdvisor: data.agentAdvisor,
        notes: data.notes,
      },
      include: {
        customer: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        adminUserId: admin.id,
        action: "UPDATE_POLICY",
        entity: "POLICY",
        entityId: id,
        details: `Updated policy ${updated.policyNumber} (${updated.policyType})`,
      },
    });

    return NextResponse.json({ success: true, policy: updated });
  } catch (error) {
    console.error("Update policy error:", error);
    return NextResponse.json({ error: "Failed to update policy" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const policy = await prisma.policy.findUnique({
      where: { id },
      select: { policyNumber: true },
    });

    await prisma.policy.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        adminUserId: admin.id,
        action: "DELETE_POLICY",
        entity: "POLICY",
        entityId: id,
        details: `Deleted policy ${policy?.policyNumber}`,
      },
    });

    return NextResponse.json({ success: true, message: "Policy deleted successfully" });
  } catch (error) {
    console.error("Delete policy error:", error);
    return NextResponse.json({ error: "Failed to delete policy" }, { status: 500 });
  }
}
