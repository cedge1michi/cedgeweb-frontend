import parse from 'html-react-parser';
import { Service, ServiceEntity } from './graphql';

export type DescriptionText = {
  type: string,
  text: string
}

export type DescriptionListItem = {
  type: string,
  children: DescriptionText[]
}

export type DescriptionContent = DescriptionText | DescriptionListItem

export type Description = {
  type: string,
  format: string,
  children: DescriptionContent[];
}

export function create_description_element(description: Description) {
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

export function create_service_element(entity: ServiceEntity) {
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
