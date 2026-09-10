import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminPortalsManagerClient from "@/components/admin/AdminPortalsManagerClient";

export default async function AdminPortalsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/wallah-admin/login");
  }

  return <AdminPortalsManagerClient user={session} />;
}
