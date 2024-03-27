import Cover from "@/components/cover";
import { ServiceEntity, ServiceEntityResponseCollection, UserEventEntity, UserEventEntityResponseCollection } from "@/lib/graphql";
import request, { gql } from "graphql-request";

// let gql_res: any;

export default async function Services() {
  //   const query = gql`
  //     mutation {
  //       createContact(
  //         data: {
  //           Title: "Test"
  //           Fullname: "Kaz TAKAHASHI"
  //           Email: "kaz@cyberedge.jp"
  //           Description: "Test"
  //         }
  //       ) {
  //         data {
  //           id
  //         }
  //       }
  //     }
  //   `;

  //   try {
  //     gql_res = await request(
  //       process.env.GRAPHQL_ENDPOINT_URL,
  //       query,
  //       {},
  //       {
  //         authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
  //       }
  //     );
  //     // console.log(gql_res.services.data);
  //   }
  //   catch (e) {
  //     console.log(e);
  //   }

  // function create_element(entity: ServiceEntity) {
  //   return (
  //     <div className="my-8" key={entity.id}>
  //       <div className="text-xl text-slate-800 font-semibold">{entity.attributes?.Title}</div>
  //       <div>{entity.attributes?.Description[0].children[0].text}</div>
  //     </div>
  //   );
  // }

  return (
    <div>
      <Cover pathname='/contact' />
      <div className="container mx-auto">
        <div className="my-10">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLScgk4HUWyAV_1j8HCZp72EFsjc5hdHGXUS_71ywqlzOob5MkQ/viewform?embedded=true"
            width="100%"
            height="1300"
            frameBorder={0}
            marginHeight={0}
            marginWidth={0}
          >
            読み込んでいます…
          </iframe>
        </div >
      </div >
    </div >
  );
}
