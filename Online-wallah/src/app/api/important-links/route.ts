import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { importantLinks } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";
import { asc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const all = searchParams.get("all") === "true";

    let query = db.select().from(importantLinks);

    if (category && category !== "all") {
      const items = await db
        .select()
        .from(importantLinks)
        .where(all ? eq(importantLinks.category, category) : eq(importantLinks.category, category))
        .orderBy(asc(importantLinks.displayOrder), asc(importantLinks.label));
      return NextResponse.json({ items });
    }

    const items = await query.orderBy(asc(importantLinks.displayOrder), asc(importantLinks.label));
    return NextResponse.json({ items });
  } catch (error: any) {
    console.error("Important links error:", error);
    return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.label || !body.url || !body.category) {
      return NextResponse.json({ error: "Label, URL, and category are required" }, { status: 400 });
    }

    const item = await db
      .insert(importantLinks)
      .values({
        label: body.label,
        url: body.url,
        category: body.category,
        description: body.description || "",
        displayOrder: parseInt(body.displayOrder) || 0,
        isActive: body.isActive !== undefined ? body.isActive : true,
      })
      .returning();

    return NextResponse.json({ success: true, item: item[0] }, { status: 201 });
  } catch (error: any) {
    console.error("Important links create error:", error);
    return NextResponse.json({ error: "Failed to create portal link" }, { status: 500 });
  }
}
