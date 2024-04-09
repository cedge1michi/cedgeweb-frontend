import { Cover } from "@/components/cover";
import GoogleTagManager from "@/components/google_tag_manager";
import { ServiceEntity, ServiceEntityResponseCollection, UserEventEntity, UserEventEntityResponseCollection } from "@/lib/graphql";
import request, { gql } from "graphql-request";

/**
 * サイトタイトルとサイト説明を定義する。
 */
export async function generateMetadata({ params }: { params: any }) {
  return {
    title: "Contact - サイバーエッジ株式会社",
    description: "サイバーエッジ株式会社へのお問い合わせはこちらから。最先端のテクノロジーを駆使したサービスで、お客様のビジネスをサポートし、セキュリティ、クラウドソリューション、ITコンサルティングなど、幅広いニーズにお応えいたします。",
  }
};

export default async function Services() {
  return (
    <>
      <GoogleTagManager />
      <div>
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
            >
              読み込んでいます…
            </iframe>
          </div >
        </div >
      </div >
    </>
  );
}
