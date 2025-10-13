import type { Metadata } from "next";
import { Cover } from "@/components/cover";
import GoogleTagManager from "@/components/google_tag_manager";
import { serviceSite } from "@/lib/definitions";

/**
 * サイトタイトルとサイト説明を定義する。
 */
export async function generateMetadata(): Promise<Metadata> {
  const title = "お問い合わせ";
  const description =
    "サイバーエッジ株式会社へのお問い合わせフォーム。最先端のテクノロジーを活用したサービスに関するご相談はこちらから承ります。";
  return {
    title,
    description,
    alternates: {
      canonical: `${serviceSite.url}/contact`,
    },
    openGraph: {
      type: "website",
      url: `${serviceSite.url}/contact`,
      title,
      description,
      siteName: serviceSite.name,
      images: [
        {
          url: serviceSite.socialImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [serviceSite.socialImage],
    },
  };
};

export default async function Contact() {
  return (
    <>
      <GoogleTagManager />
      <main>
        <Cover pathname='/contact' />
        <div className="container mx-auto">
          <div className="my-10">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLScgk4HUWyAV_1j8HCZp72EFsjc5hdHGXUS_71ywqlzOob5MkQ/viewform?embedded=true"
              width="100%"
              height="1300"
              frameBorder={0}
              marginHeight={0}
              marginWidth={0}
              title="お問い合わせフォーム"
              >
              読み込んでいます…
            </iframe>
          </div >
        </div >
      </main >
    </>
  );
}
