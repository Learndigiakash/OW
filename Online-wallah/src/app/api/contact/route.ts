import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.email || !body.message || !body.subject) {
      return NextResponse.json(
        { error: "Name, email, subject, and message are required" },
        { status: 400 }
      );
    }

    const newMsg = await db
      .insert(contactMessages)
      .values({
        name: body.name.trim(),
        email: body.email.trim(),
        phone: body.phone?.trim() || null,
        subject: body.subject.trim(),
        message: body.message.trim(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! Our team will review your query.",
      id: newMsg[0].id,
    });
  } catch (error: any) {
    console.error("Contact error:", error);
    return NextResponse.json({ error: "Failed to submit message" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt))
      .limit(50);

    return NextResponse.json({ messages });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
