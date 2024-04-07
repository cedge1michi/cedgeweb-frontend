import { Cover } from "@/components/cover";
import { Service, ServiceEntity, ServiceEntityResponseCollection, UserEventEntity, UserEventEntityResponseCollection } from "@/lib/graphql";
import request, { gql } from "graphql-request";
import parse from 'html-react-parser';

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
    text: string
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

  function create_description_element(description: Description) {
    // console.log(description.type);
    switch (description.type) {
      case 'paragraph':
        const text_array = description.children as DescriptionText[];
        return (
          <div>
            {text_array.map((description_text: DescriptionText) => {
              return (
                parse(`<div class="my-3 leading-loose">${description_text.text}</div>`)
              )
            })}
          </div>
        );
        break;
      case 'list':
        const item_array = description.children as DescriptionListItem[];
        let format;
        switch (description.format) {
          case 'unordered':
            format = 'list-disc';
            break;
          case 'ordered':
            format = 'list-decimal';
            break;
        }
        return (
          <div>
            <ul className={format}>
              {item_array.map((list_item: DescriptionListItem) => {
                return list_item.children.map((description_text: DescriptionText) => {
                  return parse(`<li class="ml-8 py-1">${description_text.text}</li>`);
                })
              })}
            </ul>
          </div >
        );
        break;
    }
  }

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
  );
}
