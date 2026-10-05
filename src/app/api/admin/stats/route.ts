import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const in30Days = new Date(now);
    in30Days.setDate(in30Days.getDate() + 30);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const [
      totalCustomers,
      totalPolicies,
      activePolicies,
      expiredPolicies,
      expiringSoonPolicies,
      renewalsThisMonth,
      pendingReminders,
      newEnquiries,
      policies,
      recentEnquiries,
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.policy.count(),
      prisma.policy.count({
        where: {
          expiryDate: { gte: now },
        },
      }),
      prisma.policy.count({
        where: {
          expiryDate: { lt: now },
        },
      }),
      prisma.policy.count({
        where: {
          expiryDate: {
            gte: now,
            lte: in30Days,
          },
        },
      }),
      prisma.policy.count({
        where: {
          expiryDate: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      }),
      prisma.reminder.count({
        where: {
          status: "PENDING",
        },
      }),
      prisma.enquiry.count({
        where: {
          status: "NEW",
        },
      }),
      prisma.policy.findMany({
        include: {
          customer: {
            select: { name: true, mobile: true },
          },
        },
        orderBy: { expiryDate: "asc" },
      }),
      prisma.enquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Calculate premium sum
    const totalPremium = policies.reduce((acc, p) => acc + (p.premiumAmount || 0), 0);
    const totalSumInsured = policies.reduce((acc, p) => acc + (p.sumInsured || 0), 0);

    // Distribution by Type
    const typeCounts: Record<string, number> = {};
    const companyCounts: Record<string, number> = {};

    policies.forEach((p) => {
      typeCounts[p.policyType] = (typeCounts[p.policyType] || 0) + 1;
      companyCounts[p.insuranceCompany] = (companyCounts[p.insuranceCompany] || 0) + 1;
    });

    // Upcoming expiries list with days remaining
    const upcomingExpiries = policies
      .map((p) => {
        const diffTime = new Date(p.expiryDate).getTime() - now.getTime();
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return {
          id: p.id,
          policyNumber: p.policyNumber,
          policyType: p.policyType,
          insuranceCompany: p.insuranceCompany,
          customerName: p.customer.name,
          mobile: p.customer.mobile,
          premiumAmount: p.premiumAmount,
          expiryDate: p.expiryDate,
          daysRemaining,
          status: daysRemaining < 0 ? "EXPIRED" : daysRemaining <= 30 ? "EXPIRING_SOON" : "ACTIVE",
        };
      })
      .slice(0, 8);

    return NextResponse.json({
      summary: {
        totalCustomers,
        totalPolicies,
        activePolicies,
        expiringSoon: expiringSoonPolicies,
        expiredPolicies,
        renewalsThisMonth,
        pendingFollowups: pendingReminders + newEnquiries,
        totalPremium,
        totalSumInsured,
      },
      distribution: {
        byType: typeCounts,
        byCompany: companyCounts,
      },
      upcomingExpiries,
      recentEnquiries,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ error: "Failed to load dashboard metrics" }, { status: 500 });
  }
}
