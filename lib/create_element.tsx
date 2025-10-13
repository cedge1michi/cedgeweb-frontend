// lib/create_element.tsx
// SSR対応（Client Componentにしない）・行間/リンク装飾/hover対応

import React from "react";
import parse from "html-react-parser";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";

// --- Node用 DOMPurify 準備（型は any で受けると楽）---
const { window } = new JSDOM("");
// createDOMPurify の型は WindowLike を要求しますが、jsdom の window を any で渡せばOK
const DOMPurify = createDOMPurify(window as any);

// ========= Strapiリッチテキストの型 =========
export type DescriptionText = {
  type: string;
  text?: string;
  url?: string;
  children?: DescriptionText[];
};

export type DescriptionListItem = {
  type: string;
  children?: DescriptionText[];
};

export type DescriptionContent = DescriptionText | DescriptionListItem;

export type Description = {
  type: string;                // "paragraph" | "list" など
  format?: string;             // "unordered" | "ordered" （list時に入ることが多い）
  children?: DescriptionContent[];
};

// ========= ヘルパ：リンク要素を生成 =========
function renderLink(
  description_text: DescriptionText,
  key: React.Key
): React.ReactNode {
  const href = description_text.url ?? "#";
  const label = description_text.children?.[0]?.text ?? description_text.url ?? "";

  return (
    <a
      key={key}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:text-blue-700 underline decoration-current underline-offset-2 transition-colors break-words"
    >
      {label}
    </a>
  );
}

// ========= メイン：ブロックをReact要素に変換 =========
export function create_description_element(description: Description): React.ReactNode {
  switch (description.type) {
    case "paragraph": {
      const text_array = (description.children ?? []) as DescriptionText[];

      // 一つの段落<p>にテキストやリンクを詰める
      const parts = text_array.map((description_text: DescriptionText, index: number) => {
        // 純テキスト
        if (description_text.type === "text") {
          const raw = description_text.text ?? "";
          // HTML混入の可能性もあるので sanitize → parse（不要なら単純に {raw} でもOK）
          const sanitized = DOMPurify.sanitize(raw);
          return (
            <span key={index}>
              {parse(sanitized)}
            </span>
          );
        }
        // リンクノード（typeが"text"以外で url を持っている想定）
        return renderLink(description_text, index);
      });

      // 行間・折り返し
      return (
        <p className="leading-[1.9] whitespace-pre-wrap my-3">
          {parts}
        </p>
      );
    }

    case "list": {
      const item_array = (description.children ?? []) as DescriptionListItem[];
      const format =
        description.format === "ordered"
          ? "list-decimal"
          : "list-disc";

      return (
        <div>
          <ul className={format}>
            {item_array.map((list_item: DescriptionListItem, liIdx: number) => {
              // list_item.children に Textノードが入る前提
              const children = list_item.children ?? [];
              // シンプルに連結（必要ならリンク対応を追加）
              return (
                <li key={liIdx} className="ml-8 py-1">
                  {children.map((t: DescriptionText, i: number) => {
                    if (t.type === "text") {
                      const sanitized = DOMPurify.sanitize(t.text ?? "");
                      return <span key={i}>{parse(sanitized)}</span>;
                    }
                    return renderLink(t, `li-${liIdx}-${i}`);
                  })}
                </li>
              );
            })}
          </ul>
        </div>
      );
    }

    default:
      // 未対応タイプは何も出さない（必要ならデバッグ用に <pre> など）
      return null;
  }
}

// =========（任意）サービス用の整形 =========
// ServiceEntity をここで使う場合だけ有効化してください。
// 型は利用側ファイルで import する前提なので、必要に応じて書き換えてください。
// import { Service, ServiceEntity } from "./graphql";
// export function create_service_element(entity: ServiceEntity) {
//   const service = entity.attributes as Service;
//   return (
//     <div className="my-8" key={entity.id}>
//       <div className="text-xl text-slate-700 font-semibold">{service.Title}</div>
//       <div>
//         {(service.Description ?? []).map((description: Description, i: number) => (
//           <div key={`${entity.id}-${i}`}>{create_description_element(description)}</div>
//         ))}
//       </div>
//     </div>
//   );
// }
