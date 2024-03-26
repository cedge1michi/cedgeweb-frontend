import Cover from "@/components/cover";
import { UserEventEntity, UserEventEntityResponseCollection } from "@/lib/graphql";
import request, { gql } from "graphql-request";

let gql_res: any;

export default async function Home() {
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

  try {
    gql_res = await request(
      process.env.GRAPHQL_ENDPOINT_URL,
      query
    );
    // console.log(gql_res.userEvents.data);
  }
  catch (e) {
    console.log(e);
  }

  function create_event_element(entity: UserEventEntity) {
    const date = new Date(entity.attributes?.Date);
    return (
      <div className="my-8" key={entity.id}>
        <div className="text-xl text-slate-800 font-semibold py-1">{entity.attributes?.Title}</div>
        <div className="py-1">{date.toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })}</div>
      </div>
    );
  }

  return (
    <div>
      <Cover pathname='/' />
      <div className="container mx-auto px-6 md:px-20">
        <div className="my-10">
          {gql_res.userEvents.data.map((entity: UserEventEntity) => {
            return create_event_element(entity);
          })}
        </div>
      </div>
    </div>
  );
}
