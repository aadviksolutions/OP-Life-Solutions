import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";
import * as XLSX from "xlsx";

export async function GET(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "customers"; // customers, policies, renewals
    const format = searchParams.get("format") || "csv"; // csv, xlsx

    if (type === "customers") {
      const customers = await prisma.customer.findMany({
        include: {
          policies: true,
        },
        orderBy: { createdAt: "desc" },
      });

      const rows = customers.map((c) => ({
        "Customer ID": c.customerId,
        "Customer Name": c.name,
        "Mobile Number": c.mobile,
        "Alternate Mobile": c.alternateMobile || "",
        "Email Address": c.email || "",
        City: c.city || "",
        State: c.state || "",
        Pincode: c.pincode || "",
        "Total Policies": c.policies.length,
        "Created Date": c.createdAt.toISOString().split("T")[0],
        Notes: c.notes || "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

      if (format === "xlsx") {
        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": 'attachment; filename="OPS_Customers_Export.xlsx"',
          },
        });
      } else {
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        return new NextResponse(csv, {
          headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": 'attachment; filename="OPS_Customers_Export.csv"',
          },
        });
      }
    } else if (type === "policies" || type === "renewals") {
      const policies = await prisma.policy.findMany({
        include: {
          customer: true,
        },
        orderBy: { expiryDate: "asc" },
      });

      const now = new Date();
      const rows = policies.map((p) => {
        const diffDays = Math.ceil((new Date(p.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return {
          "Policy ID": p.policyId,
          "Policy Number": p.policyNumber,
          "Customer Name": p.customer.name,
          "Customer Mobile": p.customer.mobile,
          "Policy Type": p.policyType,
          "Insurance Company": p.insuranceCompany,
          "Purchase Date": p.purchaseDate.toISOString().split("T")[0],
          "Start Date": p.startDate.toISOString().split("T")[0],
          "Expiry Date": p.expiryDate.toISOString().split("T")[0],
          "Days Remaining": diffDays,
          "Policy Status": p.policyStatus,
          "Premium Amount (INR)": p.premiumAmount,
          "Sum Insured (INR)": p.sumInsured,
          "Vehicle / Insured Asset": p.vehicleNumber || p.insuredAsset || "",
          "Advisor / Agent": p.agentAdvisor || "Om Prakash Sahu",
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Policies");

      if (format === "xlsx") {
        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": 'attachment; filename="OPS_Policies_Report.xlsx"',
          },
        });
      } else {
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        return new NextResponse(csv, {
          headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": 'attachment; filename="OPS_Policies_Report.csv"',
          },
        });
      }
    }

    return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
