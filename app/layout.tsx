import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { GTM_ID, pageview } from "@/lib/gtm";
import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * 利用するフォントを定義する。
 */
const font = Noto_Sans_JP({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

/**
 * サイトのタイトルと説明を定義する。
 */
export const metadata: Metadata = {
  title: "サイバーエッジ株式会社",
  description: "IT製品・リソューションやサービスに関する新規事業開発支援、ITシステムやサービスに関する企画・コンサルティング・システム開発・保守運用、リユース事業について、持続可能なビジネスへとご支援いたします。"
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
  const pathname = usePathname()
  if (pathname) {
    pageview(pathname);
  }

  return (
    <html lang="ja">
      <body className={`
        ${font.className}
        text-base
        text-gray-700
      `}>
        <Script
          id={GTM_ID}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer', '${GTM_ID}');
            `,
          }}
        />
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
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
