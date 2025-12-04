export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { Cover } from "@/components/cover";
import GoogleTagManager from "@/components/google_tag_manager";
import type { Description } from "@/lib/create_element";
import { serviceSite } from "@/lib/definitions";
import request, { gql } from "graphql-request";

type SearchParams = {
  q?: string | string[];
};

type EventEntity = {
  documentId?: string | null;
  Title?: string | null;
  Description?: Description[] | null;
  Date?: string | null;
};

const ENDPOINT = process.env.GRAPHQL_ENDPOINT_URL || "";

const SEARCH_SOURCE_QUERY = gql`
  query SearchSource {
    userEvents(
      filters: { Visible: { eq: true } }
      sort: ["Date:desc"]
      pagination: { limit: 100 }
    ) {
      documentId
      Title
      Description
      Date
    }
  }
`;

function normalizeQuery(searchParams?: SearchParams): string {
  const raw = searchParams?.q;
  if (Array.isArray(raw)) {
    return (raw[0] ?? "").trim();
  }
  if (typeof raw === "string") {
    return raw.trim();
  }
  return "";
}

function tokenize(keyword: string): string[] {
  return keyword
    .split(/\s+/)
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
}

function extractPlainText(blocks: Description[] | null | undefined): string {
  if (!blocks || blocks.length === 0) return "";
  const text: string[] = [];
  const walk = (node: any) => {
    if (!node) return;
    if (typeof node.text === "string") {
      text.push(node.text);
    }
    (node.children ?? []).forEach(walk);
  };
  blocks.forEach(walk);
  return text.join(" ").trim();
}

async function fetchSearchSource(): Promise<EventEntity[]> {
  if (!ENDPOINT) {
    console.error("GRAPHQL_ENDPOINT_URL が未設定です。");
    return [];
  }
  try {
    const res = await request<{ userEvents: EventEntity[] }>(ENDPOINT, SEARCH_SOURCE_QUERY);
    return res?.userEvents ?? [];
  } catch (error) {
    console.error("GraphQL search source error:", error);
    return [];
  }
}

async function searchEvents(keyword: string) {
  const tokens = tokenize(keyword);
  if (tokens.length === 0) {
    return {
      tokens,
      results: [],
    };
  }

  const events = await fetchSearchSource();
  const normalized = events.map((event) => {
    const plainText = extractPlainText(event.Description ?? null);
    const haystack = `${event.Title ?? ""} ${plainText}`.toLowerCase();
    return { event, plainText, haystack };
  });

  const results = normalized
    .filter(({ haystack }) => tokens.every((token) => haystack.includes(token)))
    .map(({ event, plainText }) => {
      const snippet = plainText.length <= 140 ? plainText : `${plainText.slice(0, 140)}…`;
      return { event, snippet };
    });

  return {
    tokens,
    results,
  };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: SearchParams;
}): Promise<Metadata> {
  const query = normalizeQuery(searchParams);
  const baseTitle = "サイト内検索";
  const title = query ? `${query} の検索結果` : baseTitle;
  const description = query
    ? `「${query}」に関するニュース・イベント情報を検索した結果です。`
    : "サイバーエッジ株式会社のサイト内検索ページです。";

  const canonical = query
    ? `${serviceSite.url}/search?q=${encodeURIComponent(query)}`
    : `${serviceSite.url}/search`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const query = normalizeQuery(searchParams);
  const { tokens, results } = await searchEvents(query);
  const endpointConfigured = Boolean(ENDPOINT);

  return (
    <>
      <GoogleTagManager />
      <main>
        <Cover pathname="/search" headingLevel="h2" />
        <div className="container mx-auto px-6 md:px-20">
          <section className="my-10 space-y-6">
            <form action="/search" method="get" className="flex flex-col gap-3 md:flex-row">
              <label htmlFor="site-search" className="sr-only">
                サイト内検索
              </label>
              <input
                id="site-search"
                type="search"
                name="q"
                defaultValue={query}
                placeholder="キーワードを入力"
                className="w-full flex-1 rounded border border-slate-300 px-4 py-3 text-base focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
              <button
                type="submit"
                className="rounded bg-orange-500 px-6 py-3 text-white transition hover:bg-orange-400"
              >
                検索
              </button>
            </form>

            {!endpointConfigured && (
              <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                検索対象データを取得するための GraphQL エンドポイントが未設定です。システム管理者にお問い合わせください。
              </div>
            )}

            {tokens.length === 0 ? (
              <p className="text-slate-600">検索ボックスにキーワードを入力し、サイト内のニュースやイベント情報を探してください。</p>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-slate-500">
                  「{query}」の検索結果: {results.length}件
                </p>
                {results.length === 0 ? (
                  <p className="text-slate-600">
                    一致する情報が見つかりませんでした。キーワードを変えて再度お試しください。
                  </p>
                ) : (
                  <ul className="space-y-6">
                    {results.map(({ event, snippet }) => {
                      const id = event.documentId ?? "";
                      const title = (event.Title ?? "").trim() || "イベント情報";
                      const date = event.Date ? new Date(event.Date) : null;

                      return (
                        <li key={`${id}-${title}`} className="rounded border border-slate-200 p-4">
                          <h2 className="text-xl font-semibold text-slate-800">
                            {id ? (
                              <Link href={`/event/${id}`} className="hover:text-orange-500 transition">
                                {title}
                              </Link>
                            ) : (
                              title
                            )}
                          </h2>
                          {date && (
                            <time className="block text-sm text-slate-500" dateTime={date.toISOString()}>
                              {date.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })}
                            </time>
                          )}
                          {snippet && <p className="mt-2 text-slate-600">{snippet}</p>}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
