import type { Metadata } from "next";
import { Noto_Serif_TC, Space_Grotesk } from "next/font/google";
import "./globals.css";

const notoSerifTc = Noto_Serif_TC({
  variable: "--font-noto-serif-tc",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "PM Portfolio",
  description: "科技業產品經理作品集，聚焦教育科技、AR 應用、產品提案與使用者洞察。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body className={`${notoSerifTc.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
