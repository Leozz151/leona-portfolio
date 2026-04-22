import { promises as fs } from "node:fs";
import path from "node:path";
import { defaultContent, mergeContent, PortfolioContent } from "@/lib/portfolio-content";

export const DATA_FILE_PATH = path.join(process.cwd(), "data", "data.json");

export async function readPortfolioData(): Promise<PortfolioContent> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<PortfolioContent>;
    return mergeContent(defaultContent, parsed);
  } catch {
    return defaultContent;
  }
}

export async function writePortfolioData(content: PortfolioContent): Promise<void> {
  const next = mergeContent(defaultContent, content);
  await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(next, null, 2), "utf8");
}
