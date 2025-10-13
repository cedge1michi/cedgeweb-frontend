// app/event/[id]/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cover } from "@/components/cover";
import GoogleTagManager from "@/components/google_tag_manager";
import { create_description_element, type Description } from "@/lib/create_element";
import { serviceSite } from "@/lib/definitions";
import request, { gql } from "graphql-request";

const ENDPOINT = process.env.GRAPHQL_ENDPOINT_URL || "";

const QUERY_BY_DOCUMENT_ID = gql`
  query EventByDocumentId($id: ID!) {
    userEvent(documentId: $id) {
      documentId
      Title
      Description
      Date
    }
  }
`;
const QUERY_BY_NUMERIC_ID = gql`
  query EventByNumericId($id: ID!) {
    userEvent(id: $id) {
      documentId
      Title
      Description
      Date
    }
  }
`;

type EventEntity = {
  documentId?: string | null;
  Title?: string | null;
  Description?: Description[] | null;
  Date?: string | null;
};

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

async function getEvent(idParam: string): Promise<EventEntity | null> {
  if (!ENDPOINT) {
    console.error("GRAPHQL_ENDPOINT_URL が未設定です。");
    return null;
  }

  try {
    const r1 = await request<{ userEvent: EventEntity }>(ENDPOINT, QUERY_BY_DOCUMENT_ID, { id: idParam });
    if (r1?.userEvent) return r1.userEvent;
  } catch (error) {
    console.error("GraphQL (documentId) error:", error);
  }

  if (/^\d+$/.test(idParam)) {
    try {
      const r2 = await request<{ userEvent: EventEntity }>(ENDPOINT, QUERY_BY_NUMERIC_ID, { id: idParam });
      if (r2?.userEvent) return r2.userEvent;
    } catch (error) {
      console.error("GraphQL (numeric id) error:", error);
    }
  }
  return null;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const event = await getEvent(params.id);

  if (!event) {
    return {
      title: "イベント情報",
      description: "イベント情報が見つかりませんでした。",
    };
  }

  const title = (event.Title ?? "").trim() || "イベント情報";
  const description =
    extractPlainText(event.Description ?? null) ||
    `${title} に関する詳細情報をご案内します。`;
  const canonicalId = event.documentId ?? params.id;
  const canonicalUrl = `${serviceSite.url}/event/${canonicalId}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
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
}

export default async function Event({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id);

  if (!event) {
    notFound();
  }

  const title = (event.Title ?? "").trim() || "イベント情報";
  const date = event.Date ? new Date(event.Date) : null;
  const rawDesc: Description[] = Array.isArray(event.Description) ? event.Description : [];

  return (
    <>
      <GoogleTagManager />
      <main>
        <Cover pathname="/event" headingLevel="h2" />
        <div className="container mx-auto px-6 md:px-20">
          <article className="my-10">
            <h1 className="py-1 text-2xl font-semibold text-slate-800">{title}</h1>
            {date && (
              <time className="block py-1 text-slate-600" dateTime={date.toISOString()}>
                {date.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })}
              </time>
            )}
            {rawDesc.length > 0 && (
              <div className="py-2 space-y-2">
                {rawDesc.map((block, i) => (
                  <div key={i}>{create_description_element(block)}</div>
                ))}
              </div>
            )}
          </article>
        </div>
      </main>
    </>
  );
}
