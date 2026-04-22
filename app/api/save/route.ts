import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  // 判斷是否為 Vercel 線上環境 (production)
  // 如果是線上環境，就直接回傳成功，但不執行檔案讀寫，避免 Vercel 報錯
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ message: "Cloud mode: Save functionality is disabled on Vercel to ensure security." });
  }

  try {
    const newData = await request.json();
    // 取得 data.json 的路徑
    const filePath = path.join(process.cwd(), 'data', 'data.json');
    
    // 執行寫入檔案 (這在你的本機電腦 npm run dev 時會正常運作)
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
    
    return NextResponse.json({ message: "Local changes saved successfully to data.json!" });
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json({ error: "Failed to save data locally." }, { status: 500 });
  }
}