import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { and, eq, ilike, or, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query.trim() || query.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }

    const cleanQuery = `%${query.trim()}%`;

    const results = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        category: posts.category,
        subcategory: posts.subcategory,
        organization: posts.organization,
        isNew: posts.isNew,
        isUpdated: posts.isUpdated,
        publishDate: posts.publishDate,
      })
      .from(posts)
      .where(
        and(
          eq(posts.status, "published"),
          or(
            ilike(posts.title, cleanQuery),
            ilike(posts.shortDesc, cleanQuery),
            ilike(posts.organization, cleanQuery),
            ilike(posts.subcategory, cleanQuery),
            ilike(posts.category, cleanQuery)
          )
        )
      )
      .orderBy(desc(posts.isPinned), desc(posts.publishDate))
      .limit(10);

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
