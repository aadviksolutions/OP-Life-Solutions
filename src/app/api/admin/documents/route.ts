import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");
    const policyId = searchParams.get("policyId");

    const where: any = {};
    if (customerId) where.customerId = customerId;
    if (policyId) where.policyId = policyId;

    const documents = await prisma.policyDocument.findMany({
      where,
      include: {
        customer: {
          select: { id: true, name: true, mobile: true, customerId: true },
        },
        policy: {
          select: { id: true, policyNumber: true, policyType: true, insuranceCompany: true },
        },
      },
      orderBy: { uploadedAt: "desc" },
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Documents fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const customerId = formData.get("customerId") as string;
    const policyId = (formData.get("policyId") as string) || null;
    const documentType = (formData.get("documentType") as string) || "POLICY_PDF";

    if (!file || !title || !customerId) {
      return NextResponse.json(
        { error: "File, Document Title, and Customer are required." },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and create unique timestamped name
    const ext = path.extname(file.name) || ".pdf";
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, "_");
    const fileName = `${Date.now()}_${baseName}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;

    const newDoc = await prisma.policyDocument.create({
      data: {
        title: title.trim(),
        documentType,
        fileUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || "application/pdf",
        customerId,
        policyId: policyId || null,
      },
      include: {
        customer: true,
        policy: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        adminUserId: admin.id,
        action: "UPLOAD_DOCUMENT",
        entity: "DOCUMENT",
        entityId: newDoc.id,
        details: `Uploaded ${newDoc.title} for customer ${newDoc.customer.name}`,
      },
    });

    return NextResponse.json({ success: true, document: newDoc });
  } catch (error) {
    console.error("Document upload error:", error);
    return NextResponse.json({ error: "Failed to upload document" }, { status: 500 });
  }
}
