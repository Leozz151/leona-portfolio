import { AdminEditor } from "@/components/admin-editor";
import { readPortfolioData } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const content = await readPortfolioData();
  return <AdminEditor initialContent={content} />;
}
