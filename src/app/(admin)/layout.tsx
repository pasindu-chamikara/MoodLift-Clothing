import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminGuard } from "@/components/admin/AdminGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#f9f9f9]">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto w-full">
          <div className="container mx-auto p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
