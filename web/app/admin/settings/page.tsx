import { AdminShell } from "@/components/admin/AdminShell";
import { SettingsView } from "@/components/admin/SettingsView";

export default function AdminSettingsPage() {
  return (
    <AdminShell>
      <SettingsView />
    </AdminShell>
  );
}
