import { redirect, notFound } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import AdminPostEditorForm from "@/components/admin/AdminPostEditorForm";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditPostPage({ params }: EditPageProps) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/wallah-admin/login");
  }

  const { id } = await params;
  const postId = parseInt(id);
  if (isNaN(postId)) {
    notFound();
  }

  const rows = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
  if (rows.length === 0) {
    notFound();
  }

  return <AdminPostEditorForm initialData={rows[0]} isEditMode={true} />;
}
