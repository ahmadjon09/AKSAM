import { AdminShell } from "@/components/admin/AdminShell";
import { DashboardView } from "@/components/admin/DashboardView";

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <DashboardView />
    </AdminShell>
  );
}
