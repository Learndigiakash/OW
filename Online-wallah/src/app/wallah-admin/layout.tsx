import { ReactNode } from "react";
import { getAdminSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Panel | OnlineWallah.com",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased">
      {session && <AdminSidebar user={session} />}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
