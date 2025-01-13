import { Cover } from "@/components/cover";
import GoogleTagManager from "@/components/google_tag_manager";
import { UserEventEntity } from "@/lib/graphql";
import { logger } from "@/lib/logger";
import request, { gql } from "graphql-request";
import Link from "next/link";

// ISR指定
// 更新間隔を1分に設定（キャッシュ破棄&データ取得）
export const revalidate = 60;

async function getData() {
  const query = gql`
    {
      userEvents(filters: {Visible: {eq: true}}, sort: "Date:desc") {
        data {
          id
          attributes {
            Title
            Description
            Image {
              data {
                id
                attributes {
                  url
                }
              }
            }
            Date
          }
        }    
      }    
    }
  `;

  let gql_res: any;

  try {
    gql_res = await request(
      process.env.GRAPHQL_ENDPOINT_URL || '',
      query
    );
    // console.log(gql_res.userEvents.data);
  }
  catch (e) {
    console.error(e);
  }

  return gql_res.userEvents;
}

export default async function Home() {
  const user_events: any = await getData();

  function create_event_element(entity: UserEventEntity) {
    const date = new Date(entity.attributes?.Date);
    return (
      <div className="my-8" key={entity.id}>
        <div className="text-xl text-slate-800 font-semibold py-1 hover:text-gray-400">
          <Link href={'/event/' + entity.id}>
            {entity.attributes?.Title}
          </Link>
        </div>
        <div className="py-1">{date.toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })}</div>
      </div>
    );
  }

  return (
    <>
      <GoogleTagManager />
      <div>
        <Cover pathname='/' />
        <div className="container mx-auto px-6 md:px-20">
          <div className="my-10">
            <div className="flex flex-col">
              <div className="text-2xl font-semibold">
                &mdash; OUR SERVICES &mdash;
              </div>
              <div className="mt-4 flex flex-row items-center gap-x-4">
                <a href="https://ecopluspc.cyberedge.jp" target="_blank" className="flex flex-row items-center">
                  <img src="/ECOPLUSPC.png" className="size-12" />
                  <span className="text-xl">
                    法人向けPCリユース
                  </span>
                </a>
                <a href="https://www.sanpou-yoshi.co.jp" target="_blank" className="flex flex-row items-center">
                  <img src="/SANPOU-YOSHI.webp" className="size-12" />
                  <span className="text-xl">
                    会計事務所向け業務支援ツール
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 md:px-20">
          <div className="my-10">
            <div className="flex flex-col">
              <div className="text-2xl font-semibold">
                &mdash; NEWS &mdash;
              </div>
            </div>
            {user_events.data.map((entity: UserEventEntity) => {
              return create_event_element(entity);
            })}
          </div>
        </div>
      </div>
    </>
  );
}
