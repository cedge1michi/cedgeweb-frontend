import Cover from "@/components/cover";
import { ServiceEntity, ServiceEntityResponseCollection, UserEventEntity, UserEventEntityResponseCollection } from "@/lib/graphql";
import request, { gql } from "graphql-request";

let gql_res: any;

export default async function Services() {
  const query = gql`
    {
      services(filters: {Visible: {eq: true}}, sort: "Order:asc") {
        data {
          id
          attributes {
            Title
            Description
            Visible
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
    // console.log(gql_res.services.data);
  }
  catch (e) {
    console.log(e);
  }

  function create_element(entity: ServiceEntity) {
    return (
      <div className="my-8" key={entity.id}>
        <div className="text-xl text-slate-800 font-semibold">{entity.attributes?.Title}</div>
        <div>{entity.attributes?.Description[0].children[0].text}</div>
      </div>
    );
  }

  return (
    <div>
      <Cover pathname='/contact' />
      <div className="container mx-auto px-6">
        <div className="my-10">
          <p>
            準備中
          </p>
          <p>
            お急ぎの方は、contact@cyberedge.jpまでご連絡ください。
          </p>
          {/* {gql_res.services.data.map((entity: ServiceEntity) => {
            return create_element(entity);
          })} */}
        </div>
      </div>
    </div>
  );
}
