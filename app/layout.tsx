import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { logger } from "@/lib/logger";
import { serviceSite } from "@/lib/definitions";

/**
 * 利用するフォントを定義する。
 */
const font = Noto_Sans_JP({
	weight: ["400", "500"],
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	metadataBase: new URL(serviceSite.url),
	title: {
		default: serviceSite.title,
		template: `%s | ${serviceSite.name}`,
	},
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
				url: serviceSite.socialImage,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: serviceSite.title,
		description: serviceSite.description,
		images: [serviceSite.socialImage],
	},
	icons: {
		icon: [{ url: "/favicon.ico", sizes: "any" }],
	},
	alternates: {
		canonical: serviceSite.url,
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
