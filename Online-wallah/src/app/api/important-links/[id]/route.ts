import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { importantLinks } from "@/db/schema";
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
    const linkId = parseInt(id);
    const body = await req.json();

    const updated = await db
      .update(importantLinks)
      .set({
        label: body.label !== undefined ? body.label : undefined,
        url: body.url !== undefined ? body.url : undefined,
        category: body.category !== undefined ? body.category : undefined,
        description: body.description !== undefined ? body.description : undefined,
        displayOrder: body.displayOrder !== undefined ? parseInt(body.displayOrder) : undefined,
        isActive: body.isActive !== undefined ? body.isActive : undefined,
      })
      .where(eq(importantLinks.id, linkId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: updated[0] });
  } catch (error: any) {
    console.error("Link update error:", error);
    return NextResponse.json({ error: "Failed to update portal link" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const linkId = parseInt(id);

    const deleted = await db.delete(importantLinks).where(eq(importantLinks.id, linkId)).returning();
    if (deleted.length === 0) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Link deleted" });
  } catch (error: any) {
    console.error("Link delete error:", error);
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 });
  }
}
