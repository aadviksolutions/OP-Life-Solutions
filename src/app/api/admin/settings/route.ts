import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    let settings = await prisma.adminSettings.findUnique({
      where: { id: "default-settings" },
    });

    if (!settings) {
      settings = await prisma.adminSettings.create({
        data: { id: "default-settings" },
      });
    }

    // Mask secret keys for safety before returning
    const safeSettings = {
      ...settings,
      smsApiKey: settings.smsApiKey ? "••••••••••••••••" : "",
      whatsappApiKey: settings.whatsappApiKey ? "••••••••••••••••" : "",
      emailApiKey: settings.emailApiKey ? "••••••••••••••••" : "",
    };

    return NextResponse.json({ settings: safeSettings });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();

    const updatePayload: any = {
      companyName: data.companyName,
      tagline: data.tagline,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      workingHours: data.workingHours,
      heroHeadline: data.heroHeadline,
      heroSubheading: data.heroSubheading,
      yearsExperience: data.yearsExperience,
      customersServed: data.customersServed,
      claimsSupportRate: data.claimsSupportRate,
      aboutStory: data.aboutStory,
      smsEnabled: data.smsEnabled,
      whatsappEnabled: data.whatsappEnabled,
      emailEnabled: data.emailEnabled,
      reminderDaysJson: data.reminderDaysJson,
    };

    // Only update API keys if not the masked string
    if (data.smsApiKey && !data.smsApiKey.includes("••••")) {
      updatePayload.smsApiKey = data.smsApiKey;
    }
    if (data.smsSenderId) {
      updatePayload.smsSenderId = data.smsSenderId;
    }
    if (data.whatsappApiKey && !data.whatsappApiKey.includes("••••")) {
      updatePayload.whatsappApiKey = data.whatsappApiKey;
    }
    if (data.emailApiKey && !data.emailApiKey.includes("••••")) {
      updatePayload.emailApiKey = data.emailApiKey;
    }
    if (data.emailFrom) {
      updatePayload.emailFrom = data.emailFrom;
    }

    const updated = await prisma.adminSettings.upsert({
      where: { id: "default-settings" },
      update: updatePayload,
      create: { id: "default-settings", ...updatePayload },
    });

    await prisma.activityLog.create({
      data: {
        adminUserId: admin.id,
        action: "UPDATE_SETTINGS",
        entity: "SETTINGS",
        entityId: "default-settings",
        details: "Updated agency configuration and preferences",
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
