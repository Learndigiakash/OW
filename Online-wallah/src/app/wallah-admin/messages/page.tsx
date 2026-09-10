import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminMessagesClient from "@/components/admin/AdminMessagesClient";

export default async function AdminMessagesPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/wallah-admin/login");
  }

  return <AdminMessagesClient user={session} />;
}
