import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminTickerManagerClient from "@/components/admin/AdminTickerManagerClient";

export default async function AdminTickerPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/wallah-admin/login");
  }

  return <AdminTickerManagerClient user={session} />;
}
