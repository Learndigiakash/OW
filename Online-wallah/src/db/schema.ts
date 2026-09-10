import { pgTable, serial, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  icon: varchar("icon", { length: 50 }).default("Briefcase"),
  description: text("description"),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Posts table (Core content for Latest Jobs, Results, Admit Cards, etc.)
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 300 }).notNull(),
  slug: varchar("slug", { length: 300 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull(), // 'latest-jobs', 'results', 'admit-card', 'answer-key', 'syllabus', 'admission', 'engineering'
  subcategory: varchar("subcategory", { length: 100 }).default("General"), // 'UPSC', 'SSC', 'Railway', 'Banking', 'State PSC', 'Police', 'Defense', 'Teaching', 'NTA'
  year: integer("year").default(2026).notNull(),
  organization: varchar("organization", { length: 200 }).default(""), // e.g. "Staff Selection Commission", "Union Public Service Commission"
  totalVacancies: varchar("total_vacancies", { length: 100 }).default(""), // e.g. "17,727 Posts", "N/A"
  qualificationSummary: varchar("qualification_summary", { length: 250 }).default(""), // e.g. "10th / 12th / Graduate"
  shortDesc: text("short_desc").notNull(),
  fullContent: text("full_content").default(""),
  status: varchar("status", { length: 50 }).default("published").notNull(), // 'published', 'draft'
  isPinned: boolean("is_pinned").default(false).notNull(),
  isNew: boolean("is_new").default(false).notNull(),
  isUpdated: boolean("is_updated").default(false).notNull(),

  // Structured JSON fields for High CTR Sarkari-style data
  importantDates: jsonb("important_dates").$type<Array<{ label: string; value: string; isHighlight?: boolean }>>().default([]),
  applicationFee: jsonb("application_fee").$type<Array<{ category: string; fee: string; notes?: string }>>().default([]),
  feePaymentMode: text("fee_payment_mode").default("Debit Card / Credit Card / Net Banking / UPI / E-Challan"),
  ageLimit: jsonb("age_limit").$type<{ minAge?: string; maxAge?: string; asOnDate?: string; extraNotes?: string }>().default({}),
  vacancyDetails: jsonb("vacancy_details").$type<Array<{ postName: string; totalPosts: string; eligibility: string; ageLimit?: string; categoryWise?: Record<string, string> }>>().default([]),
  importantLinks: jsonb("important_links").$type<Array<{ label: string; url: string; linkType?: string; isHighlighted?: boolean }>>().default([]),
  howToApply: jsonb("how_to_apply").$type<string[]>().default([]),
  selectionProcess: jsonb("selection_process").$type<string[]>().default([]),
  extraDetails: jsonb("extra_details").$type<Record<string, any>>().default({}),

  // SEO fields
  metaTitle: varchar("meta_title", { length: 200 }),
  metaDescription: varchar("meta_description", { length: 320 }),
  viewsCount: integer("views_count").default(0).notNull(),

  // Timestamps
  publishDate: timestamp("publish_date").defaultNow().notNull(),
  lastModified: timestamp("last_modified").defaultNow().notNull(),
  createdBy: varchar("created_by", { length: 100 }).default("OnlineWallah Editorial Team"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Important official portals / links directory
export const importantLinks = pgTable("important_links", {
  id: serial("id").primaryKey(),
  label: varchar("label", { length: 200 }).notNull(),
  url: text("url").notNull(),
  category: varchar("category", { length: 100 }).notNull(), // 'UPSC', 'SSC', 'Railway', 'Banking', 'Defense', 'State PSC', 'Teaching', 'Police', 'NTA', 'Admissions'
  description: text("description"),
  displayOrder: integer("display_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Admin users table
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 50 }).default("admin").notNull(), // 'admin', 'editor'
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Breaking news ticker
export const newsTicker = pgTable("news_ticker", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  linkUrl: text("link_url").default(""),
  badgeText: varchar("badge_text", { length: 50 }).default("NEW"), // 'NEW', 'UPDATED', 'ALERT', 'OUT'
  isActive: boolean("is_active").default(true).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Contact messages from candidates
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  subject: varchar("subject", { length: 250 }).notNull(),
  message: text("message").notNull(),
  isResolved: boolean("is_resolved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Job alert email / SMS subscribers
export const jobAlertsSubscribers = pgTable("job_alerts_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  phone: varchar("phone", { length: 50 }),
  categoryPreference: varchar("category_preference", { length: 100 }).default("all"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type ImportantLink = typeof importantLinks.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
export type NewsTicker = typeof newsTicker.$inferSelect;
