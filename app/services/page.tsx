import { Cover } from "@/components/cover";
import GoogleTagManager from "@/components/google_tag_manager";
import { Service, ServiceEntity, ServiceEntityResponseCollection, UserEventEntity, UserEventEntityResponseCollection } from "@/lib/graphql";
import request, { gql } from "graphql-request";
import parse from 'html-react-parser';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import { create_description_element } from "@/lib/create_element";

// 仮想 DOM の作成
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

/**
 * サイトタイトルとサイト説明を定義する。
 */
export async function generateMetadata({ params }: { params: any }) {
  return {
    title: "Services - サイバーエッジ株式会社",
    description: "サイバーエッジ株式会社は、Microsoft Power Platformの活用支援、IT製品・リソーションの新規事業開発、ITシステムのコンサルティングやシステムの開発、PCリユースサービスを通じて、企業が直面する多様な課題に対し、技術的専門知識と業界経験を融合させたカスタマイズされたソリューションを提供します。",
  }
};

let gql_res: any;

export default async function Services() {
  const query = gql`
    query {
      services(filters: {Visible: {eq: true}}, sort: "Order:asc") {
        data {
          id
          attributes {
            Title
            URL
            Description
          }
        }    
      }    
    }
  `;

  try {
    gql_res = await request(
      process.env.GRAPHQL_ENDPOINT_URL || '',
      query
    );
    // console.log(gql_res.services.data);
  }
  catch (e) {
    console.log(e);
  }

  type DescriptionText = {
    type: string,
    text: string,
    url: string,
    children: DescriptionText[]
  }

  type DescriptionListItem = {
    type: string,
    children: DescriptionText[]
  }

  type DescriptionContent = DescriptionText | DescriptionListItem

  type Description = {
    type: string,
    format: string,
    children: DescriptionContent[];
  }

  // function create_description_element(description: Description) {
  //   // console.log(description.type);
  //   switch (description.type) {
  //     case 'paragraph':
  //       const text_array = description.children as DescriptionText[];
  //       return (
  //         <div>
  //           {text_array.map((description_text: DescriptionText) => {
  //             if (description_text.type === "text") {
  //               // return (
  //               //   parse(`<div class="my-3 leading-loose">${description_text.text}</div>`)
  //               // )
  //               // サニタイズ処理を追加
  //               const sanitizedHtml = DOMPurify.sanitize(description_text.text);
  //               return parse(`<div class="my-3 leading-loose">${sanitizedHtml}</div>`);
  //             }
  //             else {
  //               return (
  //                 parse(`<a href="${description_text.url}" target="_blank">${description_text.children[0].text}</a>`)
  //               )
  //             }
  //             // return (
  //             //   parse(`<div class="my-3 leading-loose">${description_text.text}</div>`)
  //             // )
  //           })}
  //         </div>
  //       );
  //       break;
  //     case 'list':
  //       const item_array = description.children as DescriptionListItem[];
  //       let format;
  //       switch (description.format) {
  //         case 'unordered':
  //           format = 'list-disc';
  //           break;
  //         case 'ordered':
  //           format = 'list-decimal';
  //           break;
  //       }
  //       return (
  //         <div>
  //           <ul className={format}>
  //             {item_array.map((list_item: DescriptionListItem) => {
  //               return list_item.children.map((description_text: DescriptionText) => {
  //                 return parse(`<li class="ml-8 py-1">${description_text.text}</li>`);
  //               })
  //             })}
  //           </ul>
  //         </div >
  //       );
  //       break;
  //   }
  // }

  function create_service_element(entity: ServiceEntity) {
    // console.log(`**** id: ${entity.id} ****`);
    const service = entity.attributes as Service;
    return (
      <div className="my-8" key={entity.id}>
        <div className="text-xl text-slate-800 font-semibold">{service.Title}</div>
        <div>
          {service.Description.map((description: Description) => {
            return create_description_element(description);
          })}
        </div>
      </div>
    );
  }

  return (
    <>
      <GoogleTagManager />
      <div>
        <Cover pathname='/services' />
        <div className="container mx-auto px-6 md:px-20">
          <div className="my-10">
            {gql_res.services.data.map((entity: ServiceEntity) => {
              return create_service_element(entity);
            })}
          </div>
        </div>
      </div>
    </>
  );
}
