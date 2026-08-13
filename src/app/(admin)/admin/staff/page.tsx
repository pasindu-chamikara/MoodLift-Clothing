"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/db";
import { AdminUser } from "@/types";
import { Button } from "@/components/ui/button";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useAdminAuth } from "@/store/useAdminAuth";

export default function StaffManagementPage() {
  const { role: currentUserRole } = useAdminAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<'super_admin' | 'admin' | 'staff'>("staff");
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    loadAdmins();
  }, []);

  async function loadAdmins() {
    setIsLoading(true);
    try {
      const data = await adminService.getAdmins() as AdminUser[];
      setAdmins(data || []);
    } catch (error) {
      console.error("Failed to load admins:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      if (admins.some(a => a.username === username)) {
        setMessage({ text: "Username already exists.", type: "error" });
        return;
      }

      if (currentUserRole === 'admin' && role !== 'staff') {
        setMessage({ text: "Admins can only create staff users.", type: "error" });
        return;
      }

      await adminService.createAdmin({ username, password, role });
      setMessage({ text: "User created successfully.", type: "success" });
      setUsername("");
      setPassword("");
      setRole("staff");
      await loadAdmins();
    } catch (error) {
      console.error("Failed to create user:", error);
      setMessage({ text: "Failed to create user.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string, targetRole: string) {
    if (targetRole === 'super_admin') {
      alert("Super admin accounts cannot be deleted.");
      return;
    }
    if (currentUserRole === 'admin' && targetRole !== 'staff') {
      alert("Admins can only delete staff users.");
      return;
    }
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await adminService.deleteAdmin(id);
        await loadAdmins();
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete user.");
      }
    }
  }

  return (
    <AdminGuard allowedRoles={['super_admin', 'admin']}>
      <div className="space-y-6 max-w-5xl">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Staff Management</h2>
          <p className="text-muted-foreground">Manage admin and staff accounts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Create User Form */}
          <div className="rounded-md border bg-card p-6 h-fit">
            <h3 className="text-lg font-medium mb-4">Add New User</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              {message.text && (
                <div className={`text-sm p-3 rounded-md ${message.type === 'error' ? 'bg-[#EF4444]/10 text-[#EF4444]' : 'bg-green-100 text-green-800'}`}>
                  {message.text}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'super_admin' | 'admin' | 'staff')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="staff">Staff</option>
                  {currentUserRole === 'super_admin' && (
                    <>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </>
                  )}
                </select>
              </div>
              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? "Creating..." : "Create User"}
              </Button>
            </form>
          </div>

          {/* Users List */}
          <div className="md:col-span-2 rounded-md border bg-card overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Current Users</h3>
            </div>
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading users...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                    <tr>
                      <th className="px-6 py-3 font-medium">Username</th>
                      <th className="px-6 py-3 font-medium">Role</th>
                      <th className="px-6 py-3 font-medium">Created</th>
                      <th className="px-6 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => (
                      <tr key={admin.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-medium">{admin.username}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${admin.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : admin.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-blue-100 text-blue-800'}`}>
                            {admin.role === 'super_admin' ? 'Super Admin' : admin.role === 'admin' ? 'Admin' : 'Staff'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDelete(admin.id!, admin.role)}
                            className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={admin.role === 'super_admin' || (currentUserRole === 'admin' && admin.role !== 'staff')}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </AdminGuard>
  );
}
