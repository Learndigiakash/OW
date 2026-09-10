import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts, newsTicker, importantLinks, jobAlertsSubscribers, contactMessages } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";
import { count, eq, desc, sql } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Counts per category
    const categoryCounts = await db
      .select({
        category: posts.category,
        count: count(),
      })
      .from(posts)
      .groupBy(posts.category);

    // Total counts
    const totalPostsRes = await db.select({ count: count() }).from(posts);
    const publishedRes = await db.select({ count: count() }).from(posts).where(eq(posts.status, "published"));
    const draftRes = await db.select({ count: count() }).from(posts).where(eq(posts.status, "draft"));
    const pinnedRes = await db.select({ count: count() }).from(posts).where(eq(posts.isPinned, true));
    const viewsRes = await db.select({ totalViews: sql<number>`sum(${posts.viewsCount})` }).from(posts);
    const tickerCountRes = await db.select({ count: count() }).from(newsTicker);
    const linksCountRes = await db.select({ count: count() }).from(importantLinks);
    const subscriberCountRes = await db.select({ count: count() }).from(jobAlertsSubscribers);
    const unreadMessagesRes = await db.select({ count: count() }).from(contactMessages).where(eq(contactMessages.isResolved, false));

    // Recent posts
    const recentPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        category: posts.category,
        status: posts.status,
        isPinned: posts.isPinned,
        isNew: posts.isNew,
        viewsCount: posts.viewsCount,
        publishDate: posts.publishDate,
      })
      .from(posts)
      .orderBy(desc(posts.lastModified))
      .limit(8);

    return NextResponse.json({
      totalPosts: totalPostsRes[0]?.count || 0,
      publishedPosts: publishedRes[0]?.count || 0,
      draftPosts: draftRes[0]?.count || 0,
      pinnedPosts: pinnedRes[0]?.count || 0,
      totalViews: viewsRes[0]?.totalViews || 0,
      tickerCount: tickerCountRes[0]?.count || 0,
      linksCount: linksCountRes[0]?.count || 0,
      subscribersCount: subscriberCountRes[0]?.count || 0,
      unreadMessagesCount: unreadMessagesRes[0]?.count || 0,
      categoryCounts: categoryCounts.reduce((acc: any, curr) => {
        acc[curr.category] = curr.count;
        return acc;
      }, {}),
      recentPosts,
    });
  } catch (error: any) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
