import { PortfolioSite } from "@/components/portfolio-site";
import { readPortfolioData } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await readPortfolioData();
  return <PortfolioSite content={content} />;
}
