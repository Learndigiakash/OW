import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminPostEditorForm from "@/components/admin/AdminPostEditorForm";

export default async function AdminNewPostPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/wallah-admin/login");
  }

  return <AdminPostEditorForm isEditMode={false} />;
}
