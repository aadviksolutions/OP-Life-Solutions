import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        policies: {
          include: {
            documents: true,
            reminders: true,
          },
          orderBy: { expiryDate: "asc" },
        },
        documents: {
          orderBy: { uploadedAt: "desc" },
        },
        reminders: {
          include: {
            policy: {
              select: { policyNumber: true, policyType: true },
            },
          },
          orderBy: { scheduledDate: "desc" },
        },
        reminderLogs: {
          include: {
            policy: {
              select: { policyNumber: true },
            },
          },
          orderBy: { sentAt: "desc" },
        },
        enquiries: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ customer });
  } catch (error) {
    console.error("Get customer error:", error);
    return NextResponse.json({ error: "Failed to load customer" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const data = await req.json();

    const updated = await prisma.customer.update({
      where: { id },
      data: {
        name: data.name?.trim(),
        mobile: data.mobile?.trim().replace(/\s+/g, ""),
        alternateMobile: data.alternateMobile ? data.alternateMobile.trim().replace(/\s+/g, "") : null,
        email: data.email ? data.email.trim() : null,
        address: data.address ? data.address.trim() : null,
        city: data.city ? data.city.trim() : "Raipur",
        state: data.state ? data.state.trim() : "Chhattisgarh",
        pincode: data.pincode ? data.pincode.trim() : null,
        dob: data.dob ? new Date(data.dob) : null,
        notes: data.notes ? data.notes.trim() : null,
      },
    });

    await prisma.activityLog.create({
      data: {
        adminUserId: admin.id,
        action: "UPDATE_CUSTOMER",
        entity: "CUSTOMER",
        entityId: id,
        details: `Updated details for customer ${updated.name}`,
      },
    });

    return NextResponse.json({ success: true, customer: updated });
  } catch (error) {
    console.error("Update customer error:", error);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
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
    const customer = await prisma.customer.findUnique({
      where: { id },
      select: { name: true, customerId: true },
    });

    await prisma.customer.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        adminUserId: admin.id,
        action: "DELETE_CUSTOMER",
        entity: "CUSTOMER",
        entityId: id,
        details: `Deleted customer ${customer?.name} (${customer?.customerId})`,
      },
    });

    return NextResponse.json({ success: true, message: "Customer and linked records deleted" });
  } catch (error) {
    console.error("Delete customer error:", error);
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
