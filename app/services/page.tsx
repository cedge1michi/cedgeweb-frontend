// app/services/page.tsx
// Services（SSR, Strapi v5 Rich Text を直接描画する安全版）

export const runtime = 'nodejs';

import type { Metadata } from "next";
import React from "react";
import { Cover } from "@/components/cover";
import GoogleTagManager from "@/components/google_tag_manager";
import { serviceSite } from "@/lib/definitions";
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
  | { type: 'paragraph'; children?: RawInline[] }
  | { type: 'list'; format?: 'unordered' | 'ordered'; children?: RawListItem[] }
  | { type: 'code'; children?: { type: 'text'; text?: string }[] } // code block
  | { type: 'heading'; level?: number; children?: RawInline[] }
  | { type: string; format?: string; children?: any[] };

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

/* ============== Rich Text 直レンダラ ============== */

// Inline ノードの描画
function renderInline(n: RawInline, key?: React.Key): React.ReactNode {
  switch (n.type) {
    case 'text':
      return <span key={key}>{n.text ?? ''}</span>;
    case 'a':
      return (
        <a
          key={key}
          href={n.url ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-80"
        >
          {(n.children ?? []).map((c, i) => renderInline(c, i))}
        </a>
      );
    case 'code': // inline code
      return (
        <code key={key} className="px-1 py-0.5 rounded bg-slate-100">
          {n.text ?? ''}
        </code>
      );
    default:
      // 未知 inline はテキスト扱い
      return <span key={key}>{(n as any).text ?? ''}</span>;
  }
}

// list-item の描画
function renderListItem(li: RawListItem, key: React.Key) {
  return (
    <li key={key} className="ml-6 my-1 list-disc marker:text-slate-400">
      {(li.children ?? []).map((c, i) => renderInline(c, i))}
    </li>
  );
}

// Block ノードの描画
function renderBlock(b: RawBlock, key: React.Key): React.ReactNode {
  switch (b.type) {
    case 'paragraph':
      return (
        <p key={key} className="my-3 leading-relaxed">
          {(b.children ?? []).map((c, i) => renderInline(c, i))}
        </p>
      );

    case 'list': {
      const items = (b.children ?? []).map((li, i) => renderListItem(li, i));
      if ((b.format ?? 'unordered') === 'ordered') {
        return (
          <ol key={key} className="my-3 ml-6 list-decimal">
            {items}
          </ol>
        );
      }
      return (
        <ul key={key} className="my-3 ml-6 list-disc">
          {items}
        </ul>
      );
    }

    case 'code': {
      const text = (b.children ?? []).map(c => c?.text ?? '').join('\n');
      return (
        <pre key={key} className="my-3 p-3 bg-slate-50 border rounded overflow-x-auto">
          <code>{text}</code>
        </pre>
      );
    }

    case 'heading': {
      // 見出しはレベルに応じてサイズを変える（なければ h3 相当）
      const lvl = (b as any).level ?? 3;
      const children = (b.children ?? []).map((c, i) => renderInline(c, i));
      const classMap: Record<number, string> = {
        1: "text-3xl font-semibold",
        2: "text-2xl font-semibold",
        3: "text-xl font-semibold",
        4: "text-lg font-semibold",
        5: "text-base font-semibold",
        6: "text-base",
      };
      const cls = classMap[Math.min(Math.max(1, Number(lvl)), 6)];
      return <div key={key} className={`my-3 ${cls}`}>{children}</div>;
    }

    default: {
      // 未知ブロック → paragraph として無難に表示
      const children = ((b as any).children ?? []) as RawInline[];
      return (
        <p key={key} className="my-3 leading-relaxed">
          {children.map((c, i) => renderInline(c, i))}
        </p>
      );
    }
  }
}

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
      <div className="mt-3">
        {(item.Description ?? []).map((blk, i) => renderBlock(blk, `${item.documentId}-${i}`))}
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
