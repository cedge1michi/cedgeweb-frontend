// app/profile/page.tsx
// Profile（SSR / Strapi v5）— Location.Map がリッチテキスト配列内の inline code(iframe)でも確実に描画

export const runtime = "nodejs";

import type { Metadata } from "next";
import parse from "html-react-parser";
import { Cover } from "@/components/cover";
import GoogleTagManager from "@/components/google_tag_manager";
import { serviceSite } from "@/lib/definitions";
import request, { gql } from "graphql-request";
import {
  create_description_element,
  type Description as CEDescription,
  type DescriptionText as CEDescriptionText,
  type DescriptionListItem as CEDescriptionListItem,
  type DescriptionContent as CEDescriptionContent,
} from "@/lib/create_element";

/* =========================
   GraphQL
   ========================= */
const ENDPOINT = process.env.GRAPHQL_ENDPOINT_URL || "";

const QUERY = gql`
  query ProfilePage {
    profiles(
      filters: { Visible: { eq: true } }
      sort: ["Order:asc"]
      pagination: { limit: 100 }
    ) {
      documentId
      Title
      Description
    }
    locations(
      filters: { Visible: { eq: true } }
      sort: ["Order:asc"]
      pagination: { limit: 100 }
    ) {
      documentId
      Title
      Map
    }
  }
`;

/* =========================
   型（Raw → CE 型へ正規化）
   ========================= */
type RawText = { type: string; text?: string; url?: string; code?: boolean; children?: RawText[] };
type RawListItem = { type: string; children?: RawText[] };
type RawContent = RawText | RawListItem;
type RawBlock = { type: string; format?: string; children?: RawContent[] };

type ProfileItem = {
  documentId: string;
  Title?: string | RawBlock | RawBlock[] | null;
  Description?: string | RawBlock | RawBlock[] | null;
};

type LocationItem = {
  documentId: string;
  Title?: string | RawBlock | RawBlock[] | null;
  Map?:
  | string
  | RawBlock
  | RawBlock[]
  | { url?: string; html?: string; iframe?: string; embedHtml?: string }
  | null;
};

// CE 型へ寄せる（services と同様）
function toCEText(t: RawText): CEDescriptionText {
  return {
    type: t.type,
    text: t.text ?? "",
    url: t.url ?? "",
    children: (t.children ?? []).map(toCEText),
  };
}
function toCEContent(c: RawContent): CEDescriptionContent {
  const isListItem =
    (c as RawListItem).children !== undefined && (c as RawText).type !== "text";
  if (isListItem) {
    const li = c as RawListItem;
    return { type: (c as RawText).type, children: (li.children ?? []).map(toCEText) } as CEDescriptionListItem;
  }
  return toCEText(c as RawText);
}
function toCEDescription(b: RawBlock): CEDescription {
  return { type: b.type, format: b.format ?? "unordered", children: (b.children ?? []).map(toCEContent) };
}

/* =========================
   汎用レンダラ
   ========================= */
const looksHtml = (s: string) => /<[^>]+>/.test(s);
const isUrl = (s: string) => /^https?:\/\//i.test(s);
const extractIframe = (s: string) => s.match(/<iframe[\s\S]*?<\/iframe>/i)?.[0] ?? null;

function extractPlainText(v: string | RawBlock | RawBlock[] | null | undefined): string {
  if (!v) return "";
  if (typeof v === "string") return v;
  const out: string[] = [];
  const walk = (n: any) => {
    if (!n) return;
    if (typeof n.text === "string") out.push(n.text);
    (n.children ?? []).forEach(walk);
  };
  Array.isArray(v) ? v.forEach(walk) : walk(v);
  return out.join(" ").trim();
}

// 説明（リッチテキスト）をそのまま表示
function RenderRich({ value }: { value?: string | RawBlock | RawBlock[] | null }) {
  if (!value) return null;

  if (typeof value === "string") {
    return looksHtml(value) ? <div className="[&_p]:m-0">{parse(value)}</div> : <p className="m-0">{value}</p>;
  }

  if (Array.isArray(value)) {
    return (
      <div className="[&_p]:m-0">
        {(value as RawBlock[]).map((raw, i) => (
          <div key={i}>{create_description_element(toCEDescription(raw))}</div>
        ))}
      </div>
    );
  }

  return <div className="[&_p]:m-0">{create_description_element(toCEDescription(value as RawBlock))}</div>;
}

/* === ここがポイント：Map の配列（RichText 内に iframe 文字列）に対応 === */
function RenderMap({ value }: { value?: LocationItem["Map"] }) {
  if (!value) return <p className="mt-2 text-slate-500">（地図未設定）</p>;

  // 文字列
  if (typeof value === "string") {
    const iframe = extractIframe(value);
    if (iframe) return <div className="mt-2">{parse(iframe)}</div>;
    if (isUrl(value)) {
      return (
        <div className="aspect-video w-full mt-2">
          <iframe
            src={value}
            title="map"
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      );
    }
    return looksHtml(value) ? <div className="mt-2">{parse(value)}</div> : <p className="mt-2 m-0">{value}</p>;
  }

  // 配列（RichText）。まず全ノードから iframe 文字列を抽出して描画。
  if (Array.isArray(value)) {
    const iframes: string[] = [];
    const walk = (n: any) => {
      if (!n) return;
      if (typeof n.text === "string") {
        const f = extractIframe(n.text);
        if (f) iframes.push(f);
      }
      (n.children ?? []).forEach(walk);
    };
    (value as RawBlock[]).forEach(walk);

    if (iframes.length > 0) {
      return (
        <div className="mt-2 space-y-4">
          {iframes.map((html, i) => (
            <div key={i}>{parse(html)}</div>
          ))}
        </div>
      );
    }

    // iframe が見つからなければ、通常のリッチテキストとして表示
    return (
      <div className="mt-2">
        {(value as RawBlock[]).map((raw, i) => (
          <div key={i}>{create_description_element(toCEDescription(raw))}</div>
        ))}
      </div>
    );
  }

  // オブジェクト系（url/html/iframe/embedHtml など）
  const obj = value as Record<string, any>;
  if (typeof obj.url === "string" && isUrl(obj.url)) {
    return (
      <div className="aspect-video w-full mt-2">
        <iframe
          src={obj.url}
          title="map"
          className="h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    );
  }
  const htmlLike = obj.html ?? obj.iframe ?? obj.embedHtml;
  if (typeof htmlLike === "string") {
    const iframe = extractIframe(htmlLike) ?? htmlLike;
    return <div className="mt-2">{parse(iframe)}</div>;
  }
  if (obj.type) {
    return <div className="mt-2">{create_description_element(toCEDescription(obj as RawBlock))}</div>;
  }

  return <p className="mt-2 text-slate-500">（地図未設定）</p>;
}

/* =========================
   行 / ブロック
   ========================= */
const Row = ({
  title,
  desc,
  isLast,
}: {
  title?: string | RawBlock | RawBlock[] | null;
  desc?: string | RawBlock | RawBlock[] | null;
  isLast: boolean;
}) => (
  <div className={`flex items-center gap-4 py-1 ${isLast ? "" : "border-b border-slate-200"}`}>
    <div className="w-48 shrink-0 py-4 leading-6 text-slate-700">
      {typeof title === "string" ? <p className="m-0">{title}</p> : <RenderRich value={title} />}
    </div>
    <div className="flex-1 leading-6 text-slate-700">
      <RenderRich value={desc} />
    </div>
  </div>
);

const LocationBlock = ({
  title,
  map,
}: {
  title?: string | RawBlock | RawBlock[] | null;
  map?: LocationItem["Map"];
}) => {
  return (
    <div className="my-6">
      <div className="text-slate-700 leading-6">【{extractPlainText(title)}】</div>
      <RenderMap value={map} />
    </div>
  );
};

/* =========================
   ページ
   ========================= */
export async function generateMetadata(): Promise<Metadata> {
  const title = "会社概要";
  const description =
    "サイバーエッジ株式会社の企業情報、事業内容、所在地などの会社概要をご紹介します。";
  return {
    title,
    description,
    alternates: {
      canonical: `${serviceSite.url}/profile`,
    },
    openGraph: {
      type: "profile",
      url: `${serviceSite.url}/profile`,
      title,
      siteName: serviceSite.name,
      description,
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
}

async function getData(): Promise<{ profiles: ProfileItem[]; locations: LocationItem[] }> {
  if (!ENDPOINT) return { profiles: [], locations: [] };
  try {
    const res = await request<{ profiles: ProfileItem[]; locations: LocationItem[] }>(
      ENDPOINT,
      QUERY,
      {},
      { "content-type": "application/json" } as any
    );
    const profiles = res?.profiles ?? [];
    const locations = res?.locations ?? [];

    return { profiles, locations };
  } catch (e) {
    console.error("GraphQL error:", e);
    return { profiles: [], locations: [] };
  }
}

export default async function Profile() {
  const { profiles, locations } = await getData();
  const lastIndex = Math.max(0, profiles.length - 1);

  return (
    <>
      <GoogleTagManager />
      <main>
        <Cover pathname="/profile" />
        <div className="container mx-auto px-6 md:px-20">
          <div className="my-8">
            {profiles.map((p, i) => (
              <Row key={p.documentId} title={p.Title} desc={p.Description} isLast={i === lastIndex} />
            ))}

            {locations.length === 0 ? (
              <p className="mt-6 text-slate-500">ロケーションは現在ありません。</p>
            ) : (
              locations.map((l) => <LocationBlock key={l.documentId} title={l.Title} map={l.Map} />)
            )}
          </div>
        </div>
      </main>
    </>
  );
}
