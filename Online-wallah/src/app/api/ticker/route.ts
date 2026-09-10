import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { newsTicker } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";
import { asc, desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    const query = db.select().from(newsTicker);
    if (!all) {
      const activeItems = await db
        .select()
        .from(newsTicker)
        .where(eq(newsTicker.isActive, true))
        .orderBy(asc(newsTicker.displayOrder), desc(newsTicker.createdAt));
      return NextResponse.json({ items: activeItems });
    }

    const items = await query.orderBy(asc(newsTicker.displayOrder), desc(newsTicker.createdAt));
    return NextResponse.json({ items });
  } catch (error: any) {
    console.error("Ticker fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch ticker" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const item = await db
      .insert(newsTicker)
      .values({
        message: body.message,
        linkUrl: body.linkUrl || "",
        badgeText: body.badgeText || "NEW",
        isActive: body.isActive !== undefined ? body.isActive : true,
        displayOrder: parseInt(body.displayOrder) || 0,
      })
      .returning();

    return NextResponse.json({ success: true, item: item[0] }, { status: 201 });
  } catch (error: any) {
    console.error("Ticker creation error:", error);
    return NextResponse.json({ error: "Failed to create ticker item" }, { status: 500 });
  }
}
