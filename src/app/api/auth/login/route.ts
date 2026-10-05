import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { usernameOrEmail, password, rememberMe } = await req.json();

    if (!usernameOrEmail || !password) {
      return NextResponse.json(
        { error: "Username/Email and Password are required." },
        { status: 400 }
      );
    }

    const cleanInput = usernameOrEmail.trim();

    const user = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { username: cleanInput },
          { email: cleanInput },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials. Please verify your login details." },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials. Please verify your login details." },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await createSessionToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // Record activity log
    try {
      await prisma.activityLog.create({
        data: {
          adminUserId: user.id,
          action: "LOGIN",
          entity: "AUTH",
          entityId: user.id,
          details: `Admin user ${user.name} logged in successfully.`,
          ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
        },
      });
    } catch (e) {
      console.error("Activity log error:", e);
    }

    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60; // 30 days or 7 days

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set({
      name: "ops_admin_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    return response;
  } catch (error) {
    console.error("Admin Login Error:", error);
    return NextResponse.json({ error: "Authentication failed. Server error." }, { status: 500 });
  }
}
