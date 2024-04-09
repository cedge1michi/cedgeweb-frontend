import { Cover } from "@/components/cover";
import GoogleTagManager from "@/components/google_tag_manager";
import { UserEventEntity } from "@/lib/graphql";
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
            {user_events.data.map((entity: UserEventEntity) => {
              return create_event_element(entity);
            })}
          </div>
        </div>
      </div>
    </>
  );
}
