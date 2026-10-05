import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "ALL"; // ALL, 30_DAYS, 15_DAYS, 7_DAYS, EXPIRED
    const search = searchParams.get("search")?.trim() || "";

    const policies = await prisma.policy.findMany({
      include: {
        customer: true,
        reminders: {
          orderBy: { scheduledDate: "desc" },
        },
        reminderLogs: {
          take: 1,
          orderBy: { sentAt: "desc" },
        },
      },
      orderBy: { expiryDate: "asc" },
    });

    const now = new Date();

    const formatted = policies.map((p) => {
      const diffTime = new Date(p.expiryDate).getTime() - now.getTime();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let expiryCategory = "ACTIVE";
      if (daysRemaining < 0) expiryCategory = "EXPIRED";
      else if (daysRemaining <= 7) expiryCategory = "7_DAYS";
      else if (daysRemaining <= 15) expiryCategory = "15_DAYS";
      else if (daysRemaining <= 30) expiryCategory = "30_DAYS";

      const lastReminder = p.reminderLogs[0] || null;
      const nextReminder = p.reminders.find((r) => r.status === "PENDING") || null;

      return {
        id: p.id,
        policyNumber: p.policyNumber,
        policyType: p.policyType,
        insuranceCompany: p.insuranceCompany,
        expiryDate: p.expiryDate,
        premiumAmount: p.premiumAmount,
        sumInsured: p.sumInsured,
        vehicleNumber: p.vehicleNumber,
        insuredAsset: p.insuredAsset,
        policyStatus: p.policyStatus,
        daysRemaining,
        expiryCategory,
        customer: {
          id: p.customer.id,
          customerId: p.customer.customerId,
          name: p.customer.name,
          mobile: p.customer.mobile,
          email: p.customer.email,
        },
        lastReminder: lastReminder
          ? {
              channel: lastReminder.channel,
              sentAt: lastReminder.sentAt,
              status: lastReminder.status,
            }
          : null,
        nextReminder: nextReminder
          ? {
              id: nextReminder.id,
              channel: nextReminder.channel,
              scheduledDate: nextReminder.scheduledDate,
              reminderType: nextReminder.reminderType,
            }
          : null,
      };
    });

    // Apply filtering
    let results = formatted;

    if (filter === "30_DAYS") {
      results = results.filter((p) => p.daysRemaining >= 0 && p.daysRemaining <= 30);
    } else if (filter === "15_DAYS") {
      results = results.filter((p) => p.daysRemaining >= 0 && p.daysRemaining <= 15);
    } else if (filter === "7_DAYS") {
      results = results.filter((p) => p.daysRemaining >= 0 && p.daysRemaining <= 7);
    } else if (filter === "EXPIRED") {
      results = results.filter((p) => p.daysRemaining < 0);
    }

    if (search) {
      results = results.filter(
        (p) =>
          p.customer.name.toLowerCase().includes(search.toLowerCase()) ||
          p.customer.mobile.includes(search) ||
          p.policyNumber.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      renewals: results,
      counts: {
        total: formatted.length,
        expiring30: formatted.filter((p) => p.daysRemaining >= 0 && p.daysRemaining <= 30).length,
        expiring15: formatted.filter((p) => p.daysRemaining >= 0 && p.daysRemaining <= 15).length,
        expiring7: formatted.filter((p) => p.daysRemaining >= 0 && p.daysRemaining <= 7).length,
        expired: formatted.filter((p) => p.daysRemaining < 0).length,
      },
    });
  } catch (error) {
    console.error("Renewals fetch error:", error);
    return NextResponse.json({ error: "Failed to load renewals" }, { status: 500 });
  }
}

// POST: Trigger/Send Renewal Reminder
export async function POST(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { policyId, channel, customMessage } = await req.json();

    const policy = await prisma.policy.findUnique({
      where: { id: policyId },
      include: { customer: true },
    });

    if (!policy) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }

    const expiryFormatted = new Date(policy.expiryDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const defaultMessage = `Namaste ${policy.customer.name} ji, this is a reminder from Om Prakash Sahu Insurance Services regarding your ${policy.insuranceCompany} ${policy.policyType} Policy (#${policy.policyNumber}) expiring on ${expiryFormatted}. Please connect with us at +91 98261 45892 for timely renewal and un-interrupted protection.`;

    const messageBody = customMessage?.trim() || defaultMessage;
    const recipient = channel === "EMAIL" ? policy.customer.email || policy.customer.mobile : policy.customer.mobile;

    // Create reminder log
    const log = await prisma.reminderHistory.create({
      data: {
        policyId: policy.id,
        customerId: policy.customerId,
        channel: channel || "WHATSAPP",
        recipient: recipient || policy.customer.mobile,
        messageBody,
        status: "SENT",
        sentAt: new Date(),
      },
    });

    // Mark any pending reminder for this policy as completed
    await prisma.reminder.updateMany({
      where: {
        policyId: policy.id,
        status: "PENDING",
      },
      data: {
        status: "SENT",
        sentAt: new Date(),
      },
    });

    // Activity log
    await prisma.activityLog.create({
      data: {
        adminUserId: admin.id,
        action: "SEND_REMINDER",
        entity: "REMINDER",
        entityId: log.id,
        details: `Sent ${channel} reminder to ${policy.customer.name} for policy ${policy.policyNumber}`,
      },
    });

    // Generate WhatsApp direct URL if WhatsApp
    let whatsappUrl = null;
    if (channel === "WHATSAPP") {
      const cleanPhone = policy.customer.mobile.replace(/\D/g, "");
      const fullPhone = cleanPhone.startsWith("91") ? cleanPhone : "91" + cleanPhone;
      whatsappUrl = `https://api.whatsapp.com/send?phone=${fullPhone}&text=${encodeURIComponent(messageBody)}`;
    }

    return NextResponse.json({
      success: true,
      message: `Reminder recorded and queued for ${policy.customer.name} via ${channel}`,
      log,
      whatsappUrl,
    });
  } catch (error) {
    console.error("Send reminder error:", error);
    return NextResponse.json({ error: "Failed to send reminder" }, { status: 500 });
  }
}
