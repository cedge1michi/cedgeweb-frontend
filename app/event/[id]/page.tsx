// app/event/[id]/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { Cover } from "@/components/cover";
import GoogleTagManager from "@/components/google_tag_manager";
import request, { gql } from "graphql-request";
import { create_description_element, type Description } from "@/lib/create_element";

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

async function getEvent(idParam: string) {
  try {
    const r1 = await request<{ userEvent: any }>(ENDPOINT, QUERY_BY_DOCUMENT_ID, { id: idParam });
    if (r1?.userEvent) return r1.userEvent;
  } catch { }
  if (/^\d+$/.test(idParam)) {
    try {
      const r2 = await request<{ userEvent: any }>(ENDPOINT, QUERY_BY_NUMERIC_ID, { id: idParam });
      if (r2?.userEvent) return r2.userEvent;
    } catch { }
  }
  return null;
}

export default async function Event({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id);

  if (!event) {
    return (
      <>
        <GoogleTagManager />
        <Cover pathname="/event" />
        <div className="container mx-auto px-6 md:px-20">
          <div className="my-10">イベントが見つかりませんでした。</div>
        </div>
      </>
    );
  }

  const title = (event.Title ?? "").trim();
  const date = event.Date ? new Date(event.Date) : null;
  const rawDesc: Description[] = Array.isArray(event.Description) ? event.Description : [];

  return (
    <>
      <GoogleTagManager />
      <div>
        <Cover pathname="/event" />
        <div className="container mx-auto px-6 md:px-20">
          <div className="my-10">
            <h1 className="text-2xl text-slate-800 font-semibold py-1">{title}</h1>
            {date && (
              <div className="py-1">
                {date.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })}
              </div>
            )}
            {rawDesc.length > 0 && (
              <div className="py-2 space-y-2">
                {rawDesc.map((block, i) => (
                  <div key={i}>{create_description_element(block)}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
