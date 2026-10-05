import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const doc = await prisma.policyDocument.findUnique({
      where: { id },
    });

    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Try to delete physical file if in /uploads
    if (doc.fileUrl.startsWith("/uploads/")) {
      const fullPath = path.join(process.cwd(), "public", doc.fileUrl);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (e) {
          console.error("File deletion error:", e);
        }
      }
    }

    await prisma.policyDocument.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        adminUserId: admin.id,
        action: "DELETE_DOCUMENT",
        entity: "DOCUMENT",
        entityId: id,
        details: `Deleted document ${doc.title}`,
      },
    });

    return NextResponse.json({ success: true, message: "Document deleted" });
  } catch (error) {
    console.error("Delete document error:", error);
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
