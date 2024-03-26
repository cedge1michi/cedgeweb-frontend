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
      <div className="container mx-auto px-6 md:px-20">
        <div className="my-10">
          <form>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-xl font-semibold leading-7 text-gray-900">お問い合わせフォーム</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  下記フォームからご連絡ください。※ 工事中につき、contact@cyberedge.jpまでご連絡ください。
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">
                  <div className="sm:col-span-5">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                      会社名
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-7">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                      Eメールアドレス
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                      お名前(姓)
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        autoComplete="family-name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                      お名前(名)
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                      お問い合わせ内容
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="about"
                        name="about"
                        rows={6}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={''}
                      />
                    </div>
                  </div>
                </div>
              </div>


              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  送信
                </button>
              </div>
            </div>
          </form>
        </div >
      </div >
    </div >
  );
}
