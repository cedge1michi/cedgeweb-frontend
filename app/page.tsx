export const runtime = 'nodejs'; // 明示的に Node ランタイムでSSR

import { Cover } from "@/components/cover";
import GoogleTagManager from "@/components/google_tag_manager";
import request, { gql } from "graphql-request";
import Link from "next/link";

// ===== GraphQL 型（必要最小限） =====
type UserEvent = {
  documentId: string;
  Title?: string | null;
  Description?: string | null;
  Date?: string | null;
  Image?: { url: string } | null;
  Visible?: boolean | null;
};

// ===== GraphQL エンドポイント =====
const ENDPOINT = process.env.GRAPHQL_ENDPOINT_URL || "";

// ===== NEWS 取得クエリ =====
const QUERY = gql`
  query UserEvents {
    userEvents(
      filters: { Visible: { eq: true } }
      sort: ["Date:desc"]
      pagination: { limit: 50 }
    ) {
      documentId
      Title
      Description
      Date
      Image { url }
    }
  }
`;

// ===== NEWS データ取得（サーバー側で実行：SSR） =====
async function getNews(): Promise<UserEvent[]> {
  if (!ENDPOINT) {
    console.error("GRAPHQL_ENDPOINT_URL が未設定です。");
    return [];
  }
  try {
    const res = await request<{ userEvents: UserEvent[] }>(ENDPOINT, QUERY, {}, {
      // Strapi GraphQL の CSRF 防止に合わせて content-type を明示
      "content-type": "application/json",
    } as any);
    return res?.userEvents ?? [];
  } catch (e) {
    console.error("GraphQL failed:", e);
    return [];
  }
}

/* ------------------------------
   OUR SERVICES セクション（静的）
   ------------------------------ */
function OurServices() {
  return (
    <section className="container mx-auto px-6 md:px-20">
      <div className="mt-10 mb-4">
        <h2 className="text-2xl text-slate-700 tracking-wide">
          &mdash; OUR SERVICES &mdash;
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-10 gap-6">
        <a
          href="https://ecopluspc.cyberedge.jp"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:opacity-75 transition"
        >
          <img src="/ECOPLUSPC.png" alt="ECOPLUSPC" className="h-14 w-14 object-contain" />
          <span className="text-xl text-slate-700">法人向けPCリユース</span>
        </a>

        <a
          href="https://www.sanpou-yoshi.co.jp"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:opacity-75 transition"
        >
          <img src="/SANPOU-YOSHI.webp" alt="SANPOU-YOSHI" className="h-14 w-14 object-contain" />
          <span className="text-xl text-slate-700">会計事務所向け業務支援ツール</span>
        </a>
      </div>
    </section>
  );
}

/* ------------------------------
   NEWS セクション
   ------------------------------ */
function NewsSection({ items }: { items: UserEvent[] }) {
  return (
    <section className="container mx-auto px-6 md:px-20">
      <div className="my-10">
        <h2 className="text-2xl tracking-wide text-slate-700">
          &mdash; NEWS &mdash;
        </h2>

        {items.length === 0 ? (
          <div className="mt-4 text-slate-500">現在お知らせはありません。</div>
        ) : (
          <div className="mt-2">
            {items.map((ev) => {
              const dateStr = ev.Date
                ? new Date(ev.Date).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })
                : "";
              return (
                <div className="my-6" key={ev.documentId}>
                  <h3 className="text-xl text-slate-700 py-1 hover:text-slate-500">
                    <Link href={`/event/${ev.documentId}`}>{ev.Title ?? "(no title)"}</Link>
                  </h3>
                  <div className="py-1 text-slate-600">{dateStr}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------
   ページ（サーバーコンポーネント：SSR）
   ------------------------------ */
export default async function Home() {
  const news = await getNews();

  return (
    <>
      <GoogleTagManager />
      <div>
        <Cover pathname="/" />
        <OurServices />
        <NewsSection items={news} />
      </div>
    </>
  );
}
