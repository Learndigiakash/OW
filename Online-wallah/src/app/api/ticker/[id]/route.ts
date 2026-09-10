import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { newsTicker } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const tickerId = parseInt(id);
    const body = await req.json();

    const updated = await db
      .update(newsTicker)
      .set({
        message: body.message !== undefined ? body.message : undefined,
        linkUrl: body.linkUrl !== undefined ? body.linkUrl : undefined,
        badgeText: body.badgeText !== undefined ? body.badgeText : undefined,
        isActive: body.isActive !== undefined ? body.isActive : undefined,
        displayOrder: body.displayOrder !== undefined ? parseInt(body.displayOrder) : undefined,
      })
      .where(eq(newsTicker.id, tickerId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Ticker item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: updated[0] });
  } catch (error: any) {
    console.error("Ticker update error:", error);
    return NextResponse.json({ error: "Failed to update ticker item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const tickerId = parseInt(id);

    const deleted = await db.delete(newsTicker).where(eq(newsTicker.id, tickerId)).returning();
    if (deleted.length === 0) {
      return NextResponse.json({ error: "Ticker item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Ticker item deleted" });
  } catch (error: any) {
    console.error("Ticker delete error:", error);
    return NextResponse.json({ error: "Failed to delete ticker item" }, { status: 500 });
  }
}
