import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminPostsManagerClient from "@/components/admin/AdminPostsManagerClient";

export default async function AdminPostsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/wallah-admin/login");
  }

  return <AdminPostsManagerClient user={session} />;
}
