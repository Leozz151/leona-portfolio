import { NextResponse } from "next/server";
import { defaultContent, mergeContent, PortfolioContent } from "@/lib/portfolio-content";
import { writePortfolioData } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      {
        ok: false,
        message: "檔案寫入 API 僅允許在本地開發環境使用。",
      },
      { status: 403 }
    );
  }

  try {
    const body = (await request.json()) as Partial<PortfolioContent>;
    const nextContent = mergeContent(defaultContent, body);
    await writePortfolioData(nextContent);

    return NextResponse.json({
      ok: true,
      data: nextContent,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "儲存失敗",
      },
      { status: 500 }
    );
  }
}
