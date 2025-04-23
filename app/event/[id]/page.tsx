export const runtime = 'edge';

import { Cover } from "@/components/cover";
import GoogleTagManager from "@/components/google_tag_manager";
import { Description, create_description_element } from "@/lib/create_element";
import { UserEventEntity } from "@/lib/graphql";
import request, { gql } from "graphql-request";
import { Children } from "react";

// SSR指定
export const dynamic = 'force-dynamic'

async function getData(id: number) {
  const query = gql`
    {
      userEvent(id: ${id}) {
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
  }
  catch (e) {
    console.error(e);
  }

  return gql_res.userEvent;
}

export default async function Event({ params }: { params: { id: number } }) {
  const user_event: any = await getData(params.id);

  function create_event_element(entity: UserEventEntity) {
    const date = new Date(entity.attributes?.Date);
    return (
      <div className="my-8" key={entity.id}>
        <h1 className="text-2xl text-slate-800 font-semibold py-1">{entity.attributes?.Title}</h1>
        <div className="py-1">{date.toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })}</div>
        <div className="py-1">
          {entity.attributes?.Description && entity.attributes?.Description.map(
            (description: Description) => {
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
        <Cover pathname='/event' />
        <div className="container mx-auto px-6 md:px-20">
          <div className="my-10">
            {
              create_event_element(user_event.data)
            }
          </div>
        </div>
      </div>
    </>
  );
}
