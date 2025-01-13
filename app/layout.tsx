import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { logger } from "@/lib/logger";
import type { OnlineBusiness, WithContext } from "schema-dts";
import { serviceSite } from "@/lib/definitions";

/**
 * 利用するフォントを定義する。
 */
const font = Noto_Sans_JP({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

const jsonLd: WithContext<OnlineBusiness> = {
	"@context": "https://schema.org",
	"@type": "OnlineBusiness",
	url: serviceSite.url,
	logo: serviceSite.logo,
	name: serviceSite.name,
	description: serviceSite.description,
};

/**
 * デフォルトのサイトタイトルとサイト説明を定義する。
 */
// export const metadata: Metadata = {
//   title: "サイバーエッジ株式会社",
//   description: "サイバーエッジ株式会社は、AI、市民開発支援、業種別DXサービスなどの最先端ITリソューションに関する事業開発支援、ITシステムやサービスに関するコンサルティング・システム開発、PCの買取や販売等のリユース事業を通じて、お客様のビジネスをご支援いたします。",
// };
export const metadata: Metadata = {
	title: serviceSite.title,
	description: serviceSite.description,
	keywords: serviceSite.keywords,
	openGraph: {
		type: "website",
		url: serviceSite.url,
		title: serviceSite.title,
		description: serviceSite.description,
		siteName: serviceSite.name,
		images: [
			{
				url: serviceSite.logo,
			},
		],
	},
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
      <head>
      <link rel="icon" href="/favicon.ico" sizes="any" />
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
      </head>
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
