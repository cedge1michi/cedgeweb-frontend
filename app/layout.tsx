import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

/**
 * 利用するフォントを定義する。
 */
const font = Noto_Sans_JP({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

/**
 * デフォルトのサイトタイトルとサイト説明を定義する。
 */
export const metadata: Metadata = {
  title: "サイバーエッジ株式会社",
  description: "サイバーエッジ株式会社は、AI、市民開発支援、業種別DXサービスなどの最先端ITリソューションに関する事業開発支援、ITシステムやサービスに関するコンサルティング・システム開発、PCの買取や販売等のリユース事業を通じて、お客様のビジネスをご支援いたします。",
};

/**
 * 全体レイアウトのhtml要素を生成する。
 * @param children 各ページのdiv要素
 * @returns html要素
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`
        ${font.className}
        text-base
        text-gray-700
      `}>
        <div id="header" className="relative z-20 h-20">
          <div className="fixed top-0 w-full bg-white">
            <Header />
          </div>
        </div>
        <div id="body" className="relative z-10">
          {children}
        </div>
        <div id="footer" className="relative z-20">
          <div className="">
            <Footer />
          </div>
        </div>
      </body>
    </html >
  );
}
