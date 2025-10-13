// app/services/page.tsx
// Services（SSR, Strapi v5 Rich Text を直接描画する安全版）

export const runtime = 'nodejs';

import type { Metadata } from "next";
import { Cover } from "@/components/cover";
import GoogleTagManager from "@/components/google_tag_manager";
import { serviceSite } from "@/lib/definitions";
import {
  create_description_element,
  type Description as CEDescription,
  type DescriptionListItem as CEDescriptionListItem,
  type DescriptionText as CEDescriptionText,
} from "@/lib/create_element";
import request, { gql } from "graphql-request";

export const metadata: Metadata = {
  title: "サービス紹介",
  description:
    "サイバーエッジ株式会社が提供するAI、市民開発支援、業種別DXサービスなどのソリューションをご紹介します。",
  alternates: {
    canonical: `${serviceSite.url}/services`,
  },
  openGraph: {
    type: "website",
    url: `${serviceSite.url}/services`,
    title: "サービス紹介",
    description:
      "サイバーエッジ株式会社が提供するAI、市民開発支援、業種別DXサービスなどのソリューションをご紹介します。",
    siteName: serviceSite.name,
    images: [
      {
        url: serviceSite.socialImage,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "サービス紹介",
    description:
      "サイバーエッジ株式会社が提供するAI、市民開発支援、業種別DXサービスなどのソリューションをご紹介します。",
    images: [serviceSite.socialImage],
  },
};

/* ============== Strapi v5: 受け取り生型（最低限） ============== */
type RawInline =
  | { type: 'text'; text?: string }
  | { type: 'a'; url?: string; children?: RawInline[] }
  | { type: 'code'; text?: string }
  | { type: string; text?: string; url?: string; children?: RawInline[] };

type RawListItem = { type: 'list-item'; children?: RawInline[] };

type RawBlock =
  | ({ type: 'paragraph'; children?: RawInline[] })
  | ({ type: 'list'; format?: 'unordered' | 'ordered'; children?: RawListItem[] })
  | ({ type: 'code'; children?: { type: 'text'; text?: string }[] }) // code block
  | ({ type: 'heading'; level?: number; children?: RawInline[] })
  | ({ type: string; format?: string; children?: any[] });

type ServiceItem = {
  documentId: string;
  Title?: string | null;
  URL?: string | null;
  Description?: RawBlock[] | null;
  Order?: number | null;
  Visible?: boolean | null;
};

/* ============== GraphQL ============== */
const ENDPOINT = process.env.GRAPHQL_ENDPOINT_URL || "";

const QUERY = gql`
  query Services {
    services(
      filters: { Visible: { eq: true } }
      sort: ["Order:asc"]
      pagination: { limit: 100 }
    ) {
      documentId
      Title
      URL
      Description
      Order
    }
  }
`;

async function getServices(): Promise<ServiceItem[]> {
  if (!ENDPOINT) {
    console.error("GRAPHQL_ENDPOINT_URL が未設定です");
    return [];
  }
  try {
    const res = await request<{ services: ServiceItem[] }>(
      ENDPOINT,
      QUERY,
      {},
      { "content-type": "application/json" } as any
    );
    return res?.services ?? [];
  } catch (e) {
    console.error("GraphQL failed:", e);
    return [];
  }
}

/* ============== Rich Text 正規化 ============== */

const toDescriptionText = (node: RawInline): CEDescriptionText => ({
  type: node.type ?? "text",
  text: "text" in node ? node.text ?? "" : "",
  url: "url" in node ? node.url ?? "" : "",
  children: "children" in node ? (node.children ?? []).map(toDescriptionText) : [],
});

const toDescriptionListItem = (node: RawListItem): CEDescriptionListItem => ({
  type: node.type ?? "list-item",
  children: (node.children ?? []).map(toDescriptionText),
});

const toDescriptionBlock = (block: RawBlock): CEDescription => {
  if (block.type === "list") {
    return {
      type: "list",
      format: "format" in block ? block.format ?? "unordered" : "unordered",
      children: (block.children ?? []).map(toDescriptionListItem),
    };
  }

  const children = (block.children ?? []) as RawInline[];

  return {
    type: block.type,
    format: "format" in block ? block.format : undefined,
    children: children.map(toDescriptionText),
  };
};

/* ============== 表示 ============== */

function ServiceBlock(item: ServiceItem) {
  return (
    <div className="my-8">
      {/* タイトル：URLがあればリンク */}
      {item.URL ? (
        <a
          href={item.URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl text-slate-700 font-semibold hover:text-slate-600 transition"
        >
          {item.Title}
        </a>
      ) : (
        <div className="text-xl text-slate-700 font-semibold">{item.Title}</div>
      )}

      {/* 説明（RichTextをそのまま描画） */}
      <div className="mt-3 space-y-3">
        {(item.Description ?? []).map((blk, i) => (
          <div key={`${item.documentId}-${i}`}>
            {create_description_element(toDescriptionBlock(blk))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============== ページ（SSR） ============== */

export default async function Services() {
  const services = await getServices();

  return (
    <>
      <GoogleTagManager />
      <main>
        <Cover pathname="/services" />
        <div className="container mx-auto px-6 md:px-20">
          <div className="my-10">
            {services.length === 0 ? (
              <div className="text-slate-500">現在掲載中のサービスはありません。</div>
            ) : (
              services.map((s) => <ServiceBlock key={s.documentId} {...s} />)
            )}
          </div>
        </div>
      </main>
    </>
  );
}
