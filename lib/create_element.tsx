import parse from 'html-react-parser';
import { Service, ServiceEntity } from './graphql';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

// 仮想 DOM の作成
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export type DescriptionText = {
  type: string,
  text: string
  url: string,
  children: DescriptionText[];
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
          {text_array.map((description_text: DescriptionText, index: number) => {
            if (description_text.type === "text") {
              // return (
              //   parse(`<div key="${index}" class="my-3 leading-loose">${description_text.text}</div>`)
              // )
                // サニタイズ処理を追加
                const sanitizedHtml = DOMPurify.sanitize(description_text.text);
                return parse(`<div key="${index}" class="my-3 leading-loose">${sanitizedHtml}</div>`);
            }
            else {
              return (
                parse(`<a key="${index}" href="${description_text.url}" target="_blank">${description_text.children[0].text}</a>`)
              )
            }
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
            {item_array.map((list_item: DescriptionListItem, iindex: number) => {
              return list_item.children.map((description_text: DescriptionText, dindex: number) => {
                return parse(`<li key="${iindex}-${dindex}" class="ml-8 py-1">${description_text.text}</li>`);
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
