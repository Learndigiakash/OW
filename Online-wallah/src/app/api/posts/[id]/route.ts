import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const isNumeric = /^\d+$/.test(id);

    let post;
    if (isNumeric) {
      const rows = await db.select().from(posts).where(eq(posts.id, parseInt(id))).limit(1);
      post = rows[0];
    } else {
      const rows = await db.select().from(posts).where(eq(posts.slug, id)).limit(1);
      post = rows[0];
    }

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Increment views count asynchronously
    await db
      .update(posts)
      .set({ viewsCount: sql`${posts.viewsCount} + 1` })
      .where(eq(posts.id, post.id));

    return NextResponse.json({ post });
  } catch (error: any) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const postId = parseInt(id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const body = await req.json();

    const cleanSlug = body.slug
      ? body.slug
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9-]/g, "-")
          .replace(/-+/g, "-")
      : undefined;

    const updateData: any = {
      lastModified: new Date(),
    };

    if (body.title !== undefined) updateData.title = body.title;
    if (cleanSlug !== undefined) updateData.slug = cleanSlug;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.subcategory !== undefined) updateData.subcategory = body.subcategory;
    if (body.year !== undefined) updateData.year = parseInt(body.year);
    if (body.organization !== undefined) updateData.organization = body.organization;
    if (body.totalVacancies !== undefined) updateData.totalVacancies = body.totalVacancies;
    if (body.qualificationSummary !== undefined) updateData.qualificationSummary = body.qualificationSummary;
    if (body.shortDesc !== undefined) updateData.shortDesc = body.shortDesc;
    if (body.fullContent !== undefined) updateData.fullContent = body.fullContent;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.isPinned !== undefined) updateData.isPinned = Boolean(body.isPinned);
    if (body.isNew !== undefined) updateData.isNew = Boolean(body.isNew);
    if (body.isUpdated !== undefined) updateData.isUpdated = Boolean(body.isUpdated);
    if (body.importantDates !== undefined) updateData.importantDates = body.importantDates;
    if (body.applicationFee !== undefined) updateData.applicationFee = body.applicationFee;
    if (body.feePaymentMode !== undefined) updateData.feePaymentMode = body.feePaymentMode;
    if (body.ageLimit !== undefined) updateData.ageLimit = body.ageLimit;
    if (body.vacancyDetails !== undefined) updateData.vacancyDetails = body.vacancyDetails;
    if (body.importantLinks !== undefined) updateData.importantLinks = body.importantLinks;
    if (body.howToApply !== undefined) updateData.howToApply = body.howToApply;
    if (body.selectionProcess !== undefined) updateData.selectionProcess = body.selectionProcess;
    if (body.extraDetails !== undefined) updateData.extraDetails = body.extraDetails;
    if (body.metaTitle !== undefined) updateData.metaTitle = body.metaTitle;
    if (body.metaDescription !== undefined) updateData.metaDescription = body.metaDescription;
    if (body.publishDate !== undefined) updateData.publishDate = new Date(body.publishDate);

    const updated = await db
      .update(posts)
      .set(updateData)
      .where(eq(posts.id, postId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, post: updated[0] });
  } catch (error: any) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const postId = parseInt(id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const deleted = await db.delete(posts).where(eq(posts.id, postId)).returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Post deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post", details: error.message },
      { status: 500 }
    );
  }
}
