import { AdminShell } from "@/components/admin/AdminShell";
import { ProductsView } from "@/components/admin/ProductsView";

export default function AdminProductsPage() {
  return (
    <AdminShell>
      <ProductsView />
    </AdminShell>
  );
}
