"use client";
import { useEffect, useState } from "react";
import { adminService } from "@/services/db";

export default function DebugPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  useEffect(() => {
    adminService.getAdmins().then(setAdmins).catch(console.error);
  }, []);
  
  return (
    <div className="p-8 font-mono">
      <h1>Admins in DB</h1>
      <pre>{JSON.stringify(admins, null, 2)}</pre>
    </div>
  );
}
