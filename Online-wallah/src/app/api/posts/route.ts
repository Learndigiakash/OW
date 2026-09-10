import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";
import { desc, and, eq, ilike, or, sql, count } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const yearParam = searchParams.get("year");
    const status = searchParams.get("status") || "published";
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const offset = (page - 1) * limit;
    const includeDrafts = searchParams.get("includeDrafts") === "true";

    // Build conditions array
    const conditions = [];

    if (!includeDrafts && status) {
      conditions.push(eq(posts.status, status));
    }

    if (category && category !== "all") {
      conditions.push(eq(posts.category, category));
    }

    if (subcategory && subcategory !== "all") {
      conditions.push(eq(posts.subcategory, subcategory));
    }

    if (yearParam && !isNaN(parseInt(yearParam))) {
      conditions.push(eq(posts.year, parseInt(yearParam)));
    }

    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      conditions.push(
        or(
          ilike(posts.title, q),
          ilike(posts.shortDesc, q),
          ilike(posts.organization, q),
          ilike(posts.qualificationSummary, q),
          ilike(posts.subcategory, q)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const totalCountRes = await db
      .select({ count: count() })
      .from(posts)
      .where(whereClause);
    const total = totalCountRes[0]?.count || 0;

    // Get items sorted by pinned first, then lastModified / publishDate desc
    const items = await db
      .select()
      .from(posts)
      .where(whereClause)
      .orderBy(desc(posts.isPinned), desc(posts.publishDate))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.title || !body.slug || !body.category) {
      return NextResponse.json(
        { error: "Title, slug, and category are required" },
        { status: 400 }
      );
    }

    // Ensure slug is sanitized
    const cleanSlug = body.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");

    // Check slug collision
    const existing = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, cleanSlug));

    if (existing.length > 0) {
      return NextResponse.json(
        { error: `Slug "${cleanSlug}" is already in use. Please choose a unique slug.` },
        { status: 400 }
      );
    }

    const newPost = await db
      .insert(posts)
      .values({
        title: body.title,
        slug: cleanSlug,
        category: body.category,
        subcategory: body.subcategory || "General",
        year: parseInt(body.year) || new Date().getFullYear(),
        organization: body.organization || "",
        totalVacancies: body.totalVacancies || "",
        qualificationSummary: body.qualificationSummary || "",
        shortDesc: body.shortDesc || body.title,
        fullContent: body.fullContent || "",
        status: body.status || "published",
        isPinned: Boolean(body.isPinned),
        isNew: Boolean(body.isNew),
        isUpdated: Boolean(body.isUpdated),
        importantDates: body.importantDates || [],
        applicationFee: body.applicationFee || [],
        feePaymentMode: body.feePaymentMode || "Online / Debit / Credit / Net Banking / UPI",
        ageLimit: body.ageLimit || {},
        vacancyDetails: body.vacancyDetails || [],
        importantLinks: body.importantLinks || [],
        howToApply: body.howToApply || [],
        selectionProcess: body.selectionProcess || [],
        extraDetails: body.extraDetails || {},
        metaTitle: body.metaTitle || body.title,
        metaDescription: body.metaDescription || body.shortDesc,
        publishDate: body.publishDate ? new Date(body.publishDate) : new Date(),
        lastModified: new Date(),
        createdBy: session.username,
      })
      .returning();

    return NextResponse.json({ success: true, post: newPost[0] }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post", details: error.message },
      { status: 500 }
    );
  }
}
