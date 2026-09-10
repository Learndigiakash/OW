import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { jobAlertsSubscribers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { email, phone, categoryPreference } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email address is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await db
      .select()
      .from(jobAlertsSubscribers)
      .where(eq(jobAlertsSubscribers.email, cleanEmail));

    if (existing.length > 0) {
      return NextResponse.json({
        success: true,
        message: "You are already subscribed to OnlineWallah alerts!",
      });
    }

    await db.insert(jobAlertsSubscribers).values({
      email: cleanEmail,
      phone: phone?.trim() || null,
      categoryPreference: categoryPreference || "all",
    });

    return NextResponse.json({
      success: true,
      message: "Subscription successful! You will now receive Sarkari job & exam alerts directly.",
    });
  } catch (error: any) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
